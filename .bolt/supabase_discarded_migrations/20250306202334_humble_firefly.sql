/*
  # Add services and update variables schema

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text, nullable)
      - `created_at` (timestamp)

  2. Changes
    - Add `service_id` column to `configurations` table
    - Make `service_id` required for all variables
    - Add foreign key constraint to ensure service exists

  3. Security
    - Enable RLS on `services` table
    - Add policies for authenticated users to manage services
*/

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for services
CREATE POLICY "Allow all operations for authenticated users"
  ON services
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add service_id to variables
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'configurations' 
    AND column_name = 'service_id'
  ) THEN
    -- First create the column as nullable
    ALTER TABLE configurations ADD COLUMN service_id uuid;

    -- Create a default service for existing variables
    INSERT INTO services (name, description)
    VALUES ('Default Service', 'Default service for existing variables')
    ON CONFLICT (name) DO NOTHING;

    -- Update existing variables to use the default service
    UPDATE configurations 
    SET service_id = (SELECT id FROM services WHERE name = 'Default Service')
    WHERE service_id IS NULL;

    -- Now make the column required
    ALTER TABLE configurations 
    ALTER COLUMN service_id SET NOT NULL;

    -- Add foreign key constraint
    ALTER TABLE configurations
    ADD CONSTRAINT configurations_service_id_fkey
    FOREIGN KEY (service_id)
    REFERENCES services(id)
    ON DELETE CASCADE;
  END IF;
END $$;