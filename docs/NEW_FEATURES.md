# New Features - Technical Specification

## Overview
This document outlines the technical implementation for three major new features:
1. **Dual AI Agents** (Chatbot + Empathetic Conversational Bot)
2. **Community Forum** (Peer Support Platform)
3. **1v1 Doctor Consultations** (Telemedicine Integration)

---

## 1. AI Agents System

### 1.1 Chatbot (Information & Guidance)

**Purpose**: Answer PCOD/PCOS related questions, provide information, guide through app features

**Technology Stack**:
- **LLM**: Azure OpenAI (GPT-4) or Google Gemini
- **Framework**: LangChain for conversation management
- **Vector DB**: Pinecone/Weaviate for medical knowledge base
- **Context**: User's health profile, diagnostic results, conversation history

**Key Features**:
- Medical information retrieval
- Symptom checking (disclaimer: not diagnostic)
- Medication information
- Diet and exercise guidance
- App feature navigation

**Backend Implementation**:
```typescript
// backend/src/modules/chatbot/chatbot.controller.ts
POST /api/chatbot/message
GET /api/chatbot/sessions/:userId
POST /api/chatbot/new-session
```

**Mobile Implementation**:
```typescript
// src/modules/chatbot/ChatbotScreen.tsx
- Chat interface with message history
- Quick action buttons (common questions)
- Voice input support
```

---

### 1.2 Empathetic Conversational Bot

**Purpose**: Emotional support, mental health check-ins, stress management

**Technology Stack**:
- **LLM**: Azure OpenAI (GPT-4 with empathetic system prompts)
- **Emotional Analysis**: Azure Text Analytics for Sentiment
- **Crisis Detection**: Rule-based + ML for detecting distress signals

**Key Features**:
- Daily mood check-ins
- Emotional support conversations
- Stress and anxiety management
- Journaling prompts
- Crisis resource recommendations (if severe distress detected)

**Special Considerations**:
- Non-judgmental tone
- Never provides  medical advice
- Escalates to human resources when needed
- Privacy: conversations never shared

**Backend Implementation**:
```typescript
// backend/src/modules/empathetic-bot/empathetic-bot.controller.ts
POST /api/empathetic-bot/message
POST /api/empathetic-bot/mood-checkin
GET /api/empathetic-bot/mood-history/:userId
```

---

## 2. Community Forum

### 2.1 Forum Structure

**Categories**:
- PCOD Support
- PCOS Support
- Lifestyle & Diet
- Success Stories
- Fertility & Pregnancy
- Mental Health
- Ask the Community

**Features**:
- Create posts (text, images)
- Comment and reply (nested threads)
- Upvote/downvote
- Anonymous posting option
- Search and filter
- Report inappropriate content
- Pin important posts

### 2.2 Moderation System

**Community Guidelines**:
- No medical advice from non-professionals
- Respectful communication
- Privacy protection
- No spam or promotional content

**Moderation Tools**:
- User reporting
- Auto-moderation (Azure Content Moderator)
- Moderator dashboard (admin panel)
- Ban/timeout capabilities

### 2.3 Backend Implementation

```typescript
// backend/src/modules/forum/forum.controller.ts
GET /api/forum/categories
GET /api/forum/posts?category=&page=&sort=
POST /api/forum/posts
GET /api/forum/posts/:postId
PUT /api/forum/posts/:postId
DELETE /api/forum/posts/:postId
POST /api/forum/posts/:postId/comments
POST /api/forum/posts/:postId/vote
POST /api/forum/posts/:postId/report
```

### 2.4 Mobile Implementation

```typescript
// src/modules/forum/
- ForumHomeScreen.tsx (categories list)
- PostListScreen.tsx (posts in category)
- PostDetailScreen.tsx (post + comments)
- CreatePostScreen.tsx
- UserProfileScreen.tsx (user's posts/comments)
```

### 2.5 Real-time Features

**Using Supabase Real-time**:
- Live comment updates
- Live vote counts
- New post notifications

---

## 3. Doctor Consultations (Telemedicine)

### 3.1 Doctor Onboarding

**Verification Process**:
- Medical license verification (manual review)
- Specialization credentials
- Background check
- Profile creation

**Doctor Dashboard**:
- Availability management
- Appointment calendar
- Patient history
- Earnings tracking

### 3.2 Consultation Booking Flow

**User Flow**:
1. Browse doctors (filter by specialization, rating, availability)
2. View doctor profile
3. Select time slot
4. Fill pre-consultation form
5. Make payment
6. Receive confirmation + calendar invite

**Backend Implementation**:
```typescript
// backend/src/modules/consultations/consultations.controller.ts
GET /api/doctors?specialization=&available=
GET /api/doctors/:doctorId
GET /api/doctors/:doctorId/availability
POST /api/consultations/book
GET /api/consultations/:userId
GET /api/consultations/:consultationId
PUT /api/consultations/:consultationId/status
POST /api/consultations/:consultationId/review
```

### 3.3 Video Consultation

**Technology**: Azure Communication Services

**Features**:
- HD video call
- Screen sharing (for showing reports)
- In-call chat
- Call recording (with consent)
- Automatic transcription

