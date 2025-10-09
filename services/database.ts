import { supabase } from './supabase';
import { Report, UserProfile, StoredDocument, DraftedDocument } from '../types';

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
      role: data.role,
      children: Array.isArray(data.children) ? data.children : []
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
        children: profile.children || [],
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  }
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

    return (data || []).map(row => ({
      id: row.id,
      content: row.content,
      category: row.category,
      tags: row.tags,
      legalContext: row.legal_context,
      createdAt: row.created_at
    }));
  },

  async create(report: Report): Promise<Report> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        content: report.content,
        category: report.category,
        tags: report.tags || [],
        legal_context: report.legalContext || '',
        created_at: report.createdAt
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
      createdAt: data.created_at
    };
  }
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

    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      data: row.data,
      mimeType: row.mime_type,
      createdAt: row.created_at
    }));
  },

  async create(document: StoredDocument): Promise<StoredDocument> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        name: document.name,
        data: document.data,
        mime_type: document.mimeType
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      data: data.data,
      mimeType: data.mime_type,
      createdAt: data.created_at
    };
  },

  async delete(documentId: string): Promise<void> {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (error) throw error;
  }
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

    return (data || []).map(row => ({
      id: row.id,
      title: row.title,
      type: row.type,
      content: row.content,
      createdAt: row.created_at
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
        type: document.type,
        content: document.content
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      type: data.type,
      content: data.content,
      createdAt: data.created_at
    };
  },

  async delete(documentId: string): Promise<void> {
    const { error } = await supabase
      .from('drafted_documents')
      .delete()
      .eq('id', documentId);

    if (error) throw error;
  }
};
