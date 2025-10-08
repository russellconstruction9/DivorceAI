/*
  # Add related_report_id to drafted_documents
  
  ## Changes
  - Adds `related_report_id` column to `drafted_documents` table
  - This column links behavioral analyses to their source reports
  - Nullable because not all drafted documents come from behavioral analyses
  
  ## Columns Added
  - `related_report_id` (uuid, nullable) - References the report that triggered this analysis
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drafted_documents' AND column_name = 'related_report_id'
  ) THEN
    ALTER TABLE drafted_documents ADD COLUMN related_report_id uuid REFERENCES reports(id) ON DELETE SET NULL;
  END IF;
END $$;