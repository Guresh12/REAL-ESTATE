-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  area VARCHAR(255),
  type VARCHAR(50) CHECK (type IN ('apartment', 'house', 'commercial', 'land')),
  status VARCHAR(50) CHECK (status IN ('available', 'sold', 'reserved')) DEFAULT 'available',
  images TEXT[],
  virtual_tour_url TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  sqft INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create plots table
CREATE TABLE IF NOT EXISTS plots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plot_number VARCHAR(100) NOT NULL UNIQUE,
  area VARCHAR(255) NOT NULL,
  size DECIMAL(10, 2) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) CHECK (status IN ('available', 'sold', 'reserved')) DEFAULT 'available',
  location VARCHAR(255) NOT NULL,
  description TEXT,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_visits table
CREATE TABLE IF NOT EXISTS site_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plot_id UUID REFERENCES plots(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(255) NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  message TEXT,
  status VARCHAR(50) CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(50),
  role VARCHAR(50) CHECK (role IN ('admin', 'user')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create receipts table
CREATE TABLE IF NOT EXISTS receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(255) NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  plot_id UUID REFERENCES plots(id) ON DELETE SET NULL,
  amount DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(100) NOT NULL,
  transaction_id VARCHAR(255) NOT NULL UNIQUE,
  receipt_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create website_content table
CREATE TABLE IF NOT EXISTS website_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) CHECK (type IN ('banner', 'announcement', 'company_info')) NOT NULL,
  title VARCHAR(255),
  content TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_plots_status ON plots(status);
CREATE INDEX IF NOT EXISTS idx_site_visits_status ON site_visits(status);
CREATE INDEX IF NOT EXISTS idx_receipts_property ON receipts(property_id);
CREATE INDEX IF NOT EXISTS idx_receipts_plot ON receipts(plot_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plots_updated_at BEFORE UPDATE ON plots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_visits_updated_at BEFORE UPDATE ON site_visits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_receipts_updated_at BEFORE UPDATE ON receipts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_website_content_updated_at BEFORE UPDATE ON website_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;

-- Policies for properties (public read, admin write)
CREATE POLICY "Properties are viewable by everyone" ON properties
  FOR SELECT USING (true);

CREATE POLICY "Properties are editable by admins" ON properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Policies for plots (public read, admin write)
CREATE POLICY "Plots are viewable by everyone" ON plots
  FOR SELECT USING (true);

CREATE POLICY "Plots are editable by admins" ON plots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Policies for site_visits (public insert, admin read/update)
CREATE POLICY "Site visits are insertable by everyone" ON site_visits
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Site visits are viewable by admins" ON site_visits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Site visits are updatable by admins" ON site_visits
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Policies for profiles (users can read/update their own, admins can read all)
CREATE POLICY "Profiles are viewable by owner and admins" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Profiles are updatable by owner" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies for receipts (admin only)
CREATE POLICY "Receipts are viewable by admins" ON receipts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Receipts are editable by admins" ON receipts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Policies for website_content (public read, admin write)
CREATE POLICY "Website content is viewable by everyone" ON website_content
  FOR SELECT USING (is_active = true);

CREATE POLICY "Website content is editable by admins" ON website_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

