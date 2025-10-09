import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          role: string | null
          children: any[] | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name?: string | null
          role?: string | null
          children?: any[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          role?: string | null
          children?: any[] | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      reports: {
        Row: {
          id: string
          user_id: string
          content: string
          category: string
          tags: any[] | null
          legal_context: string | null
          images: any[] | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          category: string
          tags?: any[] | null
          legal_context?: string | null
          images?: any[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          category?: string
          tags?: any[] | null
          legal_context?: string | null
          images?: any[] | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          name: string
          mime_type: string
          data: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          mime_type: string
          data: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          mime_type?: string
          data?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      drafted_documents: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          type: string
          related_report_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          type: string
          related_report_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          type?: string
          related_report_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      calendar_events: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          event_date: string
          event_type: string
          related_report_id: string | null
          color: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          event_date: string
          event_type?: string
          related_report_id?: string | null
          color?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          event_date?: string
          event_type?: string
          related_report_id?: string | null
          color?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      behavioral_analyses: {
        Row: {
          id: string
          user_id: string
          report_id: string
          analysis_text: string
          recommended_motion: string | null
          sources: any[] | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          report_id: string
          analysis_text: string
          recommended_motion?: string | null
          sources?: any[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          report_id?: string
          analysis_text?: string
          recommended_motion?: string | null
          sources?: any[] | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      stripe_user_subscriptions: {
        Row: {
          customer_id: string | null
          subscription_id: string | null
          subscription_status: string | null
          price_id: string | null
          current_period_start: number | null
          current_period_end: number | null
          cancel_at_period_end: boolean | null
          payment_method_brand: string | null
          payment_method_last4: string | null
        }
      }
      stripe_user_orders: {
        Row: {
          customer_id: string | null
          order_id: number | null
          checkout_session_id: string | null
          payment_intent_id: string | null
          amount_subtotal: number | null
          amount_total: number | null
          currency: string | null
          payment_status: string | null
          order_status: string | null
          order_date: string | null
        }
      }
    }
    Views: {
      stripe_user_subscriptions: {
        Row: {
          customer_id: string | null
          subscription_id: string | null
          subscription_status: string | null
          price_id: string | null
          current_period_start: number | null
          current_period_end: number | null
          cancel_at_period_end: boolean | null
          payment_method_brand: string | null
          payment_method_last4: string | null
        }
      }
      stripe_user_orders: {
        Row: {
          customer_id: string | null
          order_id: number | null
          checkout_session_id: string | null
          payment_intent_id: string | null
          amount_subtotal: number | null
          amount_total: number | null
          currency: string | null
          payment_status: string | null
          order_status: string | null
          order_date: string | null
        }
      }
    }
  }
}