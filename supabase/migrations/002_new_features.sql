-- Additional schema for new features: AI Agents, Community Forum, Doctor Consultations

-- =============================================================================
-- AI CHATBOT CONVERSATIONS
-- =============================================================================

-- Chat sessions with AI agents
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  agent_type VARCHAR(50) CHECK (agent_type IN ('chatbot', 'empathetic')) NOT NULL,
  session_title TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  role VARCHAR(20) CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB, -- For storing context, emotional tone, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_session ON chat_messages(session_id, created_at);

-- =============================================================================
-- COMMUNITY FORUM
-- =============================================================================

-- Forum categories (PCOD, PCOS, Lifestyle, Success Stories, etc.)
CREATE TABLE IF NOT EXISTS forum_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum posts
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES forum_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_forum_posts_category ON forum_posts(category_id, created_at DESC);
CREATE INDEX idx_forum_posts_user ON forum_posts(user_id, created_at DESC);

-- Forum comments/replies
CREATE TABLE IF NOT EXISTS forum_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id UUID REFERENCES forum_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_forum_comments_post ON forum_comments(post_id, created_at);

-- Post/comment votes
CREATE TABLE IF NOT EXISTS forum_votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES forum_comments(id) ON DELETE CASCADE,
  vote_type INTEGER CHECK (vote_type IN (-1, 1)) NOT NULL, -- -1 downvote, 1 upvote
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id),
  CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL))
);

-- =============================================================================
-- DOCTOR CONSULTATIONS
-- =============================================================================

-- Doctor profiles
CREATE TABLE IF NOT EXISTS doctors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  specialization TEXT NOT NULL,
  medical_license_number VARCHAR(100) NOT NULL UNIQUE,
  years_of_experience INTEGER,
  bio TEXT,
  education JSONB, -- Array of degrees
  certifications JSONB, -- Array of certifications
  languages JSONB, -- Array of languages spoken
  consultation_fee DECIMAL(10,2),
  is_verified BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  total_consultations INTEGER DEFAULT 0,
  profile_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doctor availability schedule
CREATE TABLE IF NOT EXISTS doctor_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6) NOT NULL, -- 0=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultation appointments
CREATE TABLE IF NOT EXISTS consultations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 15,
  status VARCHAR(50) CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
  meeting_url TEXT, -- Video call link (Azure Communication Services)
  meeting_id VARCHAR(100),
  amount_paid DECIMAL(10,2),
  payment_status VARCHAR(50) CHECK (payment_status IN ('pending', 'completed', 'refunded')),
  notes TEXT, -- Pre-consultation notes from user
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_consultations_user ON consultations(user_id, scheduled_at);
CREATE INDEX idx_consultations_doctor ON consultations(doctor_id, scheduled_at);

-- Consultation chat messages (text during video call)
CREATE TABLE IF NOT EXISTS consultation_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE NOT NULL,
  sender_type VARCHAR(20) CHECK (sender_type IN ('user', 'doctor')) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultation notes and prescriptions
CREATE TABLE IF NOT EXISTS consultation_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  diagnosis TEXT,
  recommendations TEXT,
  prescription JSONB, -- Array of medications
  follow_up_date DATE,
  private_notes TEXT, -- Doctor's private notes
  shared_with_user BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultation ratings and reviews
CREATE TABLE IF NOT EXISTS consultation_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(consultation_id)
);

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Chat Sessions
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own chat sessions"
  ON chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chat sessions"
  ON chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own chat sessions"
  ON chat_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Chat Messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages from their sessions"
  ON chat_messages FOR SELECT 
  USING (session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert messages to their sessions"
  ON chat_messages FOR INSERT 
  WITH CHECK (session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid()));

-- Forum Posts (public read, owner write)
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view forum posts"
  ON forum_posts FOR SELECT USING (true);
CREATE POLICY "Users can create forum posts"
  ON forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts"
  ON forum_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts"
  ON forum_posts FOR DELETE USING (auth.uid() = user_id);

-- Forum Comments
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view forum comments"
  ON forum_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments"
  ON forum_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments"
  ON forum_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments"
  ON forum_comments FOR DELETE USING (auth.uid() = user_id);

-- Forum Votes
ALTER TABLE forum_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own votes"
  ON forum_votes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own votes"
  ON forum_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own votes"
  ON forum_votes FOR UPDATE USING (auth.uid() = user_id);

-- Doctors (public read for verified doctors)
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view verified doctors"
  ON doctors FOR SELECT USING (is_verified = true);
CREATE POLICY "Doctors can update their own profile"
  ON doctors FOR UPDATE USING (auth.uid() = user_id);

-- Consultations
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own consultations"
  ON consultations FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM doctors WHERE id = doctor_id));
CREATE POLICY "Users can create consultations"
  ON consultations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users and doctors can update consultations"
  ON consultations FOR UPDATE 
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM doctors WHERE id = doctor_id));

-- Consultation Reviews
ALTER TABLE consultation_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view reviews"
  ON consultation_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for their consultations"
  ON consultation_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Update post upvote count
CREATE OR REPLACE FUNCTION update_post_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE forum_posts 
  SET upvotes = (SELECT COALESCE(SUM(vote_type), 0) FROM forum_votes WHERE post_id = NEW.post_id)
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_upvotes
  AFTER INSERT OR UPDATE OR DELETE ON forum_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_upvotes();

-- Update doctor average rating
CREATE OR REPLACE FUNCTION update_doctor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE doctors 
  SET 
    average_rating = (SELECT AVG(rating) FROM consultation_reviews WHERE doctor_id = NEW.doctor_id),
    total_consultations = (SELECT COUNT(*) FROM consultations WHERE doctor_id = NEW.doctor_id AND status = 'completed')
  WHERE id = NEW.doctor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_doctor_rating
  AFTER INSERT ON consultation_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_doctor_rating();
