// src/services/gemini/geminiService.ts
// Google Gemini API service for AI analysis with SambaNova fallback

import { getUserProfile, getWeeklyLogs } from '../firebase/firestore';
import type { AIAnalysis, DailyLog } from '../../types';

// Initialize API Keys
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const sambaKey = import.meta.env.VITE_SAMBANOVA_API_KEY;

if (!apiKey) {
  // eslint-disable-next-line no-console
  console.warn('Gemini API key is not configured');
}

if (!sambaKey) {
  // eslint-disable-next-line no-console
  console.warn('SambaNova API key is not configured (backup service disabled)');
}

// Base URL for Gemini v1beta endpoints
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

type AIAnalysisJson = AIAnalysis;

/**
 * Format daily logs for the prompt (limited to last 14 entries to save tokens).
 */
function formatDailyLogs(logs: DailyLog[]): string {
  if (logs.length === 0) {
    return 'No daily logs available.';
  }

  // Ensure createdAt is a Date before calling getTime
  const normalizedLogs = logs.map((log) => {
    const raw = log.createdAt as unknown;

    let createdAt: Date;
    if (raw instanceof Date) {
      createdAt = raw;
    } else if (
      raw &&
      typeof raw === 'object' &&
      'seconds' in raw &&
      typeof (raw as { seconds: number }).seconds === 'number'
    ) {
      createdAt = new Date((raw as { seconds: number }).seconds * 1000);
    } else {
      createdAt = new Date(raw as string);
    }

    return { ...log, createdAt };
  });


  // Sort by createdAt (descending) and take top 14, then reverse to chronological order
  const recentLogs = normalizedLogs
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 14)
    .reverse();

  return recentLogs
    .map((log) => {
      const coreSubjectsStr = (log.coreSubjects || [])
        .map((cs: any) => {
          const topicStr =
            cs.topics && Array.isArray(cs.topics) && cs.topics.length
              ? ` (Topics: ${cs.topics.join(', ')})`
              : '';
          return ` - ${cs.name}: ${cs.hours}h${topicStr}`;
        })
        .join('\n');

      return `Date: ${log.date}
- DSA: ${log.dsaHours}h (${log.dsaTopics})
- Core Subjects:
${coreSubjectsStr || ' - None logged'}
- Projects: ${log.projects}
- Rating: ${log.selfRating}/5`;
    })
    .join('\n\n');
}

/**
 * Call Gemini model via REST with JSON schema enforcement.
 * Returns a parsed AIAnalysisJson object.
 */
async function callGeminiModel(
  model: string,
  prompt: string,
): Promise<AIAnalysisJson> {
  const url = `${GEMINI_BASE_URL}/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      response_mime_type: 'application/json',
      temperature: 0.2,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API Error ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  const candidate = data?.candidates?.[0];

  // Safety filters
  if (candidate?.finishReason === 'SAFETY') {
    throw new Error('AI analysis was blocked by safety filters.');
  }

  const text: string | undefined = candidate?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('No analysis returned from Gemini.');
  }

  try {
    return JSON.parse(text) as AIAnalysisJson;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse Gemini JSON:', text);
    throw new Error('Gemini returned invalid data format.');
  }
}

/**
 * Call SambaNova (Llama 3.1) as a backup.
 * Returns a parsed AIAnalysisJson object.
 */
async function callSambaNova(prompt: string): Promise<AIAnalysisJson> {
  if (!sambaKey) {
    throw new Error('SambaNova API key missing');
  }

  const response = await fetch('https://api.sambanova.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sambaKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'Meta-Llama-3.1-8B-Instruct',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert career counselor. You MUST output valid JSON only.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      top_p: 0.1,
    }),
  });

  if (!response.ok) {
    throw new Error(`SambaNova Error: ${response.statusText}`);
  }

  const data = await response.json();
  const content: string | undefined = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('SambaNova returned empty response');
  }

  try {
    const cleanJson = content.replace(/``````/g, '').trim();
    return JSON.parse(cleanJson) as AIAnalysisJson;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse SambaNova JSON:', content);
    throw new Error('SambaNova returned invalid data format.');
  }
}

/**
 * Analyze placement readiness using waterfall logic:
 * 1) Gemini 2.5 Flash
 * 2) SambaNova Llama 3.1
 * 3) Gemini 2.5 Pro
 */
export async function analyzePlacementReadiness(
  userId: string,
): Promise<AIAnalysis> {
  if (!apiKey || !apiKey.startsWith('AIza')) {
    throw new Error('Invalid or missing Gemini API key in .env file.');
  }

  try {
    // 1. Fetch profile and recent logs
    const [userProfile, dailyLogs] = await Promise.all([
      getUserProfile(userId),
      getWeeklyLogs(userId),
    ]);

    if (!userProfile) {
      throw new Error('User profile not found.');
    }

    if (!dailyLogs || dailyLogs.length === 0) {
      throw new Error('No recent logs found to analyze.');
    }

    // 2. Construct the prompt
    const formattedLogs = formatDailyLogs(dailyLogs);

    const targetRole = (userProfile as any).targetRole || 'Software Engineer';

    const prompt = `You are an expert Placement Mentor for Computer Science students.
Analyze the student's preparation data and provide a structured JSON response.

Student Target: ${targetRole}
Branch: ${userProfile.branch} (${userProfile.graduationYear})

Preparation Logs (Last 14 Days):
${formattedLogs}

Instructions:
1. Analyze consistency and effort trends.
2. Identify specific weak areas (topics skipped or low hours).
3. Identify strengths.
4. Create a specific action plan for the next 7 days.
5. Assign a readiness score (0-100).

Strict Output Format (JSON only):

{
  "consistencyAnalysis": "string (2-3 sentences)",
  "weakAreas": ["string", "string"],
  "strengths": ["string", "string"],
  "actionPlan": {
    "days1to3": "string (specific tasks)",
    "days4to5": "string (specific tasks)",
    "days6to7": "string (specific tasks)"
  },
  "readinessScore": number
}
`;

    // 3. Waterfall strategy: try models in order of speed/cost

    // Attempt 1: Gemini 2.5 Flash (primary)
    try {
      // eslint-disable-next-line no-console
      console.log('Analyzing with Gemini 2.5 Flash...');
      return await callGeminiModel('gemini-2.5-flash', prompt);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.warn(`Gemini Flash failed: ${error.message}. Switching to backup...`);

      if (error.message?.includes('API key')) {
        throw error;
      }
    }

    // Attempt 2: SambaNova Llama 3.1 (backup)
    try {
      // eslint-disable-next-line no-console
      console.log('Analyzing with SambaNova (Llama 3.1)...');
      return await callSambaNova(prompt);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.warn(`SambaNova failed: ${error.message}. Switching to last resort...`);
    }

    // Attempt 3: Gemini 2.5 Pro (last resort)
    try {
      // eslint-disable-next-line no-console
      console.log('Analyzing with Gemini 2.5 Pro...');
      return await callGeminiModel('gemini-2.5-pro', prompt);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('All models failed. Last error:', error);
      throw new Error(
        'All AI services are currently busy or unavailable. Please try again later.',
      );
    }
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Analysis process failed:', error);
    throw new Error(error.message || 'Failed to analyze placement readiness');
  }
}
