import { Link } from 'react-router-dom';
import {
    Brain,
    Target,
    TrendingUp,
    ArrowRight,
    CheckCircle,
    BarChart2,
    Moon,
    Zap,
    Layout,
    MessageSquare,
    ChevronRight,
    Code
} from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans selection:bg-blue-100 selection:text-blue-900">


            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <BarChart2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400">
                                PrepSense
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">

                        {/* Left Content */}
                        <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-300 text-xs font-bold tracking-wide uppercase mb-6">
                                <span className="w-2 h-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                                AI Placement Readiness Tracker
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
                                Master Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                                    Placement Prep
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Stop preparing blindly. Track your daily progress, get AI-powered insights, and visualize your readiness to crack your dream company.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/40 hover:-translate-y-1 transition-all"
                                >
                                    Get Started
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                                <a
                                    href="#how-it-works"
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                                >
                                    How it works
                                </a>
                            </div>
                        </div>

                        {/* Right Visual - 3D Mockup */}
                        <div className="lg:col-span-6 perspective-1000 relative">
                            <div className="relative transform rotate-y-minus-12 rotate-x-6 hover:rotate-y-minus-6 hover:rotate-x-3 transition-transform duration-700 ease-out preserve-3d">
                                {/* Glass Card Background */}
                                <div className="absolute inset-0 bg-blue-600 blur-[100px] opacity-20 rounded-full pointer-events-none"></div>

                                {/* Main Dashboard Card */}
                                <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 z-10">
                                    {/* Fake Header */}
                                    <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-700 pb-4">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        </div>
                                        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Dashboard Preview</div>
                                    </div>

                                    {/* Chart Area - Expanded Vertical Graph */}
                                    <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-end justify-between gap-4 h-48 px-2">
                                            {/* Bar 1 */}
                                            <div className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-lg h-[40%] relative group">
                                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">40%</div>
                                            </div>
                                            {/* Bar 2 */}
                                            <div className="w-full bg-blue-200 dark:bg-blue-800/40 rounded-t-lg h-[60%] relative group">
                                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">60%</div>
                                            </div>
                                            {/* Bar 3 */}
                                            <div className="w-full bg-blue-300 dark:bg-blue-700/50 rounded-t-lg h-[50%] relative group">
                                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">50%</div>
                                            </div>
                                            {/* Bar 4 */}
                                            <div className="w-full bg-blue-400 dark:bg-blue-600/60 rounded-t-lg h-[75%] relative group">
                                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">75%</div>
                                            </div>
                                            {/* Bar 5 (Highlight) */}
                                            <div className="w-full bg-blue-600 dark:bg-blue-500 rounded-t-lg h-[90%] relative group shadow-lg shadow-blue-500/30">
                                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">90%</div>
                                            </div>
                                        </div>
                                        {/* X-Axis Lines */}
                                        <div className="mt-2 h-px bg-slate-200 dark:bg-slate-700 w-full"></div>
                                    </div>

                                    {/* AI Pill & Status */}
                                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50 rounded-xl p-4 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800/40 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-green-900 dark:text-green-300 text-sm">Ready for Interview</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                    <span className="text-xs text-green-700 dark:text-green-400 font-medium">System Online</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 hidden sm:block">
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-2">AI Recommendation:</span>
                                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Focus on DSA</span>
                                        </div>
                                    </div>

                                    {/* Floating Element */}
                                    <div className="absolute -right-8 top-1/2 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 animate-float">
                                        <Brain className="w-8 h-8 text-purple-600" />
                                        <div className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">AI Analysis</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section - Glassmorphism */}
            <section id="how-it-works" className="py-24 bg-white dark:bg-slate-800 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-base font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase mb-3">Simple Workflow</h2>
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                            How It Works
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Login', desc: 'Securely access your dashboard.', icon: <Layout className="w-6 h-6" /> },
                            { step: '02', title: 'Log Daily', desc: 'Track your problems & topics.', icon: <Code className="w-6 h-6" /> },
                            { step: '03', title: 'AI Analyze', desc: 'Get instant feedback on gaps.', icon: <Brain className="w-6 h-6" /> },
                            { step: '04', title: 'Improve', desc: 'Follow the roadmap to success.', icon: <TrendingUp className="w-6 h-6" /> },
                        ].map((item, index) => (
                            <div key={index} className="relative group">
                                <div className="absolute inset-0 bg-blue-500 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                                <div className="relative p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:-translate-y-1">
                                    <div className="text-4xl font-black text-black dark:text-slate-200 mb-4">{item.step}</div>
                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-blue-600 mb-6 border border-slate-100 dark:border-slate-700">
                                        {item.icon}
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                                    <p className="text-slate-500 dark:text-slate-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Challenge Section - Reverted to Centered */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
                            Why Most Students <span className="text-red-500">Struggle</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                            Placement preparation is often chaotic. Solving random problems without a plan leads to gaps in knowledge.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <Zap className="w-6 h-6 text-red-500" />, title: 'Random Practice', desc: 'No structured roadmap leads to confusion.' },
                            { icon: <MessageSquare className="w-6 h-6 text-orange-500" />, title: 'No Feedback', desc: 'Never knowing if you are truly interview-ready.' },
                            { icon: <Moon className="w-6 h-6 text-purple-500" />, title: 'Lost Consistency', desc: 'Starting strong but fading out after a week.' },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all">
                                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-6">
                                    {item.icon}
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h4>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section - Premium Cards */}
            <section className="py-24 bg-white dark:bg-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase mb-3">The Solution</h2>
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                            Everything You Need to Succeed
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Daily Tracking', icon: <Target className="w-6 h-6" />, color: 'blue', desc: 'Log your topics, problems, and study time. Keep a detailed history of your grind.' },
                            { title: 'AI Analysis', icon: <Brain className="w-6 h-6" />, color: 'indigo', desc: 'Get personalized feedback and improvement plans powered by Google Gemini AI.' },
                            { title: 'Visual Insights', icon: <BarChart2 className="w-6 h-6" />, color: 'purple', desc: 'See your growth over time with interactive charts and comprehensive dashboards.' },
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-300">
                                <div className={`w-14 h-14 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900/30 text-${feature.color}-600 dark:text-${feature.color}-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h4>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                                <div className="mt-6 flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                                    Learn more <ChevronRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-slate-50 dark:bg-black">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 sm:p-16 text-center overflow-hidden shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
                                Ready to start your journey?
                            </h2>
                            <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
                                Join other students who are organizing their preparation effectively. Build consistency, gain insights, and get placed.
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-600 bg-white rounded-xl shadow-lg hover:bg-blue-50 hover:scale-105 transition-all"
                            >
                                Start Tracking Now
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-900 py-12 border-t border-slate-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                    &copy; {new Date().getFullYear()} AI Placement Readiness Tracker. All rights reserved.
                </div>
            </footer>

        </div>
    );
}
