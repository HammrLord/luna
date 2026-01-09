# Azure Setup Guide - Complete Configuration

## 🚀 Quick Start (5 Steps)

### Step 1: Create Azure Account
1. Go to https://azure.microsoft.com/en-us/free/students/
2. Sign in with your student email (.edu)
3. Verify student status
4. Get **$100 free credit** (no credit card required!)

---

### Step 2: Create Azure OpenAI Resource

```bash
# Via Azure Portal (Easiest):
1. Go to https://portal.azure.com
2. Search "Azure OpenAI"
3. Click "+ Create"
4. Fill in:
   - Resource group: pcod-app-rg (create new)
   - Region: East US or Sweden Central
   - Name: pcod-openai
   - Pricing tier: Standard S0
5. Click "Review + Create"
```

**Deploy Models**:
```
After resource is created:
1. Go to resource → "Model deployments"
2. Click "+ Create new deployment"
3. Deploy these models:
   - Model: gpt-4 → Deployment name: gpt-4
   - Model: gpt-4-vision-preview → Deployment name: gpt-4-vision
4. Note the deployment names!
```

---

### Step 3: Get API Keys

```bash
# Azure OpenAI Keys:
1. Go to your Azure OpenAI resource
2. Click "Keys and Endpoint" (left sidebar)
3. Copy:
   - KEY 1 (your API key)
   - Endpoint (looks like: https://pcod-openai.openai.azure.com/)
```

---

### Step 4: Create Azure Blob Storage

```bash
# For storing images:
1. Search "Storage accounts" in Azure Portal
2. Click "+ Create"
3. Fill in:
   - Resource group: pcod-app-rg (same as before)
   - Storage account name: pcodappstorage
   - Region: East US (same as OpenAI)
   - Performance: Standard
   - Redundancy: LRS (cheapest)
4. Create

After creation:
1. Go to resource → "Containers"
2. Create containers:
   - meal-images (Private)
   - medical-reports (Private)
   - facial-images (Private)
3. Go to "Access keys"
4. Copy "Connection string"
```

---

### Step 5: Configure Environment Variables

Update `/Users/kartiksharma/Desktop/Projects/pcod_app/.env`:

```bash
# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://pcod-openai.openai.azure.com/
AZURE_OPENAI_API_KEY=your_key_from_step_3
AZURE_OPENAI_GPT4_DEPLOYMENT=gpt-4
AZURE_OPENAI_GPT4V_DEPLOYMENT=gpt-4-vision

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=your_connection_string_from_step_4
AZURE_STORAGE_CONTAINER_MEALS=meal-images
AZURE_STORAGE_CONTAINER_REPORTS=medical-reports
AZURE_STORAGE_CONTAINER_FACIAL=facial-images

# Deepgram (STT + TTS) - Sign up at deepgram.com
# Free tier: $200 credits + 45K minutes/month
DEEPGRAM_API_KEY=your_deepgram_api_key
```

---

## 🔧 Backend Setup

```bash
# 1. Navigate to backend
cd /Users/kartiksharma/Desktop/Projects/pcod_app/backend

# 2. Install dependencies
npm install

# 3. Build TypeScript
npm run build

# 4. Start server
npm run dev
```

**Server will run on**: http://localhost:3000

---

## 📱 Connect Mobile App to Backend

Update `/Users/kartiksharma/Desktop/Projects/pcod_app/.env`:

```bash
API_BASE_URL=http://192.168.1.7:3000  # Your computer's local IP
```

Find your IP:
```bash
# On Mac:
ifconfig | grep "inet " | grep -v 127.0.0.1

# Use the 192.168.x.x address
```

---

## ✅ Test the Setup

### 1. Test Azure OpenAI

```bash
curl -X POST http://localhost:3000/api/test/openai \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, test Azure OpenAI"}'
```

Expected response:
```json
{
  "success": true,
  "response": "..."
}
```

### 2. Test Facial Analysis

