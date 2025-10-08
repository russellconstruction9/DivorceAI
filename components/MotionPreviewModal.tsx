import React from 'react';
import { XMarkIcon, ClipboardDocumentIcon } from './icons';

interface MotionPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    motionText: string;
    title: string;
}

const MotionPreviewModal: React.FC<MotionPreviewModalProps> = ({ isOpen, onClose, motionText, title }) => {
    console.log('MotionPreviewModal render:', { isOpen, title, hasText: !!motionText });

    if (!isOpen) {
        return null;
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(motionText);
        // Maybe add a toast notification here
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-5 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-gray-700 transition-colors"
                        aria-label="Close modal"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>
                <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                            {motionText}
                        </pre>
                    </div>
                </main>
                <footer className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-white">
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg shadow-sm hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all"
                    >
                        <ClipboardDocumentIcon className="w-5 h-5" />
                        Copy Text
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                        Close
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default MotionPreviewModal;
