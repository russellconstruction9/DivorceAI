import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, Report, GeneratedReportData, UserProfile } from '../types';
import { getChatResponse, generateJsonReport } from '../services/geminiService';
import { PaperAirplaneIcon, PaperClipIcon, SparklesIcon, UserCircleIcon, CalendarDaysIcon } from './icons';
import Calendar from './Calendar';

interface ChatInterfaceProps {
    onReportGenerated: (report: Report) => void;
    userProfile: UserProfile | null;
}

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
    });


const ChatInterface: React.FC<ChatInterfaceProps> = ({ onReportGenerated, userProfile }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', content: "Hello, I'm here to help you document a co-parenting incident. To start, please describe what happened." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<{ name: string; type: string; data: string }[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);


    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = useCallback(async (event?: React.FormEvent) => {
        event?.preventDefault();
        if (!input.trim() && uploadedFiles.length === 0) return;

        const isFirstUserMessage = messages.filter(m => m.role === 'user').length === 0;
        let contentToSend = input;
        if (isFirstUserMessage && selectedDate) {
            contentToSend = `(Incident Date: ${selectedDate.toLocaleDateString()})\n\n${input}`;
        }

        setIsLoading(true);
        const userMessage: ChatMessage = {
            role: 'user',
            content: contentToSend,
            images: uploadedFiles.map(f => ({ mimeType: f.type, data: f.data }))
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setUploadedFiles([]);

        try {
            const response = await getChatResponse(newMessages, userProfile);
            setMessages(prev => [...prev, { role: 'model', content: response }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', content: "Sorry, an error occurred." }]);
        } finally {
            setIsLoading(false);
        }
    }, [input, messages, uploadedFiles, selectedDate, userProfile]);
    
    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setIsCalendarOpen(false);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            const processedFiles = await Promise.all(
                files.map(async (file: File) => ({
                    name: file.name,
                    type: file.type,
                    data: await fileToBase64(file),
                }))
            );
            setUploadedFiles(prev => [...prev, ...processedFiles]);
        }
    };

    const handleGenerateReport = async () => {
        setIsGeneratingReport(true);
        try {
            const reportData: GeneratedReportData | null = await generateJsonReport(messages, userProfile);
            if (reportData) {
                const allImagesFromChat = messages
                    .flatMap(m => m.images || [])
                    .map(img => `data:${img.mimeType};base64,${img.data}`);

                const newReport: Report = {
                    ...reportData,
                    id: `rep_${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    images: allImagesFromChat,
                    legalContext: reportData.legalContext || '',
                };
                onReportGenerated(newReport);
            } else {
                 setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, I was unable to generate a report from our conversation. Please try adding more details and generating it again." }]);
            }
        } catch (error) {
            console.error(error);
             setMessages(prev => [...prev, { role: 'model', content: "An unexpected error occurred while generating the report." }]);
        } finally {
            setIsGeneratingReport(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-cyan-50">
                <h1 className="text-2xl font-bold text-gray-900">New Incident Report</h1>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">Document what happened with help from your AI assistant. Be factual and neutral.</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-teal-700 bg-white/60 px-3 py-1.5 rounded-full w-fit">
                    <SparklesIcon className="w-4 h-4" />
                    <span className="font-medium">AI is analyzing for neutrality and completeness</span>
                </div>
            </div>
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
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
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
                                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t border-gray-100 rounded-b-xl">
                {messages.length > 2 && (
                    <div className="mb-4 flex justify-end">
                        <button
                            onClick={handleGenerateReport}
                            disabled={isGeneratingReport}
                            className="flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg shadow-md hover:shadow-lg hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                        >
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            {isGeneratingReport ? 'Generating...' : 'Generate Incident Report'}
                        </button>
                    </div>
                )}
                <div className="relative">
                     {isCalendarOpen && (
                        <div className="absolute bottom-full mb-2 left-0 z-10">
                            <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
                        </div>
                    )}
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        placeholder="Describe what happened... (be factual and neutral)"
                        rows={1}
                        className="w-full pl-20 sm:pl-24 pr-12 py-3 text-sm resize-none border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 shadow-sm"
                    />
                     <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept="image/jpeg,image/png,image/webp" />
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-teal-600 rounded-lg hover:bg-teal-50 transition-colors" aria-label="Attach files">
                             <PaperClipIcon className="w-5 h-5" />
                        </button>
                         <button
                            onClick={() => setIsCalendarOpen(prev => !prev)}
                            className="flex items-center gap-1 p-2 text-gray-500 hover:text-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
                            aria-label="Select incident date"
                        >
                            <CalendarDaysIcon className="w-5 h-5" />
                            {selectedDate && <span className="text-xs font-medium pr-1 hidden sm:inline">{selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>}
                        </button>
                    </div>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <button onClick={() => handleSendMessage()} disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)} className="p-2.5 text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md" aria-label="Send message">
                             <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                {uploadedFiles.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500 pl-4">
                        Attached: {uploadedFiles.map(f => f.name).join(', ')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatInterface;
