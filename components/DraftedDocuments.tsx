import React, { useState } from 'react';
import { DraftedDocument, DocumentType } from '../types';
import { DocumentTextIcon, TrashIcon, ArrowDownTrayIcon } from './icons';

interface DraftedDocumentsProps {
    documents: DraftedDocument[];
    onDeleteDocument: (documentId: string) => void;
}

const DraftedDocuments: React.FC<DraftedDocumentsProps> = ({ documents, onDeleteDocument }) => {
    const [selectedDoc, setSelectedDoc] = useState<DraftedDocument | null>(null);

    const downloadAsText = (doc: DraftedDocument) => {
        const blob = new Blob([doc.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getDocumentTypeColor = (type: DocumentType) => {
        switch (type) {
            case DocumentType.INCIDENT_REPORT:
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case DocumentType.BEHAVIORAL_ANALYSIS:
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case DocumentType.LEGAL_DRAFT:
                return 'bg-green-50 text-green-700 border-green-200';
            case DocumentType.UPLOADED_DOCUMENT:
                return 'bg-gray-50 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">Drafted Documents</h1>
                <p className="text-gray-600">View, download, and manage all your generated documents</p>
            </div>

            {documents.length === 0 ? (
                <div className="text-center py-32 bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-gray-200 rounded-2xl">
                    <div className="p-4 bg-white rounded-full inline-block shadow-sm mb-4">
                        <DocumentTextIcon className="h-16 w-16 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">No Documents Yet</h3>
                    <p className="mt-3 text-base text-gray-600 max-w-md mx-auto leading-relaxed">
                        Generate incident reports, behavioral analyses, or legal drafts to see them here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-blue-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg border inline-block ${getDocumentTypeColor(doc.type as DocumentType)}`}>
                                        {doc.type}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2">{doc.title}</h3>
                                    <time className="text-sm text-gray-500 font-medium">
                                        {new Date(doc.createdAt).toLocaleString()}
                                    </time>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                                    {doc.content.substring(0, 200)}...
                                </p>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => setSelectedDoc(doc)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <DocumentTextIcon className="w-4 h-4" />
                                    View
                                </button>
                                <button
                                    onClick={() => downloadAsText(doc)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                                >
                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                    Download
                                </button>
                                <button
                                    onClick={() => onDeleteDocument(doc.id)}
                                    className="p-2.5 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-200 transition-all duration-200"
                                    aria-label={`Delete ${doc.title}`}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedDoc && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg border inline-block ${getDocumentTypeColor(selectedDoc.type as DocumentType)}`}>
                                    {selectedDoc.type}
                                </span>
                                <h2 className="text-2xl font-bold text-gray-900 mt-2">{selectedDoc.title}</h2>
                                <time className="text-sm text-gray-500 font-medium">
                                    {new Date(selectedDoc.createdAt).toLocaleString()}
                                </time>
                            </div>
                            <button
                                onClick={() => setSelectedDoc(null)}
                                className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none"
                            >
                                ×
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="prose prose-base max-w-none">
                                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                                    {selectedDoc.content}
                                </pre>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
                            <button
                                onClick={() => downloadAsText(selectedDoc)}
                                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                            >
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                Download
                            </button>
                            <button
                                onClick={() => setSelectedDoc(null)}
                                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DraftedDocuments;
