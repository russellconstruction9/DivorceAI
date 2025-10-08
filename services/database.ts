import { supabase } from './supabase';
import { Report, StoredDocument, UserProfile, DraftedDocument } from '../types';

export interface DbProfile {
  id: string;
  name: string;
  role: string;
  children: string[];
  created_at: string;
  updated_at: string;
}

export interface DbReport {
  id: string;
  user_id: string;
  content: string;
  category: string;
  tags: string[];
  legal_context: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface DbDocument {
  id: string;
  user_id: string;
  name: string;
  mime_type: string;
  data: string;
  created_at: string;
  updated_at: string;
}

export interface DbDraftedDocument {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: string;
  related_report_id: string | null;
  created_at: string;
  updated_at: string;
}

export const profileService = {
  async get(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      name: data.name,
      role: data.role as 'Mother' | 'Father' | '',
      children: data.children,
    };
  },

  async upsert(profile: UserProfile): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        name: profile.name,
        role: profile.role,
        children: profile.children,
      });

    if (error) throw error;
  },
};

export const reportService = {
  async getAll(): Promise<Report[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((r: DbReport) => ({
      id: r.id,
      content: r.content,
      category: r.category,
      tags: r.tags,
      legalContext: r.legal_context,
      images: r.images,
      createdAt: r.created_at,
    }));
  },

  async create(report: Omit<Report, 'id'>): Promise<Report> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        content: report.content,
        category: report.category,
        tags: report.tags,
        legal_context: report.legalContext || '',
        images: report.images,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      content: data.content,
      category: data.category,
      tags: data.tags,
      legalContext: data.legal_context,
      images: data.images,
      createdAt: data.created_at,
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

export const documentService = {
  async getAll(): Promise<StoredDocument[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((d: DbDocument) => ({
      id: d.id,
      name: d.name,
      mimeType: d.mime_type,
      data: d.data,
      createdAt: d.created_at,
    }));
  },

  async create(document: Omit<StoredDocument, 'id' | 'createdAt'>): Promise<StoredDocument> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        name: document.name,
        mime_type: document.mimeType,
        data: document.data,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      mimeType: data.mime_type,
      data: data.data,
      createdAt: data.created_at,
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

export const draftedDocumentService = {
  async getAll(): Promise<DraftedDocument[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('drafted_documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((d: DbDraftedDocument) => ({
      id: d.id,
      title: d.title,
      content: d.content,
      type: d.type,
      relatedReportId: d.related_report_id || undefined,
      createdAt: d.created_at,
    }));
  },

  async create(document: Omit<DraftedDocument, 'id' | 'createdAt'>): Promise<DraftedDocument> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('drafted_documents')
      .insert({
        user_id: user.id,
        title: document.title,
        content: document.content,
        type: document.type,
        related_report_id: document.relatedReportId || null,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      type: data.type,
      relatedReportId: data.related_report_id || undefined,
      createdAt: data.created_at,
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('drafted_documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
