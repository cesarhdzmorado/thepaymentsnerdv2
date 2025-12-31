-- Migration: Add referral system to subscribers table
-- Run this in your Supabase SQL editor

-- Add referral columns to subscribers table
ALTER TABLE subscribers
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by TEXT REFERENCES subscribers(referral_code) ON DELETE SET NULL;

-- Create index for faster referral lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_referral_code ON subscribers(referral_code);
CREATE INDEX IF NOT EXISTS idx_subscribers_referred_by ON subscribers(referred_by);

-- Add email_analytics table for tracking email events from Resend webhooks
CREATE TABLE IF NOT EXISTS email_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'delivered', 'opened', 'clicked', 'bounced', 'complained'
  newsletter_date TEXT, -- matches publication_date from newsletters table
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB -- store additional event data
);

-- Create indexes for email analytics
CREATE INDEX IF NOT EXISTS idx_email_analytics_email ON email_analytics(email);
CREATE INDEX IF NOT EXISTS idx_email_analytics_event_type ON email_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_email_analytics_newsletter_date ON email_analytics(newsletter_date);
CREATE INDEX IF NOT EXISTS idx_email_analytics_created_at ON email_analytics(created_at);

-- Grant permissions (adjust based on your Supabase setup)
-- ALTER TABLE email_analytics ENABLE ROW LEVEL SECURITY;
