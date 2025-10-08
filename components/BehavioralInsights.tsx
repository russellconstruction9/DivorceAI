import React from 'react';
import { Report, UserProfile } from '../types';

interface BehavioralInsightsProps {
    reports: Report[];
    userProfile: UserProfile | null;
    activeInsightContext: Report | null;
    onBackToTimeline: () => void;
    onGenerateDraft: (analysis: string) => void;
    onSaveAnalysis: (analysis: any) => void;
}

const BehavioralInsights: React.FC<BehavioralInsightsProps> = ({ reports }) => {
    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">Behavioral Insights</h1>
            <p className="text-gray-600">AI-powered behavioral analysis - To be implemented</p>
        </div>
    );
};

export default BehavioralInsights;
