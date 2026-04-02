-- OMEGA REAL ESTATE - DATABASE SETUP GUIDE
-- Copy and paste this into your Supabase SQL Editor

-- 1. Create Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price NUMERIC NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL,
  listing_purpose TEXT DEFAULT 'Listing', -- 'Listing' or 'Request'
  is_verified BOOLEAN DEFAULT FALSE,
  beds INTEGER,
  baths INTEGER,
  sqft INTEGER,
  description TEXT,
  image_url TEXT,
  gallery TEXT[] DEFAULT '{}',
  agent_id UUID NOT NULL,
  agent_name TEXT,
  agent_email TEXT,
  agent_phone TEXT,
  views_count INTEGER DEFAULT 0
);

-- 2. Create Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL,
  property_id TEXT NOT NULL,
  UNIQUE(user_id, property_id)
);

-- 3. Create Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  property_id TEXT,
  property_title TEXT,
  agent_email TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE
);

-- 4. RPC for View Counting
CREATE OR REPLACE FUNCTION increment_views(target_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE properties
  SET views_count = views_count + 1
  WHERE id = target_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies (Properties)
CREATE POLICY "Public Properties view" ON properties FOR SELECT USING (true);
CREATE POLICY "Agent can update own properties" ON properties FOR UPDATE USING (auth.uid() = agent_id);
CREATE POLICY "Agent can delete own properties" ON properties FOR DELETE USING (auth.uid() = agent_id);
CREATE POLICY "Authenticated users can insert properties" ON properties FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 7. RLS Policies (Favorites)
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- 8. RLS Policies (Messages)
CREATE POLICY "Agents can view messages to them" ON messages FOR SELECT USING (auth.email() = agent_email);
CREATE POLICY "Anyone can insert messages" ON messages FOR INSERT WITH CHECK (true);
