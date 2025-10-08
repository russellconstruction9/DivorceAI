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
import DraftedDocuments from './components/DraftedDocuments';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import { Report, UserProfile as UserProfileType, StoredDocument, DraftedDocument } from './types';
import { supabase } from './services/supabase';
import { profileService, reportService, documentService, draftedDocumentService } from './services/database';

type View = 'timeline' | 'new_report' | 'patterns' | 'insights' | 'assistant' | 'profile' | 'documents' | 'drafted_documents';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [showLanding, setShowLanding] = useState(true);
    const [view, setView] = useState<View>('new_report');
    const [reports, setReports] = useState<Report[]>([]);
    const [documents, setDocuments] = useState<StoredDocument[]>([]);
    const [draftedDocuments, setDraftedDocuments] = useState<DraftedDocument[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
    const [activeReportContext, setActiveReportContext] = useState<Report | null>(null);
    const [activeInsightContext, setActiveInsightContext] = useState<Report | null>(null);
    const [initialLegalQuery, setInitialLegalQuery] = useState<string | null>(null);
    const [activeAnalysisContext, setActiveAnalysisContext] = useState<string | null>(null);

    const loadUserData = useCallback(async () => {
        try {
            const [profile, allReports, allDocuments, allDrafted] = await Promise.all([
                profileService.get(),
                reportService.getAll(),
                documentService.getAll(),
                draftedDocumentService.getAll(),
            ]);

            setUserProfile(profile);
            setReports(allReports);
            setDocuments(allDocuments);
            setDraftedDocuments(allDrafted);
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);

            if (session) {
                await loadUserData();
            }

            setIsInitializing(false);
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            (async () => {
                setIsAuthenticated(!!session);

                if (session) {
                    await loadUserData();
                } else {
                    setReports([]);
                    setDocuments([]);
                    setDraftedDocuments([]);
                    setUserProfile(null);
                }
            })();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [loadUserData]);

    const handleAuthSuccess = async () => {
        setIsAuthenticated(true);
        await loadUserData();
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setReports([]);
        setDocuments([]);
        setDraftedDocuments([]);
        setUserProfile(null);
        setView('new_report');
    };

    const handleProfileSave = async (profile: UserProfileType) => {
        try {
            await profileService.upsert(profile);
            setUserProfile(profile);
            setView('timeline');
        } catch (error) {
            console.error('Failed to save user profile:', error);
        }
    };

    const handleReportGenerated = async (newReport: Report) => {
        try {
            const createdReport = await reportService.create(newReport);
            setReports(prev => [createdReport, ...prev]);
            setView('timeline');
        } catch (error) {
            console.error('Failed to save report:', error);
        }
    };

    const handleAddDocument = async (newDocument: StoredDocument) => {
        try {
            const createdDocument = await documentService.create(newDocument);
            setDocuments(prev => [createdDocument, ...prev]);
        } catch (error) {
            console.error('Failed to save document:', error);
        }
    };

    const handleDeleteDocument = async (documentId: string) => {
        try {
            await documentService.delete(documentId);
            setDocuments(prev => prev.filter(doc => doc.id !== documentId));
        } catch (error) {
            console.error('Failed to delete document:', error);
        }
    };

    const handleSaveDraftedDocument = async (document: Omit<DraftedDocument, 'id' | 'createdAt'>) => {
        try {
            const created = await draftedDocumentService.create(document);
            setDraftedDocuments(prev => [created, ...prev]);
        } catch (error) {
            console.error('Failed to save drafted document:', error);
            throw error;
        }
    };

    const handleDeleteDraftedDocument = async (documentId: string) => {
        try {
            await draftedDocumentService.delete(documentId);
            setDraftedDocuments(prev => prev.filter(doc => doc.id !== documentId));
        } catch (error) {
            console.error('Failed to delete drafted document:', error);
        }
    };

    const handleViewChange = useCallback((newView: View) => {
        setView(newView);
        setIsSidebarOpen(false);
    }, []);

    const handleDiscussIncident = (reportId: string) => {
        const reportToDiscuss = reports.find(r => r.id === reportId);
        if (reportToDiscuss) {
            setActiveReportContext(reportToDiscuss);
            setActiveAnalysisContext(null);
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
        setActiveReportContext(null);
        setInitialLegalQuery(query);
        setView('assistant');
        setActiveInsightContext(null);
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
                            onSaveAnalysis={handleSaveDraftedDocument}
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
                            onSaveDraft={handleSaveDraftedDocument}
                        />;
            case 'drafted_documents':
                return <DraftedDocuments
                            documents={draftedDocuments}
                            onDeleteDocument={handleDeleteDraftedDocument}
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

    if (isInitializing) {
        return (
            <div className="h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        if (showLanding) {
            return <LandingPage onGetStarted={() => setShowLanding(false)} />;
        }
        return <Auth onAuthSuccess={handleAuthSuccess} />;
    }

    const isChatView = view === 'new_report' || view === 'assistant';

    return (
        <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
            <Header
                onMenuClick={() => setIsSidebarOpen(prev => !prev)}
                onProfileClick={() => handleViewChange('profile')}
                onSignOut={handleSignOut}
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
                <main className={`flex-1 p-6 sm:p-8 lg:p-10 ${isChatView ? 'flex flex-col' : 'overflow-y-auto'}`}>
                    <div className={`mx-auto max-w-7xl w-full ${isChatView ? 'flex-1 min-h-0' : ''}`}>
                        {renderView()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
