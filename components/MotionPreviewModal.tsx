import React from 'react';
import { XMarkIcon, ClipboardDocumentIcon } from './icons';

interface MotionPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    motionText: string;
    title: string;
}

const MotionPreviewModal: React.FC<MotionPreviewModalProps> = ({ isOpen, onClose, motionText, title }) => {
    if (!isOpen) {
        return null;
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(motionText);
        // Maybe add a toast notification here
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
                        aria-label="Close modal"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                        {motionText}
                    </pre>
                </main>
                <footer className="p-4 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-900 rounded-md shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <ClipboardDocumentIcon className="w-5 h-5 mr-2" />
                        Copy Text
                    </button>
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Close
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default MotionPreviewModal;
