export enum IncidentCategory {
    COMMUNICATION_ISSUE = 'Communication Issue',
    SCHEDULING_CONFLICT = 'Scheduling Conflict',
    FINANCIAL_DISPUTE = 'Financial Dispute',
    MISSED_VISITATION = 'Missed Visitation',
    PARENTAL_ALIENATION_CONCERN = 'Parental Alienation Concern',
    CHILD_WELLBEING = 'Child Wellbeing',
    LEGAL_DOCUMENTATION = 'Legal Documentation',
    OTHER = 'Other',
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
    images?: { mimeType: string; data: string }[];
}

export interface GeneratedReportData {
    content: string;
    category: IncidentCategory;
    tags: string[];
    legalContext?: string;
}

export interface Report extends GeneratedReportData {
    id: string;
    createdAt: string; // ISO string
    images: string[]; // base64 data URLs
}

export interface Theme {
    name: string;
    value: number; // count
}

export interface UserProfile {
    name: string;
    role: 'Mother' | 'Father' | '';
    children: string[];
}

export interface LegalAssistantResponse {
    type: 'chat' | 'document';
    content: string; // Always contains the chat message
    title?: string; // Document title
    documentText?: string; // Full document text
}

export interface StoredDocument {
    id: string;
    name: string;
    mimeType: string;
    data: string; // base64
    createdAt: string; // ISO string
}
