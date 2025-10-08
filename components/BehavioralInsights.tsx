import React, { useState, useEffect } from 'react';
import { Report, UserProfile, DocumentType, DraftedDocument } from '../types';
import { getSingleIncidentAnalysis } from '../services/geminiService';
import { LightBulbIcon, ArrowLeftIcon, ScaleIcon, ArrowDownTrayIcon } from './icons';
import ReactMarkdown from 'react-markdown';

interface BehavioralInsightsProps {
    reports: Report[];
    userProfile: UserProfile | null;
    activeInsightContext: Report | null;
    onBackToTimeline: () => void;
    onGenerateDraft: (analysisText: string, motionType: string) => void;
    onSaveAnalysis: (document: Omit<DraftedDocument, 'id' | 'createdAt'>) => Promise<void>;
}

const BehavioralInsights: React.FC<BehavioralInsightsProps> = ({ reports, userProfile, activeInsightContext, onBackToTimeline, onGenerateDraft, onSaveAnalysis }) => {
    const [analysisResult, setAnalysisResult] = useState<{ analysis: string; sources: any[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recommendedMotion, setRecommendedMotion] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    
    useEffect(() => {
        if (!activeInsightContext) {
            setAnalysisResult(null);
            setRecommendedMotion(null);
            return;
        }

        const fetchInsights = async () => {
            setIsLoading(true);
            setError(null);
            setRecommendedMotion(null);
            setAnalysisResult(null);
            try {
                const result = await getSingleIncidentAnalysis(activeInsightContext, reports, userProfile);

                if (!result || !result.analysis) {
                    throw new Error('Invalid response from analysis service');
                }

                setAnalysisResult(result);

                // Parse for the recommended motion
                if (result.analysis) {
                    const lines = result.analysis.split('\n');
                    const motionLine = lines.find(line => line.includes('Motion to'));
                    if (motionLine) {
                        const motionMatch = motionLine.match(/^(Motion to [a-zA-Z\s]+)/);
                        if (motionMatch && motionMatch[1]) {
                            setRecommendedMotion(motionMatch[1].trim());
                        }
                    }
                }

            } catch (err: any) {
                const errorMessage = err?.message || 'An error occurred while generating insights.';
                setError(errorMessage);
                console.error('Behavioral Insights Error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInsights();
    }, [activeInsightContext, reports, userProfile]);

    const handleSaveAnalysis = async () => {
        if (!analysisResult || !activeInsightContext) return;

        setIsSaving(true);
        setSaveMessage(null);
        try {
            await onSaveAnalysis({
                title: `Behavioral Analysis - ${new Date(activeInsightContext.createdAt).toLocaleDateString()}`,
                content: analysisResult.analysis,
                type: DocumentType.BEHAVIORAL_ANALYSIS,
                relatedReportId: activeInsightContext.id,
            });
            setSaveMessage('Analysis saved successfully!');
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (err) {
            console.error('Failed to save analysis:', err);
            setSaveMessage('Failed to save analysis');
        } finally {
            setIsSaving(false);
        }
    };
    
    if (!activeInsightContext) {
        return (
            <div className="text-center py-24 bg-white border-2 border-dashed border-gray-300 rounded-lg h-full flex flex-col justify-center">
                <LightBulbIcon className="mx-auto h-16 w-16 text-gray-300" />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">Behavioral Insights</h3>
                <p className="mt-2 text-base text-gray-500 max-w-md mx-auto">
                    Select an incident from the "Incident Timeline" and click "Analyze Behavior" to generate a deep analysis.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-100">
                <button
                    onClick={onBackToTimeline}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-4"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Timeline
                </button>
                <div className="flex items-center gap-3">
                    <LightBulbIcon className="w-8 h-8 text-teal-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Behavioral Analysis
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Incident from {new Date(activeInsightContext.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-lg">
                {isLoading ? (
                    <div className="text-center py-16">
                        <p className="text-gray-600">Generating deep analysis, this may take a moment...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-16 text-red-600 bg-red-50 p-4 rounded-md">
                        <p>{error}</p>
                    </div>
                ) : analysisResult ? (
                    <>
                        <div className="prose prose-slate max-w-none prose-h3:font-semibold prose-h3:text-gray-800 prose-h3:mt-6 prose-h3:mb-2 prose-strong:font-semibold">
                            <ReactMarkdown>{analysisResult.analysis}</ReactMarkdown>
                        </div>
                        
                        {analysisResult.sources && analysisResult.sources.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="text-base font-semibold text-gray-800 mb-3">Research Sources</h4>
                                <ul className="list-disc list-inside space-y-1.5">
                                    {analysisResult.sources.map((source, index) => (
                                        <li key={index} className="text-sm">
                                            <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 hover:underline">
                                                {source.web.title || source.web.uri}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                            <button
                                onClick={handleSaveAnalysis}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all shadow-sm hover:shadow-md"
                            >
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                {isSaving ? 'Saving...' : 'Save to Document Library'}
                            </button>
                            {saveMessage && (
                                <span className={`text-sm font-medium ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                                    {saveMessage}
                                </span>
                            )}
                            {recommendedMotion && (
                                 <button
                                     onClick={() => onGenerateDraft(analysisResult.analysis, recommendedMotion)}
                                     className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-teal-900 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                                 >
                                     <ScaleIcon className="w-5 h-5" />
                                     Generate Draft: {recommendedMotion}
                                 </button>
                            )}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default BehavioralInsights;