-- Create enum for campaign status
CREATE TYPE campaign_status AS ENUM ('Draft', 'Queued', 'Sent', 'Error');

-- Create enum for campaign type
CREATE TYPE campaign_type AS ENUM ('WhatsApp', 'SMS');

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type campaign_type NOT NULL,
  sender TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  status campaign_status NOT NULL DEFAULT 'Draft',
  target_count INTEGER NOT NULL DEFAULT 0,
  success_count INTEGER NOT NULL DEFAULT 0,
  fail_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scheduled_at TIMESTAMPTZ,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies for campaigns
CREATE POLICY "Users can view their own campaigns"
  ON campaigns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns"
  ON campaigns FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns"
  ON campaigns FOR DELETE
  USING (auth.uid() = user_id);

-- Create system_logs table
CREATE TABLE IF NOT EXISTS system_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  level TEXT NOT NULL, -- info, success, warn, error
  msg TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for system_logs
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read logs
CREATE POLICY "Authenticated users can view logs"
  ON system_logs FOR SELECT
  TO authenticated
  USING (true);

-- Functions to update counts
CREATE OR REPLACE FUNCTION increment_campaign_stats(
  campaign_id UUID,
  is_success BOOLEAN
)
RETURNS VOID AS $$
BEGIN
  IF is_success THEN
    UPDATE campaigns 
    SET success_count = success_count + 1 
    WHERE id = campaign_id;
  ELSE
    UPDATE campaigns 
    SET fail_count = fail_count + 1 
    WHERE id = campaign_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,
  type TEXT NOT NULL, -- 'in' (topup), 'out' (usage)
  channel TEXT NOT NULL, -- 'WhatsApp', 'SMS', 'System'
  description TEXT,
  status TEXT NOT NULL DEFAULT 'COMPLETED', -- COMPLETED, PENDING, FAILED
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for profiles and transactions
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Realtime for system_logs
ALTER PUBLICATION supabase_realtime ADD TABLE system_logs;
