import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import IncidentTimeline from './components/IncidentTimeline';
import ChatInterface from './components/ChatInterface';
import PatternAnalysis from './components/PatternAnalysis';
import BehavioralInsights from './components/BehavioralInsights';
import LegalAssistant from './components/LegalAssistant';
import UserProfile from './components/UserProfile';
import DocumentLibrary from './components/DocumentLibrary';
import { Report, UserProfile as UserProfileType, StoredDocument } from './types';

type View = 'timeline' | 'new_report' | 'patterns' | 'insights' | 'assistant' | 'profile' | 'documents';

const App: React.FC = () => {
    const [view, setView] = useState<View>('new_report');
    const [reports, setReports] = useState<Report[]>([]);
    const [documents, setDocuments] = useState<StoredDocument[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
    const [activeReportContext, setActiveReportContext] = useState<Report | null>(null);
    const [activeInsightContext, setActiveInsightContext] = useState<Report | null>(null);
    const [initialLegalQuery, setInitialLegalQuery] = useState<string | null>(null);
    const [activeAnalysisContext, setActiveAnalysisContext] = useState<string | null>(null);


    useEffect(() => {
        try {
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
                setUserProfile(JSON.parse(savedProfile));
            }
            const savedDocuments = localStorage.getItem('documents');
            if (savedDocuments) {
                setDocuments(JSON.parse(savedDocuments));
            }
        } catch (error) {
            console.error("Failed to load user profile or documents from localStorage", error);
        }
    }, []);

    const handleProfileSave = (profile: UserProfileType) => {
        try {
            localStorage.setItem('userProfile', JSON.stringify(profile));
            setUserProfile(profile);
            setView('timeline');
        } catch (error) {
            console.error("Failed to save user profile to localStorage", error);
        }
    };

    const handleReportGenerated = (newReport: Report) => {
        setReports(prev => [...prev, newReport]);
        setView('timeline');
    };
    
    const handleAddDocument = (newDocument: StoredDocument) => {
        const updatedDocuments = [...documents, newDocument];
        setDocuments(updatedDocuments);
        try {
            localStorage.setItem('documents', JSON.stringify(updatedDocuments));
        } catch (error) {
            console.error("Failed to save documents to localStorage", error);
        }
    };

    const handleDeleteDocument = (documentId: string) => {
        const updatedDocuments = documents.filter(doc => doc.id !== documentId);
        setDocuments(updatedDocuments);
        try {
            localStorage.setItem('documents', JSON.stringify(updatedDocuments));
        } catch (error) {
            console.error("Failed to save documents to localStorage", error);
        }
    };

    const handleViewChange = useCallback((newView: View) => {
        setView(newView);
        setIsSidebarOpen(false); // Close sidebar on view change on mobile
    }, []);

    const handleDiscussIncident = (reportId: string) => {
        const reportToDiscuss = reports.find(r => r.id === reportId);
        if (reportToDiscuss) {
            setActiveReportContext(reportToDiscuss);
            setActiveAnalysisContext(null); // Clear analysis context
            setView('assistant');
        }
    };

    const handleAnalyzeIncident = (reportId: string) => {
        const reportToAnalyze = reports.find(r => r.id === reportId);
        if (reportToAnalyze) {
            setActiveInsightContext(reportToAnalyze);
            setView('insights');
        }
    };
    
    const handleGenerateDraftFromInsight = (analysisText: string, motionType: string) => {
        const query = `Based on the provided behavioral analysis, please draft a "${motionType}".`;
        setActiveAnalysisContext(analysisText);
        setActiveReportContext(null); // Clear report context
        setInitialLegalQuery(query);
        setView('assistant');
        setActiveInsightContext(null); // clear insight context
    };

    const handleBackToTimeline = () => {
        setView('timeline');
        setActiveInsightContext(null);
    };

    const renderView = () => {
        switch (view) {
            case 'new_report':
                return <ChatInterface onReportGenerated={handleReportGenerated} userProfile={userProfile} />;
            case 'patterns':
                return <PatternAnalysis reports={reports} />;
            case 'insights':
                return <BehavioralInsights 
                            reports={reports} 
                            userProfile={userProfile}
                            activeInsightContext={activeInsightContext}
                            onBackToTimeline={handleBackToTimeline}
                            onGenerateDraft={handleGenerateDraftFromInsight}
                        />;
            case 'documents':
                return <DocumentLibrary 
                            documents={documents}
                            onAddDocument={handleAddDocument}
                            onDeleteDocument={handleDeleteDocument}
                        />;
            case 'assistant':
                return <LegalAssistant 
                            reports={reports} 
                            documents={documents}
                            userProfile={userProfile}
                            activeReportContext={activeReportContext}
                            clearActiveReportContext={() => setActiveReportContext(null)}
                            initialQuery={initialLegalQuery}
                            clearInitialQuery={() => setInitialLegalQuery(null)}
                            activeAnalysisContext={activeAnalysisContext}
                            clearActiveAnalysisContext={() => setActiveAnalysisContext(null)}
                        />;
            case 'profile':
                return <UserProfile 
                            onSave={handleProfileSave} 
                            onCancel={() => handleViewChange('timeline')}
                            currentProfile={userProfile}
                        />;
            case 'timeline':
            default:
                return <IncidentTimeline 
                            reports={reports} 
                            onDiscussIncident={handleDiscussIncident}
                            onAnalyzeIncident={handleAnalyzeIncident} 
                        />;
        }
    };

    const isChatView = view === 'new_report' || view === 'assistant';

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            <Header 
                onMenuClick={() => setIsSidebarOpen(prev => !prev)} 
                onProfileClick={() => handleViewChange('profile')}
            />
            <div className="flex flex-1 pt-16 overflow-hidden">
                 {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
                        onClick={() => setIsSidebarOpen(false)}
                        aria-hidden="true"
                    ></div>
                )}
                <Sidebar 
                    activeView={view} 
                    onViewChange={handleViewChange} 
                    reportCount={reports.length}
                    isOpen={isSidebarOpen}
                />
                <main className={`flex-1 p-4 sm:p-6 lg:p-8 ${isChatView ? 'flex flex-col' : 'overflow-y-auto'}`}>
                    <div className={`mx-auto max-w-7xl w-full ${isChatView ? 'flex-1 min-h-0' : ''}`}>
                        {renderView()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;