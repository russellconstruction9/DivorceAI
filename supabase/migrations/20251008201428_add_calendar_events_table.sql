/*
  # Add calendar_events table

  1. New Tables
    - `calendar_events`
      - `id` (uuid, primary key) - Unique event identifier
      - `user_id` (uuid, foreign key) - References auth.users
      - `title` (text) - Event title
      - `description` (text, nullable) - Event description
      - `event_date` (date) - Date of the event
      - `event_type` (text) - Type: 'report', 'custom', 'appointment', 'deadline', 'other'
      - `related_report_id` (uuid, nullable) - Optional reference to report
      - `color` (text) - Color indicator for event
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `calendar_events` table
    - Add policies for authenticated users to manage their own events

  3. Indexes
    - Index on user_id for performance
    - Index on event_date for date-based queries
*/

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  event_date date NOT NULL,
  event_type text NOT NULL DEFAULT 'custom',
  related_report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  color text DEFAULT 'blue',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS calendar_events_user_id_idx ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS calendar_events_date_idx ON calendar_events(event_date);
CREATE INDEX IF NOT EXISTS calendar_events_user_date_idx ON calendar_events(user_id, event_date);

-- Add update trigger
DROP TRIGGER IF EXISTS update_calendar_events_updated_at ON calendar_events;
CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own calendar events"
  ON calendar_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calendar events"
  ON calendar_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calendar events"
  ON calendar_events FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calendar events"
  ON calendar_events FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);