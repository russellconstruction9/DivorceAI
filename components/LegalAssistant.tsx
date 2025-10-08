import React from 'react';
import { Report, UserProfile, StoredDocument } from '../types';

interface LegalAssistantProps {
    reports: Report[];
    documents: StoredDocument[];
    userProfile: UserProfile | null;
    activeReportContext: Report | null;
    clearActiveReportContext: () => void;
    initialQuery: string | null;
    clearInitialQuery: () => void;
    activeAnalysisContext: string | null;
    clearActiveAnalysisContext: () => void;
    onSaveDraft: (draft: any) => void;
}

const LegalAssistant: React.FC<LegalAssistantProps> = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">Legal Assistant</h1>
            <p className="text-gray-600">AI-powered legal guidance - To be implemented</p>
        </div>
    );
};

export default LegalAssistant;
