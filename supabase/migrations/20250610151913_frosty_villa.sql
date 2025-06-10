/*
  # Initial Schema for Moroccan Legal SaaS Platform

  1. New Tables
    - `profiles` - Extended user profiles with roles and verification
    - `advocates` - Advocate-specific information and verification
    - `subscription_plans` - Available subscription tiers
    - `user_subscriptions` - User subscription tracking
    - `legal_cases` - Case management for advocates and clients
    - `appointments` - Booking system for consultations
    - `payments` - Payment tracking and invoicing
    - `audit_logs` - Security and compliance logging

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Implement data isolation between users

  3. Moroccan Compliance
    - Support for Arabic/French content
    - Advocate verification with bar association IDs
    - Data localization considerations
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('citizen', 'advocate', 'admin');
CREATE TYPE advocate_status AS ENUM ('pending', 'verified', 'suspended', 'rejected');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'trial');
CREATE TYPE case_status AS ENUM ('open', 'in_progress', 'closed', 'archived');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  role user_role DEFAULT 'citizen',
  preferred_language text DEFAULT 'ar' CHECK (preferred_language IN ('ar', 'fr', 'en')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Advocates table
CREATE TABLE IF NOT EXISTS advocates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  bar_association_id text UNIQUE NOT NULL,
  license_number text UNIQUE NOT NULL,
  specializations text[] DEFAULT '{}',
  years_experience integer DEFAULT 0,
  office_address text,
  city text,
  status advocate_status DEFAULT 'pending',
  verification_documents text[], -- URLs to uploaded documents
  verified_at timestamptz,
  verified_by uuid REFERENCES profiles(id),
  bio_ar text, -- Arabic bio
  bio_fr text, -- French bio
  hourly_rate decimal(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_ar text NOT NULL,
  name_fr text NOT NULL,
  description text,
  description_ar text,
  description_fr text,
  price_mad decimal(10,2) NOT NULL, -- Price in Moroccan Dirham
  billing_interval text CHECK (billing_interval IN ('month', 'year')),
  features jsonb DEFAULT '{}',
  max_consultations integer,
  max_documents integer,
  priority_support boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES subscription_plans(id),
  status subscription_status DEFAULT 'trial',
  current_period_start timestamptz DEFAULT now(),
  current_period_end timestamptz,
  trial_end timestamptz,
  stripe_subscription_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Legal cases
CREATE TABLE IF NOT EXISTS legal_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  advocate_id uuid REFERENCES advocates(id),
  title text NOT NULL,
  title_ar text,
  title_fr text,
  description text NOT NULL,
  category text NOT NULL,
  status case_status DEFAULT 'open',
  priority integer DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
  estimated_hours decimal(5,2),
  total_cost decimal(10,2),
  documents text[] DEFAULT '{}', -- URLs to case documents
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  closed_at timestamptz
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  advocate_id uuid REFERENCES advocates(id) ON DELETE CASCADE,
  case_id uuid REFERENCES legal_cases(id),
  title text NOT NULL,
  description text,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  status appointment_status DEFAULT 'scheduled',
  meeting_url text, -- For video consultations
  notes text,
  cost decimal(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES user_subscriptions(id),
  appointment_id uuid REFERENCES appointments(id),
  amount_mad decimal(10,2) NOT NULL,
  currency text DEFAULT 'MAD',
  status payment_status DEFAULT 'pending',
  stripe_payment_intent_id text,
  invoice_number text UNIQUE,
  invoice_url text,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Audit logs for compliance
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  details jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE advocates ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read/update their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Advocates: Public read for verified advocates, own record management
CREATE POLICY "Anyone can view verified advocates" ON advocates
  FOR SELECT USING (status = 'verified');

CREATE POLICY "Advocates can manage own record" ON advocates
  FOR ALL USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Subscription plans: Public read
CREATE POLICY "Anyone can view active plans" ON subscription_plans
  FOR SELECT USING (is_active = true);

-- User subscriptions: Users can view own subscriptions
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own subscriptions" ON user_subscriptions
  FOR ALL USING (user_id = auth.uid());

-- Legal cases: Clients see own cases, advocates see assigned cases
CREATE POLICY "Clients can view own cases" ON legal_cases
  FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Advocates can view assigned cases" ON legal_cases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM advocates 
      WHERE user_id = auth.uid() AND id = legal_cases.advocate_id
    )
  );

CREATE POLICY "Clients can create cases" ON legal_cases
  FOR INSERT WITH CHECK (client_id = auth.uid());

-- Appointments: Participants can view/manage their appointments
CREATE POLICY "Users can view own appointments" ON appointments
  FOR SELECT USING (
    client_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM advocates 
      WHERE user_id = auth.uid() AND id = appointments.advocate_id
    )
  );

-- Payments: Users can view own payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (user_id = auth.uid());

-- Audit logs: Admins only
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert default subscription plans
INSERT INTO subscription_plans (name, name_ar, name_fr, description, description_ar, description_fr, price_mad, billing_interval, features, max_consultations, max_documents) VALUES
('Free', 'مجاني', 'Gratuit', 'Basic legal information access', 'وصول أساسي للمعلومات القانونية', 'Accès de base aux informations juridiques', 0.00, 'month', '{"basic_info": true}', 1, 5),
('Citizen Pro', 'مواطن محترف', 'Citoyen Pro', 'Priority legal consultations and document generation', 'استشارات قانونية ذات أولوية وإنشاء المستندات', 'Consultations juridiques prioritaires et génération de documents', 100.00, 'month', '{"priority_support": true, "document_generation": true, "chat_support": true}', 10, 50),
('Advocate Basic', 'محامي أساسي', 'Avocat de Base', 'Case management and client communication tools', 'أدوات إدارة القضايا والتواصل مع العملاء', 'Outils de gestion de cas et de communication client', 500.00, 'month', '{"case_management": true, "client_portal": true, "calendar": true}', 100, 500),
('Advocate Pro', 'محامي محترف', 'Avocat Pro', 'Advanced analytics, video consultations, and premium features', 'تحليلات متقدمة واستشارات فيديو وميزات متميزة', 'Analyses avancées, consultations vidéo et fonctionnalités premium', 1000.00, 'month', '{"analytics": true, "video_calls": true, "priority_listing": true, "api_access": true}', -1, -1);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_user_role(user_uuid uuid)
RETURNS user_role AS $$
BEGIN
  RETURN (SELECT role FROM profiles WHERE id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION create_audit_log(
  p_user_id uuid,
  p_action text,
  p_resource_type text,
  p_resource_id uuid DEFAULT NULL,
  p_details jsonb DEFAULT '{}'::jsonb
) RETURNS void AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details)
  VALUES (p_user_id, p_action, p_resource_type, p_resource_id, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advocates_updated_at BEFORE UPDATE ON advocates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legal_cases_updated_at BEFORE UPDATE ON legal_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();