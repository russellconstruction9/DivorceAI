import { supabase } from './supabase';
import { Report, UserProfile, StoredDocument, DraftedDocument } from '../types';

export const profileService = {
  async get(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async upsert(profile: UserProfile): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        ...profile
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
    return data || [];
  },

  async create(report: Report): Promise<Report> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        ...report
      })
      .select()
      .single();

    if (error) throw error;
    return data;
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
    return data || [];
  },

  async create(document: StoredDocument): Promise<StoredDocument> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        ...document
      })
      .select()
      .single();

    if (error) throw error;
    return data;
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
    return data || [];
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
    return data;
  },

  async delete(documentId: string): Promise<void> {
    const { error } = await supabase
      .from('drafted_documents')
      .delete()
      .eq('id', documentId);

    if (error) throw error;
  }
};
