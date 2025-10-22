/*
  # Create RSVP Table for Wedding Invitation

  1. New Tables
    - `rsvp_submissions`
      - `id` (uuid, primary key) - Unique identifier for each RSVP
      - `guest_name` (text, required) - Name of the guest
      - `email` (text, optional) - Guest email address
      - `attendance` (text, required) - Attending or Not attending
      - `number_of_guests` (integer, default 1) - Number of people attending
      - `meal_preference` (text, optional) - Dietary preferences or meal choice
      - `message` (text, optional) - Additional message from guest
      - `created_at` (timestamptz) - Timestamp of submission

  2. Security
    - Enable RLS on `rsvp_submissions` table
    - Add policy for anonymous users to insert their RSVP
    - Add policy for service role to read all RSVPs (for admin access)

  3. Notes
    - Email is optional as per requirements
    - Anonymous submissions allowed for guest convenience
    - All RSVP data will be stored securely with RLS enabled
*/

CREATE TABLE IF NOT EXISTS rsvp_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  email text,
  attendance text NOT NULL CHECK (attendance IN ('attending', 'not_attending')),
  number_of_guests integer DEFAULT 1 CHECK (number_of_guests > 0),
  meal_preference text,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rsvp_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit RSVP"
  ON rsvp_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Service role can read all RSVPs"
  ON rsvp_submissions
  FOR SELECT
  TO service_role
  USING (true);