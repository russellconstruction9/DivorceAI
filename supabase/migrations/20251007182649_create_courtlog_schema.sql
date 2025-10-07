/*
  # CourtLog AI Database Schema

  ## Overview
  This migration creates the complete database schema for CourtLog AI, a co-parenting documentation platform.
  The schema supports incident reports, document storage, user profiles, and multi-device synchronization.

  ## New Tables

  ### 1. `profiles`
  User profile information for customizing the experience.
  - `id` (uuid, references auth.users) - Primary key, links to Supabase auth
  - `name` (text) - User's full name
  - `role` (text) - 'Mother', 'Father', or empty string
  - `children` (jsonb) - Array of children names
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `reports`
  Incident reports documenting co-parenting events.
  - `id` (uuid) - Primary key
  - `user_id` (uuid, references auth.users) - Owner of the report
  - `content` (text) - Full formatted incident report text
  - `category` (text) - Incident category classification
  - `tags` (jsonb) - Array of tags for categorization
  - `legal_context` (text) - Legal context notes
  - `images` (jsonb) - Array of base64 image data URLs
  - `created_at` (timestamptz) - Report creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `documents`
  Document library for storing legal documents and evidence.
  - `id` (uuid) - Primary key
  - `user_id` (uuid, references auth.users) - Owner of the document
  - `name` (text) - Document filename
  - `mime_type` (text) - Document MIME type
  - `data` (text) - Base64 encoded document data
  - `created_at` (timestamptz) - Upload timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security

  ### Row Level Security (RLS)
  All tables have RLS enabled with policies ensuring users can only access their own data.

  ### Policies
  - **profiles**: Users can read/update only their own profile, insert on signup
  - **reports**: Users can perform all operations only on their own reports
  - **documents**: Users can perform all operations only on their own documents

  ## Indexes
  - Performance indexes on user_id columns for faster queries
  - Timestamp indexes for chronological sorting

  ## Important Notes
  1. All tables use UUID primary keys for security and scalability
  2. JSONB columns used for flexible array storage (children, tags, images)
  3. Base64 encoding used for images/documents to maintain portability
  4. Timestamps automatically maintained with triggers
  5. RLS policies are restrictive by default - users can only access their own data
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text DEFAULT '',
  role text DEFAULT '',
  children jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  content text NOT NULL,
  category text NOT NULL,
  tags jsonb DEFAULT '[]'::jsonb,
  legal_context text DEFAULT '',
  images jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  mime_type text NOT NULL,
  data text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS reports_user_id_idx ON reports(user_id);
CREATE INDEX IF NOT EXISTS reports_created_at_idx ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS documents_user_id_idx ON documents(user_id);
CREATE INDEX IF NOT EXISTS documents_created_at_idx ON documents(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to maintain updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reports_updated_at ON reports;
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Reports policies
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON reports FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
  ON reports FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);