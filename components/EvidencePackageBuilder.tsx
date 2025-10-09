import React, { useState, useEffect } from 'react';
import { Report, StoredDocument, UserProfile } from '../types';
import { generateEvidencePackage } from '../services/geminiService';
import { XMarkIcon, SparklesIcon, ClipboardDocumentIcon, CheckIcon, DocumentTextIcon, PrinterIcon } from './icons';
import ReactMarkdown from 'react-markdown';

interface EvidencePackageBuilderProps {
    isOpen: boolean;
    onClose: () => void;
    selectedReports: Report[];
    allDocuments: StoredDocument[];
    userProfile: UserProfile | null;
    onPackageCreated: () => void;
}

const EvidencePackageBuilder: React.FC<EvidencePackageBuilderProps> = ({ isOpen, onClose, selectedReports, allDocuments, userProfile, onPackageCreated }) => {
    const [selectedDocumentIds, setSelectedDocumentIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [generatedPackage, setGeneratedPackage] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Reset state when modal opens
            setSelectedDocumentIds(new Set());
            setGeneratedPackage(null);
            setIsLoading(false);
            setIsCopied(false);
        }
    }, [isOpen]);
    
    if (!isOpen) return null;

    const handleToggleDocumentSelection = (docId: string) => {
        setSelectedDocumentIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(docId)) {
                newSet.delete(docId);
            } else {
                newSet.add(docId);
            }
            return newSet;
        });
    };

    const handleGeneratePackage = async () => {
        setIsLoading(true);
        const selectedDocuments = allDocuments.filter(doc => selectedDocumentIds.has(doc.id));
        try {
            const result = await generateEvidencePackage(selectedReports, selectedDocuments, userProfile);
            setGeneratedPackage(result);
        } catch (error) {
            console.error("Failed to generate package:", error);
            setGeneratedPackage("An error occurred while generating the package. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (generatedPackage) {
            navigator.clipboard.writeText(generatedPackage);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const handlePrint = () => {
        window.print();
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center no-print" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Evidence Package Builder</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100" aria-label="Close modal">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <main className="flex-1 p-6 overflow-y-auto">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <SparklesIcon className="w-16 h-16 text-blue-500 animate-pulse" />
                            <p className="mt-4 text-lg font-semibold text-gray-800">Generating Your Evidence Package...</p>
                            <p className="mt-1 text-gray-600">The AI is analyzing your selections and compiling the document. This may take a moment.</p>
                        </div>
                    )}

                    {generatedPackage && !isLoading && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Generated Package Preview</h3>
                            <div className="prose prose-sm max-w-none p-4 bg-gray-50 border border-gray-200 rounded-md h-[calc(90vh-250px)] overflow-y-auto printable-area">
                                <ReactMarkdown>{generatedPackage}</ReactMarkdown>
                            </div>
                        </div>
                    )}

                    {!generatedPackage && !isLoading && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                            <div className="flex flex-col">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Selected Incidents ({selectedReports.length})</h3>
                                <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-md overflow-y-auto">
                                    <ul className="divide-y divide-gray-200">
                                        {selectedReports.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map(report => (
                                            <li key={report.id} className="py-2.5">
                                                <p className="text-sm font-medium text-gray-900">{report.category}</p>
                                                <p className="text-xs text-gray-600">{new Date(report.createdAt).toLocaleString()}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Include Documents ({selectedDocumentIds.size})</h3>
                                <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-md overflow-y-auto">
                                    {allDocuments.length > 0 ? (
                                        <ul className="space-y-2">
                                            {allDocuments.map(doc => (
                                                <li key={doc.id}>
                                                    <label className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                                        <input type="checkbox"
                                                            checked={selectedDocumentIds.has(doc.id)}
                                                            onChange={() => handleToggleDocumentSelection(doc.id)}
                                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <DocumentTextIcon className="w-5 h-5 text-gray-500" />
                                                        <span className="text-sm font-medium text-gray-800 truncate">{doc.name}</span>
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center py-8">No documents in your library.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <footer className="p-4 border-t border-gray-200 flex justify-end gap-3">
                     {generatedPackage ? (
                        <>
                            <button onClick={handlePrint} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                <PrinterIcon className="w-5 h-5 mr-2" />
                                Print / Save as PDF
                            </button>
                            <button onClick={copyToClipboard} className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-900 rounded-md shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                               {isCopied ? <CheckIcon className="w-5 h-5 mr-2" /> : <ClipboardDocumentIcon className="w-5 h-5 mr-2" />}
                                {isCopied ? 'Copied!' : 'Copy Text'}
                            </button>
                             <button onClick={onPackageCreated} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                Finish & Clear Selection
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onClick={handleGeneratePackage} disabled={isLoading || selectedReports.length === 0} className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-green-700 rounded-md shadow-sm hover:bg-green-600 disabled:bg-green-300">
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                Generate Package
                            </button>
                        </>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default EvidencePackageBuilder;