**Implementation**:
```typescript
// backend/src/modules/video/video.controller.ts
POST /api/video/create-room (creates Azure Communication room)
GET /api/video/token/:consultationId (generates access token)
POST /api/video/end-call
```

```typescript
// src/modules/consultations/VideoCallScreen.tsx
- Azure Communication Services WebRTC integration
- Camera/mic controls
- Chat drawer
- End call button
```

### 3.4 Pre-Consultation Report

**Auto-generated from app data**:
- Latest diagnostic results
- Recent lab results
- Symptom tracking
- Medication history
- Lifestyle data (from Digital Twin)

**Shared with doctor before call**

### 3.5 Post-Consultation

**Doctor Actions**:
- Add consultation notes
- Write prescription (digital)
- Recommend follow-up date
- Share medical advice

**User Receives**:
- Consultation summary
- Prescription (downloadable PDF)
- Follow-up reminders
- Option to rate and review

### 3.6 Payment Integration

**Payment Gateway**: Stripe / Razorpay

**Features**:
- Secure payment processing
- Refund policy (cancellation > 24h before)
- Doctor payout management
- Transaction history

```typescript
// backend/src/modules/payments/payments.controller.ts
POST /api/payments/create-intent
POST /api/payments/confirm
POST /api/payments/refund/:consultationId
GET /api/payments/history/:userId
```

---

## 4. Azure Services Required

### Additional Azure Resources Needed:

1. **Azure OpenAI Service**
   - For both chatbots
   - GPT-4 deployment
   - Cost: ~$0.03 per 1K tokens

2. **Azure Communication Services**
   - Video calling
   - Chat
   - Cost: ~$0.004 per minute

3. **Azure Content Moderator**
   - Forum moderation
   - Cost: ~$1 per 1K transactions

4. **Azure Text Analytics**
   - Sentiment analysis for empathetic bot
   - Cost: ~$2 per 1K records

---

## 5. Database Schema

Created in `supabase/migrations/002_new_features.sql`:

### Tables:
1. **chat_sessions** - AI chatbot conversations
2. **chat_messages** - Individual chat messages
3. **forum_categories** - Forum categories
4. **forum_posts** - Community posts
5. **forum_comments** - Post comments/replies
6. **forum_votes** - Upvotes/downvotes
7. **doctors** - Doctor profiles
8. **doctor_availability** - Doctor schedules
9. **consultations** - Appointments
10. **consultation_messages** - In-call chat
11. **consultation_notes** - Doctor notes & prescriptions
12. **consultation_reviews** - Ratings & reviews

All with Row Level Security (RLS) policies!

---

## 6. Mobile Modules to Create

```
src/modules/
├── chatbot/
│   ├── ChatbotScreen.tsx
│   └── ChatService.ts
├── empathetic-bot/
│   ├── EmpatheticBotScreen.tsx
│   ├── MoodCheckinScreen.tsx
│   └── EmpatheticService.ts
├── forum/
│   ├── ForumHomeScreen.tsx
│   ├── PostListScreen.tsx
│   ├── PostDetailScreen.tsx
│   ├── CreatePostScreen.tsx
│   └── ForumService.ts
└── consultations/
    ├── DoctorListScreen.tsx
    ├── DoctorProfileScreen.tsx
    ├── BookingScreen.tsx
    ├── VideoCallScreen.tsx
    ├── ConsultationHistoryScreen.tsx
    └── ConsultationService.ts
```

---

## 7. Implementation Priority

### Phase 1 (MVP - 2-3 weeks):
1. ✅ Information Chatbot (basic Q&A)
2. ✅ Community Forum (posts, comments, voting)
3. ✅ Doctor listing and profiles

### Phase 2 (4-6 weeks):
4. ✅ Empathetic Bot with mood tracking
5. ✅ Video consultation integration
6. ✅ Payment processing

### Phase 3 (7-8 weeks):
7. ✅ Advanced chatbot (RAG with medical knowledge)
8. ✅ Forum moderation tools
9. ✅ Doctor analytics dashboard

---

## 8. Cost Estimation (Azure Students Credits)

**Monthly costs with moderate usage**:
- Azure OpenAI (2 chatbots): $20-40
- Azure Communication Services (video): $10-30
- Content Moderator: $5-10
- Text Analytics: $5

**Total**: ~$40-85/month

**Within $100 Azure for Students budget!** ✅

---

## 9. Security & Privacy

### Chat Data:
- Encrypted at rest and in transit
- User can delete conversation history
- AI doesn't retain conversation context across sessions

### Forum:
- Anonymous posting option
- User data never exposed
- Moderation for harmful content

### Consultations:
- HIPAA-compliant storage
- Doctor-patient confidentiality
- Video recordings encrypted
- Prescription data protected

---

## 10. Next Steps

1. Run the new database migration:
   ```bash
   PGPASSWORD='...' psql -h ... -f supabase/migrations/002_new_features.sql
   ```

2. Set up Azure OpenAI resource
3. Set up Azure Communication Services
4. Create backend modules for chatbot, forum, consultations
5. Build React Native UIs

Would you like me to start implementing any of these features?
