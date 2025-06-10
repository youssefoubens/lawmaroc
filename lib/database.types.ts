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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          role: 'citizen' | 'advocate' | 'admin'
          preferred_language: 'ar' | 'fr' | 'en'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          role?: 'citizen' | 'advocate' | 'admin'
          preferred_language?: 'ar' | 'fr' | 'en'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          role?: 'citizen' | 'advocate' | 'admin'
          preferred_language?: 'ar' | 'fr' | 'en'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      advocates: {
        Row: {
          id: string
          user_id: string
          bar_association_id: string
          license_number: string
          specializations: string[]
          years_experience: number
          office_address: string | null
          city: string | null
          status: 'pending' | 'verified' | 'suspended' | 'rejected'
          verification_documents: string[]
          verified_at: string | null
          verified_by: string | null
          bio_ar: string | null
          bio_fr: string | null
          hourly_rate: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bar_association_id: string
          license_number: string
          specializations?: string[]
          years_experience?: number
          office_address?: string | null
          city?: string | null
          status?: 'pending' | 'verified' | 'suspended' | 'rejected'
          verification_documents?: string[]
          verified_at?: string | null
          verified_by?: string | null
          bio_ar?: string | null
          bio_fr?: string | null
          hourly_rate?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bar_association_id?: string
          license_number?: string
          specializations?: string[]
          years_experience?: number
          office_address?: string | null
          city?: string | null
          status?: 'pending' | 'verified' | 'suspended' | 'rejected'
          verification_documents?: string[]
          verified_at?: string | null
          verified_by?: string | null
          bio_ar?: string | null
          bio_fr?: string | null
          hourly_rate?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          name_ar: string
          name_fr: string
          description: string | null
          description_ar: string | null
          description_fr: string | null
          price_mad: number
          billing_interval: 'month' | 'year'
          features: Json
          max_consultations: number | null
          max_documents: number | null
          priority_support: boolean
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ar: string
          name_fr: string
          description?: string | null
          description_ar?: string | null
          description_fr?: string | null
          price_mad: number
          billing_interval: 'month' | 'year'
          features?: Json
          max_consultations?: number | null
          max_documents?: number | null
          priority_support?: boolean
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ar?: string
          name_fr?: string
          description?: string | null
          description_ar?: string | null
          description_fr?: string | null
          price_mad?: number
          billing_interval?: 'month' | 'year'
          features?: Json
          max_consultations?: number | null
          max_documents?: number | null
          priority_support?: boolean
          is_active?: boolean
          created_at?: string
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: 'active' | 'cancelled' | 'expired' | 'trial'
          current_period_start: string
          current_period_end: string | null
          trial_end: string | null
          stripe_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status?: 'active' | 'cancelled' | 'expired' | 'trial'
          current_period_start?: string
          current_period_end?: string | null
          trial_end?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          status?: 'active' | 'cancelled' | 'expired' | 'trial'
          current_period_start?: string
          current_period_end?: string | null
          trial_end?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      legal_cases: {
        Row: {
          id: string
          client_id: string
          advocate_id: string | null
          title: string
          title_ar: string | null
          title_fr: string | null
          description: string
          category: string
          status: 'open' | 'in_progress' | 'closed' | 'archived'
          priority: number
          estimated_hours: number | null
          total_cost: number | null
          documents: string[]
          notes: string | null
          created_at: string
          updated_at: string
          closed_at: string | null
        }
        Insert: {
          id?: string
          client_id: string
          advocate_id?: string | null
          title: string
          title_ar?: string | null
          title_fr?: string | null
          description: string
          category: string
          status?: 'open' | 'in_progress' | 'closed' | 'archived'
          priority?: number
          estimated_hours?: number | null
          total_cost?: number | null
          documents?: string[]
          notes?: string | null
          created_at?: string
          updated_at?: string
          closed_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          advocate_id?: string | null
          title?: string
          title_ar?: string | null
          title_fr?: string | null
          description?: string
          category?: string
          status?: 'open' | 'in_progress' | 'closed' | 'archived'
          priority?: number
          estimated_hours?: number | null
          total_cost?: number | null
          documents?: string[]
          notes?: string | null
          created_at?: string
          updated_at?: string
          closed_at?: string | null
        }
      }
      appointments: {
        Row: {
          id: string
          client_id: string
          advocate_id: string
          case_id: string | null
          title: string
          description: string | null
          scheduled_at: string
          duration_minutes: number
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
          meeting_url: string | null
          notes: string | null
          cost: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          advocate_id: string
          case_id?: string | null
          title: string
          description?: string | null
          scheduled_at: string
          duration_minutes?: number
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
          meeting_url?: string | null
          notes?: string | null
          cost?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          advocate_id?: string
          case_id?: string | null
          title?: string
          description?: string | null
          scheduled_at?: string
          duration_minutes?: number
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
          meeting_url?: string | null
          notes?: string | null
          cost?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          subscription_id: string | null
          appointment_id: string | null
          amount_mad: number
          currency: string
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id: string | null
          invoice_number: string | null
          invoice_url: string | null
          paid_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription_id?: string | null
          appointment_id?: string | null
          amount_mad: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id?: string | null
          invoice_number?: string | null
          invoice_url?: string | null
          paid_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_id?: string | null
          appointment_id?: string | null
          amount_mad?: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id?: string | null
          invoice_number?: string | null
          invoice_url?: string | null
          paid_at?: string | null
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          details: Json
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          resource_type?: string
          resource_id?: string | null
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: {
          user_uuid: string
        }
        Returns: 'citizen' | 'advocate' | 'admin'
      }
      create_audit_log: {
        Args: {
          p_user_id: string
          p_action: string
          p_resource_type: string
          p_resource_id?: string
          p_details?: Json
        }
        Returns: void
      }
    }
    Enums: {
      user_role: 'citizen' | 'advocate' | 'admin'
      advocate_status: 'pending' | 'verified' | 'suspended' | 'rejected'
      subscription_status: 'active' | 'cancelled' | 'expired' | 'trial'
      case_status: 'open' | 'in_progress' | 'closed' | 'archived'
      appointment_status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}