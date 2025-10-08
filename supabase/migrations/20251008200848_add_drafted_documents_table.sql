/*
  # Create drafted_documents table

  1. New Tables
    - `drafted_documents`
      - `id` (uuid, primary key) - Unique document identifier
      - `user_id` (uuid, foreign key) - References auth.users
      - `title` (text) - Document title
      - `content` (text) - Document content (markdown or plain text)
      - `type` (text) - Document type (legal_draft, behavioral_analysis, etc.)
      - `related_report_id` (uuid, nullable) - Optional reference to source report
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `drafted_documents` table
    - Add policies for authenticated users to manage their own documents

  3. Indexes
    - Index on user_id for performance
    - Index on created_at for sorting
*/

-- Drop the existing drafted_documents table if it exists with wrong schema
DROP TABLE IF EXISTS drafted_documents CASCADE;

-- Create drafted_documents table with correct schema
CREATE TABLE drafted_documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL,
  related_report_id uuid REFERENCES reports(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX drafted_documents_user_id_idx ON drafted_documents(user_id);
CREATE INDEX drafted_documents_created_at_idx ON drafted_documents(created_at DESC);

-- Add update trigger
DROP TRIGGER IF EXISTS update_drafted_documents_updated_at ON drafted_documents;
CREATE TRIGGER update_drafted_documents_updated_at
  BEFORE UPDATE ON drafted_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE drafted_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own drafted documents"
  ON drafted_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drafted documents"
  ON drafted_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafted documents"
  ON drafted_documents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own drafted documents"
  ON drafted_documents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);