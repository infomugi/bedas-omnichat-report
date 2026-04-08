-- 1. Update profiles table with WhatsApp columns
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS whatsapp_status TEXT DEFAULT 'DISCONNECTED',
  ADD COLUMN IF NOT EXISTS whatsapp_phone TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_session JSONB;

-- 2. Create contact_lists table
CREATE TABLE IF NOT EXISTS contact_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  channel TEXT NOT NULL, -- 'WhatsApp' | 'SMS'
  contact_count INTEGER DEFAULT 0,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  list_id UUID REFERENCES contact_lists(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  name TEXT,
  extra_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create lba_targets table
CREATE TABLE IF NOT EXISTS lba_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  lat DOUBLE PRECISION NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  radius_meters INTEGER NOT NULL,
  provider TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT NOT NULL, -- 'campaign', 'billing', 'system'
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for all new tables
ALTER TABLE contact_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lba_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Add RLS Policies
CREATE POLICY "Users can view their own contact lists" ON contact_lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own contact lists" ON contact_lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own contact lists" ON contact_lists FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view contacts in their lists" ON contacts FOR SELECT USING (EXISTS (SELECT 1 FROM contact_lists WHERE id = contacts.list_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert contacts in their lists" ON contacts FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM contact_lists WHERE id = list_id AND user_id = auth.uid()));

CREATE POLICY "Users can view targets for their campaigns" ON lba_targets FOR SELECT USING (EXISTS (SELECT 1 FROM campaigns WHERE id = lba_targets.campaign_id AND user_id = auth.uid()));
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

-- Enable Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
