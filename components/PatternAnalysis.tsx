import React from 'react';
import { Report } from '../types';

interface PatternAnalysisProps {
    reports: Report[];
}

const PatternAnalysis: React.FC<PatternAnalysisProps> = ({ reports }) => {
    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">Pattern Analysis</h1>
            <p className="text-gray-600">Analyze patterns in your reports - To be implemented</p>
        </div>
    );
};

export default PatternAnalysis;
