// Google Gemini API service for AI analysis

import { getUserProfile, getDailyLogs } from '../firebase/firestore';
import { AIAnalysis } from '../../types';

// Initialize Gemini API
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn('Gemini API key is not configured');
}

// Base URL for v1beta endpoints (text generation)
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Format daily logs for the prompt
 */
function formatDailyLogs(logs: any[]): string {
  if (logs.length === 0) {
    return 'No daily logs available.';
  }

  return logs
    .map((log, index) => {
      const coreSubjectsStr = log.coreSubjects
        .map((cs: any) => `  - ${cs.name}: ${cs.hours} hours`)
        .join('\n');

      return `Day ${index + 1} (${log.date}):
- DSA Hours: ${log.dsaHours}
- DSA Topics: ${log.dsaTopics}
- Core Subjects:
${coreSubjectsStr}
- Projects/Practice: ${log.projects}
- Self-Rating: ${log.selfRating}/5`;
    })
    .join('\n\n');
}

/**
 * Parse Gemini API response into structured format
 */
function parseAIResponse(response: string): AIAnalysis {
  const result: Partial<AIAnalysis> = {
    consistencyAnalysis: '',
    weakAreas: [],
    strengths: [],
    actionPlan: {
      days1to3: '',
      days4to5: '',
      days6to7: '',
    },
    readinessScore: 0,
  };

  // Extract Consistency Analysis
  const consistencyMatch = response.match(
    /Consistency Analysis:\s*\n\s*-\s*(.+?)(?=\n\n|\nWeak Areas:|$)/s
  );
  if (consistencyMatch) {
    result.consistencyAnalysis = consistencyMatch[1].trim();
  }

  // Extract Weak Areas
  const weakAreasMatch = response.match(
    /Weak Areas:\s*\n((?:- .+\n?)+)(?=\nStrengths:|$)/s
  );
  if (weakAreasMatch) {
    result.weakAreas = weakAreasMatch[1]
      .split('\n')
      .filter((line) => line.trim().startsWith('-'))
      .map((line) => line.replace(/^-\s*/, '').trim())
      .filter((item) => item.length > 0);
  }

  // Extract Strengths
  const strengthsMatch = response.match(
    /Strengths:\s*\n((?:- .+\n?)+)(?=\nNext 7-Day Action Plan:|$)/s
  );
  if (strengthsMatch) {
    result.strengths = strengthsMatch[1]
      .split('\n')
      .filter((line) => line.trim().startsWith('-'))
      .map((line) => line.replace(/^-\s*/, '').trim())
      .filter((item) => item.length > 0);
  }

  // Extract Action Plan (handle both regular dash and em dash)
  const actionPlanMatch = response.match(
    /Next 7-Day Action Plan:\s*\n-?\s*Day\s*1[–-]\s*3:\s*(.+?)\n-?\s*Day\s*4[–-]\s*5:\s*(.+?)\n-?\s*Day\s*6[–-]\s*7:\s*(.+?)(?=\nOverall Readiness Score:|$)/s
  );
  if (actionPlanMatch) {
    result.actionPlan = {
      days1to3: actionPlanMatch[1].trim(),
      days4to5: actionPlanMatch[2].trim(),
      days6to7: actionPlanMatch[3].trim(),
    };
  }

  // Extract Readiness Score
  const scoreMatch = response.match(/Overall Readiness Score:\s*\n-?\s*(\d+)\/100/);
  if (scoreMatch) {
    result.readinessScore = parseInt(scoreMatch[1], 10);
  }

  return result as AIAnalysis;
}

/**
 * Call Gemini model via REST (v1beta)
 */
