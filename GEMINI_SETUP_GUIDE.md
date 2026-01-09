# Gemini API Setup Guide - Complete Configuration

## 🚀 Why Gemini Instead of Azure?

✅ **No approval needed** - Get API key instantly  
✅ **Generous free tier** - 1500 requests/day  
✅ **Multimodal** - Text + Vision in one model  
✅ **Cheaper** - $0.075/1M tokens (vs Azure $30/1M)  
✅ **Better for students** - No credit card required  

---

## 📋 Quick Setup (5 Minutes)

### Step 1: Get Gemini API Key

```bash
1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy your key (starts with "AIza...")
```

**That's it!** No resource groups, no regions, no approvals needed.

---

### Step 2: Install Local CLIP (Mac)

```bash
# Create Python environment
cd /Users/kartiksharma/Desktop/Projects/pcod_app/backend
python3 -m venv venv
source venv/bin/activate

# Install CLIP and dependencies
pip install torch torchvision
pip install git+https://github.com/openai/CLIP.git
pip install pillow numpy flask

# Test CLIP
python3 -c "import clip; print(clip.available_models())"
# Should show: ['RN50', 'RN101', 'RN50x4', 'RN50x16', 'RN50x64', 'ViT-B/32', 'ViT-B/16', 'ViT-L/14', 'ViT-L/14@336px']
```

**Recommended model**: `ViT-B/32` (fast, good accuracy)

---

### Step 3: Setup Deepgram (Voice)

```bash
1. Sign up: https://deepgram.com/
2. Get $200 free credits
3. Copy API key from dashboard
```

---

### Step 4: Configure Environment Variables

Update `.env`:

```bash
# Gemini API
GEMINI_API_KEY=AIza...your_key_here

# Deepgram (Voice)
DEEPGRAM_API_KEY=your_deepgram_key

# Supabase (already configured)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# Local CLIP settings
CLIP_MODEL=ViT-B/32
CLIP_DEVICE=mps  # Use Apple Silicon GPU

# API Settings
API_BASE_URL=http://localhost:3000
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│              React Native App                        │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│           NestJS/Express Backend                     │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │  Gemini  │  │   CLIP   │  │ Deepgram │         │
│  │ (Cloud)  │  │ (Local)  │  │ (Cloud)  │         │
│  └──────────┘  └──────────┘  └──────────┘         │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│            Supabase (Database)                       │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Service Breakdown

### 1. **Gemini 2.0 Flash** (Text + Vision)
- Facial analysis (hirsutism, acne)
- Food detection & nutrition
- Medical OCR
- Risk assessment
- Chatbot conversations

### 2. **Local CLIP** (Image Embeddings)
- Fast image classification
- Similarity search
- Embedding generation
- Runs on your Mac's GPU (MPS)

### 3. **Deepgram** (Voice)
- Speech-to-Text (Nova-2)
- Text-to-Speech (Aura)

---

## 💰 Cost Comparison

| Service | Free Tier | Paid Cost |
|---------|-----------|-----------|
| **Gemini API** | 1500 req/day | $0.075/1M tokens |
| **Azure OpenAI** | ❌ None | $30/1M tokens |
| **Local CLIP** | ✅ Free (runs locally) | $0 |
| **Deepgram** | $200 credits | $0.0043/min |

**Monthly cost for 1000 users**: ~$15-20 (vs $96 with Azure!)

---

## 🚀 Backend Setup

### Install Dependencies

```bash
cd backend

# Node.js dependencies
npm install @google/generative-ai express cors dotenv multer winston

# Python dependencies (for CLIP)
source venv/bin/activate
pip install torch torchvision clip pillow flask numpy
```

### Start Services

```bash
# Terminal 1: Node.js backend
npm run dev

# Terminal 2: Python CLIP server
source venv/bin/activate
python clip_server.py
```

---

## 🧪 Test Setup

### Test Gemini API

```bash
curl -X POST http://localhost:3000/api/test/gemini \
  -H "Content-Type: application/json" \
  -d '{"message": "What is PCOS?"}'
```

### Test Local CLIP

```bash
curl -X POST http://localhost:5001/classify \
  -F "image=@test_image.jpg" \
  -F "labels=hirsutism,acne,normal"
```

### Test Deepgram

```bash
curl -X POST http://localhost:3000/api/voice/transcribe \
  -F "audio=@test_audio.wav"
```

---

## 📊 Gemini API Limits

### Free Tier:
- **1500 requests per day**
- **32K tokens per request**
- **Rate limit**: 60 RPM

### Paid Tier ($0.075/1M tokens):
- **Unlimited requests**
- **Rate limit**: 1000 RPM

**For your app**: Free tier = ~50 users/day

---

## 🔧 Running CLIP on Mac

### Why CLIP Locally?

✅ **Zero cost** - No API fees  
✅ **Fast** - <100ms inference on M-series  
✅ **Privacy** - Data stays local  
✅ **Reliable** - No internet needed  

### Performance on Apple Silicon:

| Model | Speed (M1/M2) | Accuracy |
|-------|---------------|----------|
| ViT-B/32 | ~50ms | Good |
| ViT-B/16 | ~100ms | Better |
| ViT-L/14 | ~200ms | Best |

**Recommendation**: Use ViT-B/32 for real-time, ViT-L/14 for batch processing

---

## 🎯 Use Cases

### Gemini Vision (Cloud):
- Facial analysis (detailed descriptions)
- Food detection (complex reasoning)
- Medical OCR (text extraction)
- HRV interpretation (contextual analysis)

### CLIP (Local):
- Quick image classification
- Facial feature detection
- Food categorization
- Image embeddings for search

**Strategy**: Use CLIP for fast classification, Gemini for detailed analysis

---

## 🔐 Security

### API Keys:
```bash
# Never commit these!
.env
backend/.env
```

### CORS:
```typescript
app.use(cors({
  origin: 'http://localhost:8081'  // Expo dev server only
}));
```

---

## 📚 API Documentation

### Gemini API:
- Docs: https://ai.google.dev/docs
- Models: https://ai.google.dev/models/gemini
- Pricing: https://ai.google.dev/pricing

### CLIP:
- GitHub: https://github.com/openai/CLIP
- Paper: https://arxiv.org/abs/2103.00020
- Examples: https://github.com/openai/CLIP#usage

### Deepgram:
- Docs: https://developers.deepgram.com/
- Models: Nova-2 (STT), Aura (TTS)

---

## ✅ Setup Checklist

- [ ] Got Gemini API key (5 mins)
- [ ] Installed Python 3.10+ (if needed)
- [ ] Installed CLIP locally
- [ ] Created Deepgram account
- [ ] Updated all keys in `.env`
- [ ] Installed Node dependencies
- [ ] Installed Python dependencies
- [ ] Tested Gemini API
- [ ] Tested local CLIP
- [ ] Started backend servers

**Total setup time**: ~20 minutes

---

## 🚨 Troubleshooting

### "torch not found"
```bash
# Install PyTorch with MPS support (Apple Silicon)
pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

### "CLIP model download slow"
```bash
# Models download on first use (~350MB for ViT-B/32)
# Be patient, it's one-time
```

### "Gemini API quota exceeded"
```bash
# Free tier: 1500 requests/day
# Solution: Wait 24 hours or upgrade to paid tier
```

---

**You're ready to build! Much simpler than Azure! 🚀**
