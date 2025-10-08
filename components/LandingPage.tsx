import React from 'react';
import { SparklesIcon, BookOpenIcon, ScaleIcon, ChartBarIcon, DocumentTextIcon, LightBulbIcon } from './icons';

interface LandingPageProps {
    onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <svg className="h-9 w-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="40" height="40" rx="8" fill="#1e3a8a"/>
                                <path d="M20 8L28 14V26L20 32L12 26V14L20 8Z" fill="#3b82f6" stroke="#60a5fa" strokeWidth="1.5"/>
                                <circle cx="20" cy="20" r="4" fill="#dbeafe"/>
                            </svg>
                            <span className="text-2xl font-bold text-gray-900">CustodyX<span className="text-blue-900">.AI</span></span>
                        </div>
                        <button
                            onClick={onGetStarted}
                            className="px-6 py-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors shadow-sm"
                        >
                            Join Early Access
                        </button>
                    </div>
                </div>
            </header>

            <main>
                <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <p className="text-blue-900 font-semibold text-sm tracking-wide uppercase mb-4">
                                CustodyX.AI — TRUTH. EVIDENCE. JUSTICE.
                            </p>
                            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                                The Parent's Advantage in Family Court
                            </h1>
                            <p className="text-xl text-gray-700 leading-relaxed mb-8">
                                CustodyX.AI is an intelligent documentation and evidence system built to help parents protect their rights, their time, and their children. When the system feels stacked against you, CustodyX.AI helps you prove the truth — clearly, calmly, and credibly.
                            </p>
                            <button
                                onClick={onGetStarted}
                                className="inline-flex items-center px-8 py-4 bg-blue-900 text-white font-bold text-lg rounded-lg hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Join Early Access
                                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <div className="relative">
                            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="ml-auto text-sm font-semibold text-gray-600">Evidence Dashboard</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-bold text-gray-900 mb-2">Incident Log</h3>
                                        <p className="text-sm text-gray-600">November 2025</p>
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Communication Violation</h4>
                                                <p className="text-sm text-gray-500">November 15, 2025 - 8:10 PM</p>
                                            </div>
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">Pattern Detected</span>
                                        </div>
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900">Missed Drop-off</h4>
                                        <p className="text-sm text-gray-500">November 12, 2025 - 6:05 PM</p>
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900">Parental Alienation Concern</h4>
                                        <p className="text-sm text-gray-500">November 8, 2025 - 11:45 AM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">What It Does</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                                    <SparklesIcon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Guided Documentation</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Our conversational AI assistant helps you document incidents in real-time with guided questions that ensure you capture all critical details.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                                    <BookOpenIcon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Incident Timeline</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Build a comprehensive, chronological record of all co-parenting incidents with timestamps, categories, and evidence attachments.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                                    <ChartBarIcon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Pattern Analysis</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Advanced AI identifies recurring patterns and themes across your documented incidents to strengthen your case.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                                    <LightBulbIcon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Behavioral Insights</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Get forensic-level behavioral analysis with web-grounded research to understand the legal implications of documented behaviors.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                                    <ScaleIcon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Legal Document Drafting</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    AI-powered legal assistant drafts motions, declarations, and other court documents based on your incident reports.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                                    <DocumentTextIcon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Document Management</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Upload and organize court orders, communications, and evidence. Review, edit, print, and manage all your legal documents in one place.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-blue-900 py-20">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Ready to Protect Your Rights?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Join parents who are building credible, court-ready documentation with AI assistance.
                        </p>
                        <button
                            onClick={onGetStarted}
                            className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-bold text-lg rounded-lg hover:bg-gray-100 transition-all shadow-lg"
                        >
                            Get Started Now
                            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </section>
            </main>

            <footer className="bg-white border-t border-gray-200 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <svg className="h-8 w-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="40" height="40" rx="8" fill="#1e3a8a"/>
                                <path d="M20 8L28 14V26L20 32L12 26V14L20 8Z" fill="#3b82f6" stroke="#60a5fa" strokeWidth="1.5"/>
                                <circle cx="20" cy="20" r="4" fill="#dbeafe"/>
                            </svg>
                            <span className="text-xl font-bold text-gray-900">CustodyX<span className="text-blue-900">.AI</span></span>
                        </div>
                        <p className="text-sm text-gray-600">
                            Built to help parents protect their rights and their children.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
