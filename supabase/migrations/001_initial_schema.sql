-- Initial Database Schema for PCOD/PCOS Management App
-- This creates the core tables with Row Level Security (RLS) enabled

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Health Profiles Table (Tier 1: Onboarding Data)
CREATE TABLE IF NOT EXISTS health_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 13 AND age <= 100),
  height DECIMAL(5,2) NOT NULL CHECK (height > 0), -- in cm
  weight DECIMAL(5,2) NOT NULL CHECK (weight > 0), -- in kg
  bmi DECIMAL(4,2) GENERATED ALWAYS AS (weight / ((height/100) * (height/100))) STORED,
  cycle_regularity VARCHAR(50) CHECK (cycle_regularity IN ('regular', 'irregular', 'very_irregular')),
  cycle_duration INTEGER CHECK (cycle_duration >= 21 AND cycle_duration <= 45),
  has_acne BOOLEAN DEFAULT false,
  has_hirsutism BOOLEAN DEFAULT false,
  has_acanthosis_nigricans BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Lab Results Table (Tier 2: Clinical Data from OCR)
CREATE TABLE IF NOT EXISTS lab_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  test_type VARCHAR(20) CHECK (test_type IN ('blood', 'ultrasound')) NOT NULL,
  -- Hormonal markers
  free_testosterone DECIMAL(6,2), -- ng/dL
  lh DECIMAL(6,2), -- mIU/mL
  fsh DECIMAL(6,2), -- mIU/mL
  amh DECIMAL(6,2), -- ng/mL
  -- Ultrasound data
  follicle_count INTEGER,
  endometrium_thickness DECIMAL(4,2), -- mm
  -- Document metadata
  document_url TEXT NOT NULL,
  ocr_confidence DECIMAL(3,2) CHECK (ocr_confidence >= 0 AND ocr_confidence <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wearable Data Table (Tier 3: Continuous Health Streams)
CREATE TABLE IF NOT EXISTS wearable_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  data_type VARCHAR(50) CHECK (data_type IN ('bbt', 'hrv', 'sleep', 'steps', 'heart_rate')) NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  source VARCHAR(50), -- e.g., 'health_connect', 'manual'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient time-series queries
CREATE INDEX idx_wearable_data_user_time ON wearable_data(user_id, recorded_at DESC);

-- Diagnostic Results Table
CREATE TABLE IF NOT EXISTS diagnostic_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  condition VARCHAR(20) CHECK (condition IN ('PCOD', 'PCOS', 'NORMAL')) NOT NULL,
  phenotype VARCHAR(50) CHECK (phenotype IN ('insulin_resistant', 'inflammatory', 'adrenal', 'post_pill')),
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  recommendations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meal Logs Table (Food Scanning History)
CREATE TABLE IF NOT EXISTS meal_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  food_items JSONB, -- Array of detected foods
  glycemic_load DECIMAL(5,2),
  metabolic_impact VARCHAR(20) CHECK (metabolic_impact IN ('low', 'medium', 'high')),
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interventions Table (Hormonal Sentinel Recommendations)
CREATE TABLE IF NOT EXISTS interventions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  intervention_type VARCHAR(50) CHECK (intervention_type IN ('diet', 'exercise', 'stress', 'sleep', 'medication')) NOT NULL,
  trigger_reason TEXT,
  recommendation TEXT NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'viewed', 'applied', 'dismissed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE health_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE wearable_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view their own health profile"
  ON health_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health profile"
  ON health_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health profile"
  ON health_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own lab results"
  ON lab_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lab results"
  ON lab_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own wearable data"
  ON wearable_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wearable data"
  ON wearable_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own diagnostic results"
  ON diagnostic_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diagnostic results"
  ON diagnostic_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own meal logs"
  ON meal_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meal logs"
  ON meal_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own interventions"
  ON interventions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own interventions"
  ON interventions FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on health_profiles
CREATE TRIGGER update_health_profiles_updated_at
  BEFORE UPDATE ON health_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
