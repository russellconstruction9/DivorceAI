import React, { useRef, useState } from 'react';
import { StoredDocument } from '../types';
import { DocumentTextIcon, TrashIcon, PlusIcon } from './icons';

interface DocumentLibraryProps {
    documents: StoredDocument[];
    onAddDocument: (document: StoredDocument) => void;
    onDeleteDocument: (documentId: string) => void;
}

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
    });

const DocumentLibrary: React.FC<DocumentLibraryProps> = ({ documents, onAddDocument, onDeleteDocument }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<StoredDocument | null>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        
        setIsLoading(true);
        try {
            for (const file of Array.from(files)) {
                const base64Data = await fileToBase64(file);
                const newDocument: StoredDocument = {
                    id: `doc_${Date.now()}_${Math.random()}`,
                    name: file.name,
                    mimeType: file.type,
                    data: base64Data,
                    createdAt: new Date().toISOString(),
                };
                onAddDocument(newDocument);
            }
        } catch (error) {
            console.error("Error processing file upload:", error);
            // You might want to show an error to the user here
        } finally {
            setIsLoading(false);
            if(fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Document Library</h1>
                <button
                    onClick={triggerFileUpload}
                    disabled={isLoading}
                    className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-900 rounded-md shadow-sm hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    {isLoading ? 'Uploading...' : 'Upload Document(s)'}
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    multiple 
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
            </div>

            {documents.length === 0 && !isLoading ? (
                <div className="text-center py-24 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                    <DocumentTextIcon className="mx-auto h-16 w-16 text-gray-300" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-900">Your Library is Empty</h3>
                    <p className="mt-2 text-base text-gray-500 max-w-md mx-auto">
                        Upload court orders, communication logs, or other legal documents to give the Legal Assistant more context.
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <ul role="list" className="divide-y divide-gray-200">
                        {documents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((doc) => (
                            <li key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <DocumentTextIcon className="h-8 w-8 text-gray-400 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setSelectedDoc(doc)}
                                        className="px-3 py-1.5 text-sm font-medium text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                        aria-label={`View ${doc.name}`}
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => onDeleteDocument(doc.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                                        aria-label={`Delete ${doc.name}`}
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

        {selectedDoc && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{selectedDoc.name}</h2>
                            <time className="text-sm text-gray-500 font-medium">
                                Uploaded on {new Date(selectedDoc.createdAt).toLocaleString()}
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
                        {selectedDoc.mimeType === 'application/pdf' ? (
                            <iframe
                                src={`data:${selectedDoc.mimeType};base64,${selectedDoc.data}`}
                                className="w-full h-full min-h-[600px] border-0"
                                title={selectedDoc.name}
                            />
                        ) : (
                            <div className="text-center py-12 text-gray-600">
                                <p>Preview not available for this file type.</p>
                                <p className="text-sm mt-2">File type: {selectedDoc.mimeType}</p>
                            </div>
                        )}
                    </div>
                    <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
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
        </>
    );
};

export default DocumentLibrary;
