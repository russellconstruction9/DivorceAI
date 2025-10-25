import React, { useState, useRef, useEffect } from 'react';
import { AppMessage, UserProfile } from '../types';
import { PaperAirplaneIcon } from './icons';

interface MessagingProps {
    messages: AppMessage[];
    onAddMessage: (message: AppMessage) => void;
    userProfile: UserProfile | null;
}

const Messaging: React.FC<MessagingProps> = ({ messages, onAddMessage, userProfile }) => {
    const [input, setInput] = useState('');
    const [sender, setSender] = useState<'user' | 'otherParent'>('user');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const otherParentRole = userProfile?.role === 'Mother' ? 'Father' : 'Mother';

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleAdd = () => {
        if (!input.trim()) return;

        const newMessage: AppMessage = {
            id: `msg_${Date.now()}`,
            sender,
            text: input.trim(),
            timestamp: new Date().toISOString(),
        };
        onAddMessage(newMessage);
        setInput('');
    };

    const formatTimestamp = (isoString: string) => {
        return new Date(isoString).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };
    
    return (
        <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 sm:p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Communication Log</h1>
                <p className="mt-1 text-sm text-gray-600 max-w-3xl">Log text messages and other communications to keep a complete, timestamped record in one place. This is not a live chat service.</p>
            </div>
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center text-gray-500">
                        <div>
                            <p className="font-semibold">No messages logged yet.</p>
                            <p className="text-sm mt-1">Use the input below to start logging your first conversation.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-xl px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-950 text-white rounded-br-lg' : 'bg-gray-100 text-gray-900 rounded-bl-lg'}`}>
                                    <p className="text-sm leading-6 whitespace-pre-wrap">{msg.text}</p>
                                </div>
                                <div className="text-xs text-gray-400 mt-1.5 px-1">
                                    {msg.sender === 'user' ? (userProfile?.name || 'Me') : (otherParentRole)} - {formatTimestamp(msg.timestamp)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                 <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
                <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700 mr-4">Logging message from:</span>
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                        <button
                            type="button"
                            onClick={() => setSender('user')}
                            className={`px-4 py-2 text-sm font-medium border rounded-l-lg transition-colors ${sender === 'user' ? 'bg-blue-950 text-white border-blue-950 z-10 ring-2 ring-blue-400' : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'}`}
                        >
                            Me ({userProfile?.name || 'User'})
                        </button>
                        <button
                            type="button"
                            onClick={() => setSender('otherParent')}
                            className={`px-4 py-2 text-sm font-medium border rounded-r-lg transition-colors ${sender === 'otherParent' ? 'bg-blue-950 text-white border-blue-950 z-10 ring-2 ring-blue-400' : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'}`}
                        >
                            {otherParentRole}
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAdd();
                            }
                        }}
                        placeholder="Type the message content here..."
                        rows={2}
                        className="w-full pl-4 pr-12 py-3 text-sm resize-none border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-150"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <button onClick={handleAdd} disabled={!input.trim()} className="p-2 text-white bg-blue-950 rounded-full hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors" aria-label="Add message to log">
                             <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messaging;