async function callGeminiModel(model: string, prompt: string): Promise<string> {
  const url = `${GEMINI_BASE_URL}/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    data?.candidates?.[0]?.output ||
    '';

  if (!text) {
    throw new Error('No text returned from Gemini');
  }

  return text;
}

/**
 * Analyze placement readiness using Gemini API
 */
export async function analyzePlacementReadiness(
  userId: string
): Promise<AIAnalysis> {
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  // Verify API key format (should start with AIza)
  const apiKeyValue = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKeyValue || !apiKeyValue.startsWith('AIza')) {
    throw new Error('Invalid Gemini API key format. API keys should start with "AIza". Please check your .env file.');
  }

  try {
    // Fetch user profile and daily logs
    const [userProfile, dailyLogs] = await Promise.all([
      getUserProfile(userId),
      getDailyLogs(userId),
    ]);

    if (!userProfile) {
      throw new Error('User profile not found. Please complete your profile first.');
    }

    if (dailyLogs.length === 0) {
      throw new Error('No daily logs found. Please add some preparation logs first.');
    }

    // Format the prompt
    const formattedLogs = formatDailyLogs(dailyLogs);
    const prompt = `Analyze the following student placement preparation data collected over recent days.

Student Profile:
- Branch: ${userProfile.branch}
- Graduation Year: ${userProfile.graduationYear}

Daily Preparation Logs:
${formattedLogs}

Your tasks:
1. Analyze preparation consistency (frequency, gaps, streaks).
2. Identify weak areas based on low or irregular time spent.
3. Identify strengths based on consistent effort.
4. Suggest clear, practical next steps for the next 7 days.
5. Provide an overall readiness score out of 100.

Response format (STRICT — follow exactly):

Consistency Analysis:
- <short paragraph>

Weak Areas:
- <bullet list>

Strengths:
- <bullet list>

Next 7-Day Action Plan:
- Day 1–3: <action>
- Day 4–5: <action>
- Day 6–7: <action>

Overall Readiness Score:
- <number>/100

Rules:
- Be concise and realistic
- Avoid motivational fluff
- No emojis
- No long explanations`;

    // Call Gemini API (v1beta REST) with fallback models
    const modelNames = [
      'gemini-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest',
    ];

    let lastError: any = null;

    for (const modelName of modelNames) {
      try {
        console.log(`Trying Gemini model: ${modelName}`);
        const resultText = await callGeminiModel(modelName, prompt);
        console.log(`Successfully used model: ${modelName}`);
        return parseAIResponse(resultText);
      } catch (error: any) {
        console.error(`Model ${modelName} failed:`, error.message);
        lastError = error;

        // If it's a 404 (model not found), try next model
        if (error.message?.includes('404') || 
            error.message?.includes('not found') ||
            error.message?.includes('is not found')) {
          continue; // Try next model
        }

        // If it's an API key error (401, 403), throw immediately
        if (error.message?.includes('401') || 
            error.message?.includes('403') ||
            error.message?.includes('API key') ||
            error.message?.includes('permission') ||
            error.message?.includes('invalid')) {
          throw new Error(`API key error: ${error.message}. Please verify your Gemini API key in the .env file.`);
        }

        // If it's a quota/billing error, throw immediately
        if (error.message?.includes('quota') || 
            error.message?.includes('billing') ||
            error.message?.includes('429')) {
          throw new Error(`Quota/billing error: ${error.message}. Please check your Google Cloud billing settings.`);
        }

        // For other errors, try next model
        continue;
      }
    }

    // If all models failed, provide detailed error message
    const errorDetails = lastError?.message || 'Unknown error';
    throw new Error(
      `All Gemini models failed. Last error: ${errorDetails}. ` +
      `Please verify:\n` +
      `1. Your API key is correct in .env file (should start with "AIza")\n` +
      `2. Your API key has access to Generative Language API\n` +
      `3. Billing is enabled in Google Cloud Console\n` +
      `4. The API key is not restricted to specific APIs`
    );
  } catch (error: any) {
    console.error('Error analyzing placement readiness:', error);
    if (error.message.includes('API key')) {
      throw new Error('Gemini API key is invalid or missing');
    }
    throw new Error(error.message || 'Failed to analyze placement readiness');
  }
}

