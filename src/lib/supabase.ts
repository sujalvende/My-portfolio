import { createClient } from '@supabase/supabase-js'

export type InquiryStatus = 'new' | 'contacted' | 'in_progress' | 'closed'

export interface Inquiry {
  id: string
  name: string
  email: string
  phone: string | null
  service: string
  budget: string | null
  message: string
  status: InquiryStatus
  created_at: string
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      inquiries: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          service: string
          budget: string | null
          message: string
          status: InquiryStatus
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          service: string
          budget?: string | null
          message: string
          status?: InquiryStatus
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          service?: string
          budget?: string | null
          message?: string
          status?: InquiryStatus
          created_at?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          user_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      inquiry_status: InquiryStatus
    }
    CompositeTypes: Record<string, never>
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your-anon-key'),
)

// Initialize client with fallback placeholder to prevent runtime crash during initialization
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)
