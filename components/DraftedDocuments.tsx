import React from 'react';
import { DraftedDocument } from '../types';

interface DraftedDocumentsProps {
    documents: DraftedDocument[];
    onDeleteDocument: (id: string) => void;
}

const DraftedDocuments: React.FC<DraftedDocumentsProps> = ({ documents }) => {
    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">Drafted Documents</h1>
            <p className="text-gray-600">{documents.length} documents</p>
        </div>
    );
};

export default DraftedDocuments;
