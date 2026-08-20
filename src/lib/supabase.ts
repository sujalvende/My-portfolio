import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config'

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

// Prefer VITE_ env vars (set in .env locally or via Vercel dashboard),
// but fall back to the hardcoded public config so the Vercel Free-plan
// build succeeds without requiring environment variable configuration.
const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL ||
  SUPABASE_URL
).trim()

const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  SUPABASE_PUBLISHABLE_KEY
).trim()

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your-anon-key') &&
    !supabaseAnonKey.includes('placeholder'),
)

// Initialize client — always valid because we have hardcoded public fallbacks
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)
