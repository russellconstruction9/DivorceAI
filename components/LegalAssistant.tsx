import React, { useState, useRef, useEffect } from 'react';
import { Report, UserProfile, StoredDocument, DraftedDocument, DocumentType } from '../types';
import { getLegalAssistantResponse, getInitialLegalAnalysis, analyzeDocument, redraftDocument } from '../services/geminiService';
import { PaperAirplaneIcon, SparklesIcon, UserCircleIcon, DocumentTextIcon, LightBulbIcon, XMarkIcon, ArrowDownTrayIcon } from './icons';
import MotionPreviewModal from './MotionPreviewModal';
import ReactMarkdown from 'react-markdown';

interface LegalMessage {
    role: 'user' | 'model';
    content: string;
    document?: {
        title: string;
        text: string;
    };
    sources?: any[];
}

interface AnalyzedDocInfo {
    fileData: string;
    mimeType: string;
    analysisMessageId: number;
}

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
    onSaveDraft: (document: Omit<DraftedDocument, 'id' | 'createdAt'>) => Promise<void>;
}

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
    });

const LegalAssistant: React.FC<LegalAssistantProps> = ({ reports, documents, userProfile, activeReportContext, clearActiveReportContext, initialQuery, clearInitialQuery, activeAnalysisContext, clearActiveAnalysisContext, onSaveDraft }) => {
    const [messages, setMessages] = useState<LegalMessage[]>(() => {
        const initialContent = reports.length > 0
            ? "Hello, you can ask me questions about your logged incidents or uploaded documents. For example: 'When did communication issues occur?' or 'Draft a motion about the missed visitation.'"
            : "Hello, you can ask me general questions about Indiana family law or ask me to draft a legal document. I can also analyze a legal document if you upload one.";
        return [{ role: 'model', content: initialContent }];
    });
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalContent, setModalContent] = useState<{ title: string; text: string } | null>(null);
    const [analyzedDocInfo, setAnalyzedDocInfo] = useState<AnalyzedDocInfo | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const sendInitialQuery = async (query: string) => {
            const userMessage: LegalMessage = { role: 'user', content: query };
            setMessages(prev => [...prev, userMessage]);
            setIsLoading(true);

            try {
                const response = await getLegalAssistantResponse(reports, documents, query, userProfile, activeAnalysisContext);
                const modelMessage: LegalMessage = { role: 'model', content: response.content, sources: response.sources };
                if (response.type === 'document' && response.title && response.documentText) {
                    modelMessage.document = { title: response.title, text: response.documentText };
                }
                setMessages(prev => [...prev, modelMessage]);
            } catch (error) {
                console.error("Failed to run initial query", error);
                setMessages(prev => [...prev, { role: 'model', content: "Sorry, an error occurred." }]);
            } finally {
                setIsLoading(false);
                clearInitialQuery();
            }
        };

        if (activeReportContext) {
            const runAnalysis = async () => {
                setIsLoading(true);
                try {
                    const response = await getInitialLegalAnalysis(activeReportContext, reports, userProfile);
                    const analysisMessage: LegalMessage = {
                        role: 'model',
                        content: response.content,
                        sources: response.sources,
                    };
                    setMessages(prev => [...prev, analysisMessage]);
                } catch (error) {
                    console.error("Failed to run initial analysis", error);
                    setMessages(prev => [...prev, {
                        role: 'model',
                        content: "Sorry, an error occurred during analysis. How can I help with this incident?"
                    }]);
                } finally {
                    setIsLoading(false);
                    clearActiveReportContext();
                }
            };
    
            runAnalysis();
        } else if (initialQuery) {
            sendInitialQuery(initialQuery);
        }

    }, [activeReportContext, reports, documents, userProfile, clearActiveReportContext, initialQuery, clearInitialQuery, activeAnalysisContext]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        setAnalyzedDocInfo(null);
        const userMessage: LegalMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const response = await getLegalAssistantResponse(reports, documents, currentInput, userProfile, activeAnalysisContext);
            
            const modelMessage: LegalMessage = {
                role: 'model',
                content: response.content,
                sources: response.sources
            };

            if (response.type === 'document' && response.title && response.documentText) {
                modelMessage.document = {
                    title: response.title,
                    text: response.documentText
                };
            }
            
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', content: "Sorry, an error occurred." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert("Invalid file type. Please upload a PDF document.");
            return;
        }

        setIsLoading(true);
        setAnalyzedDocInfo(null);

        try {
            const base64Data = await fileToBase64(file);
            const userMessage: LegalMessage = { role: 'user', content: `Please analyze the document: ${file.name}` };
            setMessages(prev => [...prev, userMessage]);

            const analysis = await analyzeDocument(base64Data, file.type, userProfile);
            const modelMessage: LegalMessage = { role: 'model', content: analysis };
            
            setMessages(prev => {
                const newMessages = [...prev, modelMessage];
                const analysisMessageId = newMessages.length - 1;
                setAnalyzedDocInfo({
                    fileData: base64Data,
                    mimeType: file.type,
                    analysisMessageId: analysisMessageId,
                });
                return newMessages;
            });

        } catch (err) {
            console.error("Error during document analysis:", err);
            const errorMessage: LegalMessage = { role: 'model', content: "Sorry, an error occurred while processing your document." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRedraftRequest = async () => {
        if (!analyzedDocInfo || isLoading) return;

        setIsLoading(true);
        const { fileData, mimeType, analysisMessageId } = analyzedDocInfo;
        const analysisText = messages[analysisMessageId].content;
        setAnalyzedDocInfo(null); // Button should disappear once clicked

        try {
            const redraftedText = await redraftDocument(fileData, mimeType, analysisText, userProfile);
            const modelMessage: LegalMessage = {
                role: 'model',
                content: "I have redrafted the document with the suggested improvements. You can preview the new version.",
                document: {
                    title: "DRAFT: Redrafted Document",
                    text: redraftedText,
                }
            };
            setMessages(prev => [...prev, modelMessage]);
        } catch (err) {
            console.error("Error during document redraft:", err);
            const errorMessage: LegalMessage = { role: 'model', content: "Sorry, an error occurred while redrafting your document." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <MotionPreviewModal
                isOpen={!!modalContent}
                onClose={() => setModalContent(null)}
                title={modalContent?.title || ''}
                motionText={modalContent?.text || ''}
            />
            <div className="space-y-6 flex flex-col h-full">
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-100">
                    <div className="flex items-center gap-3">
                        <ScaleIcon className="w-8 h-8 text-teal-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Legal Assistant</h1>
                            <p className="mt-1 text-sm text-gray-600">AI-powered document drafting based on your reports</p>
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full w-fit border border-amber-200">
                        <span className="font-medium">⚖️ Not legal advice - For informational purposes only</span>
                    </div>
                </div>

                 {activeAnalysisContext && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <LightBulbIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-amber-900">Working with Behavioral Analysis Context</h3>
                                <p className="text-sm text-amber-800 mt-1">
                                    The AI is using the generated behavioral analysis to inform its responses. This context will be used for all subsequent messages in this session.
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={clearActiveAnalysisContext} 
                            className="p-1.5 text-amber-500 hover:text-amber-800 rounded-full hover:bg-amber-100 flex-shrink-0"
                            aria-label="Clear behavioral analysis context"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-800">Document Analysis</h2>
                    <p className="text-sm text-gray-600 mt-1">Upload a legal document (PDF) for the AI to review for errors and potential improvements.</p>
                    <div className="mt-3">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="hidden"
                            accept="application/pdf"
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                            className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-900 rounded-md shadow-sm hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                        >
                            <DocumentTextIcon className="w-5 h-5 mr-2" />
                            {isLoading ? 'Processing...' : 'Upload & Analyze PDF'}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col flex-1 min-h-0 bg-white border border-gray-200 rounded-xl shadow-lg">
                    <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white">
                        <div className="space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''} animate-fadeIn`}>
                                    {msg.role === 'model' && (
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                                            <SparklesIcon className="w-5 h-5 text-white"/>
                                        </div>
                                    )}
                                    <div className={`max-w-2xl px-4 py-3 rounded-2xl shadow-sm transition-all hover:shadow-md ${msg.role === 'user' ? 'bg-gradient-to-br from-teal-600 to-cyan-600 text-white' : 'bg-white border border-gray-200 text-gray-900'}`}>
                                        <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-2 prose-li:my-0.5">
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        </div>
                                        {msg.sources && msg.sources.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                <h5 className="text-xs font-semibold text-gray-600 mb-1.5">Sources</h5>
                                                <ul className="space-y-1">
                                                    {msg.sources.map((source, idx) => (
                                                        <li key={idx} className="text-xs truncate">
                                                            <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                                                                {source.web.title || source.web.uri}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {msg.document && (
                                            <div className="mt-3 space-y-2">
                                                <button
                                                    onClick={() => setModalContent({ title: msg.document!.title, text: msg.document!.text })}
                                                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-semibold text-teal-900 bg-teal-100 rounded-lg hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                                                >
                                                    <DocumentTextIcon className="w-5 h-5 flex-shrink-0" />
                                                    <span>Preview Document</span>
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await onSaveDraft({
                                                                title: msg.document!.title,
                                                                content: msg.document!.text,
                                                                type: DocumentType.LEGAL_DRAFT,
                                                                relatedReportId: activeReportContext?.id,
                                                            });
                                                            alert('Document saved to Drafted Documents!');
                                                        } catch (err) {
                                                            alert('Failed to save document');
                                                        }
                                                    }}
                                                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                                                >
                                                    <ArrowDownTrayIcon className="w-5 h-5 flex-shrink-0" />
                                                    <span>Save to Drafted Documents</span>
                                                </button>
                                            </div>
                                        )}
                                        {analyzedDocInfo?.analysisMessageId === index && (
                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                <button
                                                    onClick={handleRedraftRequest}
                                                    disabled={isLoading}
                                                    className="flex items-center justify-center gap-2 w-full text-left px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-sm transition-all"
                                                >
                                                    <SparklesIcon className="w-5 h-5 flex-shrink-0" />
                                                    <span>Redraft with Improvements</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                            <UserCircleIcon className="w-6 h-6 text-gray-600"/>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-3 animate-fadeIn">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <SparklesIcon className="w-5 h-5 text-white animate-pulse"/>
                                    </div>
                                    <div className="max-w-lg px-4 py-3 rounded-2xl bg-white border border-gray-200 shadow-sm">
                                        <div className="flex items-center space-x-1.5">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 bg-white border-t border-gray-100 rounded-b-xl">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask a question or request to draft a document..."
                                className="w-full pl-4 pr-12 py-3 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 shadow-sm"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="p-2.5 text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md" aria-label="Send message">
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LegalAssistant;