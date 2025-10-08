import React from 'react';
import { StoredDocument } from '../types';

interface DocumentLibraryProps {
    documents: StoredDocument[];
    onAddDocument: (doc: Omit<StoredDocument, 'id' | 'createdAt'>) => void;
    onDeleteDocument: (id: string) => void;
}

const DocumentLibrary: React.FC<DocumentLibraryProps> = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">Document Library</h1>
            <p className="text-gray-600">Manage your documents - To be implemented</p>
        </div>
    );
};

export default DocumentLibrary;
