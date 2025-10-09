import React, { useState } from 'react';
import { DraftedDocument } from '../types';
import { DocumentTextIcon, TrashIcon } from './icons';

interface DraftedDocumentsProps {
  documents: DraftedDocument[];
  onDeleteDocument: (documentId: string) => void;
}

const DraftedDocuments: React.FC<DraftedDocumentsProps> = ({ documents, onDeleteDocument }) => {
  const [selectedDocument, setSelectedDocument] = useState<DraftedDocument | null>(null);

  const handleDelete = (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this drafted document?')) {
      onDeleteDocument(documentId);
      if (selectedDocument?.id === documentId) {
        setSelectedDocument(null);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Drafted Documents</h1>
        <p className="text-gray-600 mt-2">Review and manage your AI-drafted legal documents</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        <div className="lg:col-span-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-900">Documents ({documents.length})</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {documents.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <DocumentTextIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No drafted documents yet</p>
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedDocument?.id === doc.id ? 'bg-blue-50 border-l-4 border-blue-900' : ''
                  }`}
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{doc.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{doc.type}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete document"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 overflow-y-auto bg-white rounded-xl shadow-sm border border-gray-200">
          {selectedDocument ? (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedDocument.title}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full font-medium">
                    {selectedDocument.type}
                  </span>
                  <span>Created {new Date(selectedDocument.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {selectedDocument.content}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => {
                    const blob = new Blob([selectedDocument.content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedDocument.title}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedDocument.content);
                    alert('Copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Print
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 p-8">
              <div className="text-center">
                <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>Select a document to view its contents</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraftedDocuments;
