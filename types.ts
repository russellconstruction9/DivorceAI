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

export enum DocumentType {
    INCIDENT_REPORT = 'Incident Report',
    BEHAVIORAL_ANALYSIS = 'Behavioral Analysis',
    LEGAL_DRAFT = 'Legal Draft',
    UPLOADED_DOCUMENT = 'Uploaded Document',
}

export interface DraftedDocument {
    id: string;
    title: string;
    content: string;
    type: DocumentType;
    relatedReportId?: string;
    createdAt: string;
}

export enum EventType {
    REPORT = 'report',
    CUSTOM = 'custom',
    APPOINTMENT = 'appointment',
    DEADLINE = 'deadline',
    OTHER = 'other',
}

export interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    eventDate: string;
    eventType: EventType;
    relatedReportId?: string;
    color: string;
    createdAt: string;
}
