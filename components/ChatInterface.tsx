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
        <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 sm:p-6 border-b border-gray-200">
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">New Incident Report</h1>
                <p className="mt-1 text-sm text-gray-600 max-w-3xl">Describe the incident below. The AI assistant will ask clarifying questions to build a neutral, factual record for you.</p>
            </div>
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                <div className="space-y-6">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                             {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-gray-500"/></div>}
                            <div className={`max-w-xl px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-900 text-white rounded-br-lg' : 'bg-gray-100 text-gray-900 rounded-bl-lg'}`}>
                                <p className="text-sm leading-6 whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><UserCircleIcon className="w-6 h-6 text-gray-500"/></div>}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                           <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-gray-500"/></div>
                            <div className="max-w-lg px-4 py-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-lg">
                                <div className="flex items-center space-x-1">
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
            <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
                {messages.length > 2 && (
                    <div className="mb-4 flex justify-end">
                        <button
                            onClick={handleGenerateReport}
                            disabled={isGeneratingReport}
                            className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-green-700 rounded-md shadow-sm hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-150 transform hover:-translate-y-0.5"
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
                        placeholder="Describe what happened..."
                        rows={1}
                        className="w-full pl-20 sm:pl-24 pr-12 py-3 text-sm resize-none border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-150"
                    />
                     <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept="image/jpeg,image/png,image/webp" />
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100" aria-label="Attach files">
                             <PaperClipIcon className="w-5 h-5" />
                        </button>
                         <button 
                            onClick={() => setIsCalendarOpen(prev => !prev)} 
                            className="flex items-center gap-1 p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
                            aria-label="Select incident date"
                        >
                            <CalendarDaysIcon className="w-5 h-5" />
                            {selectedDate && <span className="text-xs font-medium pr-1 hidden sm:inline">{selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>}
                        </button>
                    </div>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <button onClick={() => handleSendMessage()} disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)} className="p-2 text-white bg-blue-900 rounded-full hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors" aria-label="Send message">
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
