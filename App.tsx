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
import CalendarView from './components/CalendarView';
import EvidencePackageBuilder from './components/EvidencePackageBuilder';
import Dashboard from './components/Dashboard';
import { Report, UserProfile as UserProfileType, StoredDocument } from './types';
import { SparklesIcon } from './components/icons';

type View = 'dashboard' | 'timeline' | 'new_report' | 'patterns' | 'insights' | 'assistant' | 'profile' | 'documents' | 'calendar';

const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');
    const [reports, setReports] = useState<Report[]>([]);
    const [documents, setDocuments] = useState<StoredDocument[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
    const [activeReportContext, setActiveReportContext] = useState<Report | null>(null);
    const [activeInsightContext, setActiveInsightContext] = useState<Report | null>(null);
    const [initialLegalQuery, setInitialLegalQuery] = useState<string | null>(null);
    const [activeAnalysisContext, setActiveAnalysisContext] = useState<string | null>(null);
    const [selectedReportIds, setSelectedReportIds] = useState<Set<string>>(new Set());
    const [isEvidenceBuilderOpen, setIsEvidenceBuilderOpen] = useState(false);
    const [newReportDate, setNewReportDate] = useState<Date | null>(null);


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
            setView('dashboard');
        } catch (error) {
            console.error("Failed to save user profile to localStorage", error);
        }
    };

    const handleReportGenerated = (newReport: Report) => {
        setReports(prev => [...prev, newReport]);
        setNewReportDate(null); // Clear date after generation
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
        if (newView !== 'new_report') {
            setNewReportDate(null);
        }
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

    const handleToggleReportSelection = (reportId: string) => {
        setSelectedReportIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(reportId)) {
                newSet.delete(reportId);
            } else {
                newSet.add(reportId);
            }
            return newSet;
        });
    };

    const handleCalendarDayClick = (date: Date) => {
        setNewReportDate(date);
        setView('new_report');
    };

    const handleClearSelection = () => {
        setSelectedReportIds(new Set());
    };

    const renderView = () => {
        const selectionProps = {
            selectedReportIds,
            onToggleReportSelection: handleToggleReportSelection
        };
        switch (view) {
            case 'dashboard':
                return <Dashboard 
                            userProfile={userProfile}
                            reports={reports}
                            onViewChange={handleViewChange}
                        />;
            case 'new_report':
                return <ChatInterface 
                            onReportGenerated={handleReportGenerated} 
                            userProfile={userProfile}
                            initialDate={newReportDate} 
                        />;
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
                            onCancel={() => handleViewChange('dashboard')}
                            currentProfile={userProfile}
                        />;
            case 'calendar':
                return <CalendarView 
                            reports={reports}
                            onDiscussIncident={handleDiscussIncident}
                            onAnalyzeIncident={handleAnalyzeIncident}
                            onDayClick={handleCalendarDayClick}
                            {...selectionProps}
                        />;
            case 'timeline':
            default:
                return <IncidentTimeline 
                            reports={reports} 
                            onDiscussIncident={handleDiscussIncident}
                            onAnalyzeIncident={handleAnalyzeIncident}
                            {...selectionProps}
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
             {selectedReportIds.size > 0 && (view === 'timeline' || view === 'calendar') && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 no-print">
                    <button
                        onClick={handleClearSelection}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Clear Selection ({selectedReportIds.size})
                    </button>
                    <button
                        onClick={() => setIsEvidenceBuilderOpen(true)}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-900 rounded-full shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 transition-transform"
                    >
                        <SparklesIcon className="w-5 h-5" />
                        Build Evidence Package
                    </button>
                </div>
            )}
            <EvidencePackageBuilder
                isOpen={isEvidenceBuilderOpen}
                onClose={() => setIsEvidenceBuilderOpen(false)}
                selectedReports={reports.filter(r => selectedReportIds.has(r.id))}
                allDocuments={documents}
                userProfile={userProfile}
                onPackageCreated={() => {
                    setIsEvidenceBuilderOpen(false);
                    setSelectedReportIds(new Set());
                }}
            />
        </div>
    );
};

export default App;