```bash
# From React Native app:
# Take a selfie → Upload to /api/facial/analyze
# Should return hirsutism scores and acne assessment
```

---

## 💰 Monitor Costs

### Dashboard:
1. Go to Azure Portal → "Cost Management + Billing"
2. View "Cost analysis"
3. Set budget alert at $80 (80% of $100 credit)

### Expected Usage (1000 users/month):
```
Azure OpenAI: $95/month
  - GPT-4 Vision: 5000 images × $0.01 = $50
  - GPT-4 Text: 15K requests × $0.003 = $45

Blob Storage: $1/month

Total: ~$96/month (within $100 credit!)
```

---

## 🔐 Security Best Practices

### 1. Never Commit API Keys
```bash
# Already in .gitignore:
.env
backend/.env
```

### 2. Use Environment Variables
```typescript
// backend/src/config/azure.config.ts
export const config = {
  azure: {
    openai: {
      endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
      apiKey: process.env.AZURE_OPENAI_API_KEY!,
      gpt4Deployment: process.env.AZURE_OPENAI_GPT4_DEPLOYMENT!,
      gpt4VisionDeployment: process.env.AZURE_OPENAI_GPT4V_DEPLOYMENT!
    }
  }
};
```

### 3. Enable CORS (Backend)
```typescript
// Only allow your React Native app
app.use(cors({
  origin: 'http://localhost:8081'  // Expo dev server
}));
```

---

## 🚨 Troubleshooting

### "Access Denied" Error
```
Problem: No access to Azure OpenAI
Solution:
1. Apply for access: https://aka.ms/oai/access
2. Takes 1-2 business days
3. Fill out form describing PCOS app use case
```

### "Quota Exceeded"
```
Problem: Hit rate limits
Solution:
1. Go to Azure OpenAI resource
2. "Quotas" tab
3. Request quota increase (free for students)
```

### "Invalid Deployment Name"
```
Problem: Model deployment name mismatch
Solution:
1. Check deployment names in Azure Portal
2. Update .env to match EXACTLY
```

---

## 📊 API Endpoints Created

### Base URL: `http://localhost:3000/api`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/facial/analyze` | POST | Analyze facial image for hirsutism & acne |
| `/food/analyze` | POST | Detect food items & calculate nutrition |
| `/ocr/blood-report` | POST | Extract data from blood reports |
| `/risk/assess` | POST | Calculate PCOS probability |
| `/hrv/interpret` | POST | Analyze HRV metrics |
| `/chat/message` | POST | Medical chatbot |
| `/voice/transcribe` | POST | Speech-to-text (Deepgram) |
| `/voice/synthesize` | POST | Text-to-speech (ElevenLabs) |

---

## 🎯 Next Steps After Setup

1. **Test facial analysis**: Upload a selfie from the app
2. **Test food detection**: Take a photo of a meal
3. **Test chatbot**: Ask "What is PCOS?"
4. **Monitor costs**: Check Azure dashboard daily
5. **Collect feedback**: Get 10-20 beta users to validate

---

## 📚 Additional Resources

- **Azure OpenAI Docs**: https://learn.microsoft.com/en-us/azure/ai-services/openai/
- **GPT-4 Vision Guide**: https://platform.openai.com/docs/guides/vision
- **Azure SDK for JS**: https://github.com/Azure/azure-sdk-for-js
- **Deepgram Docs**: https://developers.deepgram.com/
- **ElevenLabs API**: https://docs.elevenlabs.io/

---

## ✅ Checklist

- [ ] Created Azure account with student credits
- [ ] Created Azure OpenAI resource
- [ ] Deployed GPT-4 and GPT-4 Vision models
- [ ] Created Blob Storage containers
- [ ] Copied all API keys to .env
- [ ] Installed backend dependencies
- [ ] Started backend server successfully
- [ ] Updated mobile app API_BASE_URL
- [ ] Tested /api/facial/analyze endpoint
- [ ] Set up cost monitoring

**Total Setup Time**: ~30 minutes

**You're ready to build! 🚀**
