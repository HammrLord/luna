# Azure AI Features - Complete Implementation Plan

## 🎯 Overview

Advanced PCOS/PCOD diagnostic system using Azure AI services for automated medical assessment, reducing clinical dependency and improving accessibility.

---

## 1. 📄 OCR for Medical Reports (Azure Document Intelligence)

### Purpose
Extract structured data from blood reports, ultrasound summaries, and hormone panels using Azure's OCR.

### Azure Service
**Azure AI Document Intelligence (formerly Form Recognizer)**
- Custom model training for medical reports
- Pre-built health document models
- High accuracy for medical terminology

### Report Types & Fields to Extract

#### A. Blood Reports (Hormonal Panel)
```json
{
  "report_type": "hormonal_panel",
  "fields_to_extract": {
    "LH": { "value": 15.2, "unit": "mIU/mL", "range": "1.9-12.5" },
    "FSH": { "value": 5.1, "unit": "mIU/mL", "range": "3.0-20.0" },
    "LH_FSH_ratio": { "value": 2.98, "calculated": true },
    "testosterone": { "value": 85, "unit": "ng/dL", "range": "15-70" },
    "TSH": { "value": 2.5, "unit": "μIU/mL", "range": "0.4-4.0" },
    "fasting_insulin": { "value": 18, "unit": "μIU/mL", "range": "<25" },
    "fasting_glucose": { "value": 95, "unit": "mg/dL", "range": "<100" },
    "HbA1c": { "value": 5.6, "unit": "%", "range": "<5.7" },
    "AMH": { "value": 8.5, "unit": "ng/mL", "range": "1.5-4.0" },
    "prolactin": { "value": 22, "unit": "ng/mL", "range": "4-23" },
    "DHEA-S": { "value": 380, "unit": "μg/dL", "range": "65-380" },
    "17-OH-progesterone": { "value": 1.8, "unit": "ng/mL" }
  },
  "flags": ["elevated_testosterone", "high_LH_FSH_ratio", "elevated_AMH"]
}
```

#### B. Ultrasound Reports
```json
{
  "report_type": "transvaginal_ultrasound",
  "fields_to_extract": {
    "ovary_right": {
      "volume": "12.5 cm³",
      "follicle_count": 15,
      "follicle_distribution": "peripheral",
      "stromal_volume": "increased"
    },
    "ovary_left": {
      "volume": "11.8 cm³",
      "follicle_count": 14,
      "follicle_distribution": "peripheral",
      "stromal_volume": "increased"
    },
    "endometrium_thickness": "6 mm",
    "uterus_size": "normal"
  },
  "pcos_criteria": {
    "rotterdam_met": true,
    "polycystic_morphology": "bilateral"
  }
}
```

#### C. Lipid Profile
```json
{
  "report_type": "lipid_profile",
  "fields_to_extract": {
    "total_cholesterol": { "value": 210, "unit": "mg/dL", "range": "<200" },
    "LDL": { "value": 140, "unit": "mg/dL", "range": "<100" },
    "HDL": { "value": 42, "unit": "mg/dL", "range": ">50" },
    "triglycerides": { "value": 165, "unit": "mg/dL", "range": "<150" }
  }
}
```

### NanoBanana Integration (Fake Report Generation for Testing)

#### What You Need from NanoBanana
```
Features needed for realistic fake medical reports:

1. Template-based generation:
   - Blood report layouts (Quest Diagnostics, LabCorp style)
   - Ultrasound report formats
   - Hospital letterhead variations

2. Realistic data ranges:
   - PCOS-positive profiles (high LH/FSH, elevated testosterone)
   - Non-PCOS profiles (normal ranges)
   - Borderline cases for edge testing

3. Image quality variations:
   - Scanned documents (different DPI: 150, 300, 600)
   - Photo captures (slight blur, rotation, shadows)
   - Crumpled paper effects
   - Coffee stains/aging effects

4. Output formats:
   - PDF (vectorized text)
   - JPG/PNG (scanned images)
   - Multiple pages support

5. Batch generation:
   - Generate 1000+ diverse reports
   - Mix of positive/negative cases
   - Different hospitals/formats
```

### Azure Document Intelligence Setup

**Model**: Custom model trained on medical reports

```python
# Training data structure
training_data/
  ├── blood_reports/
  │   ├── sample_001.pdf
  │   ├── sample_001.json  # Labels
  │   ├── sample_002.pdf
  │   └── ...
  ├── ultrasound_reports/
  │   └── ...
  └── lipid_profiles/
      └── ...
```

**API Implementation**:
```typescript
// backend/src/services/azureOcrService.ts
POST /api/ocr/analyze-medical-report
Request: { image: File, reportType: 'blood' | 'ultrasound' | 'lipid' }
Response: { extractedFields: {...}, confidence: 0.95, flags: [...] }
```

---

## 2. 🍽️ Food Detection & Calorie Tracking (Azure AI Vision)

### Purpose
Real-time meal analysis using GPT-4 Vision to identify food items, estimate portions, and calculate nutritional information.

### Azure Service
**Azure OpenAI GPT-4 Vision (GPT-4V)**

### Features

#### A. Food Detection
```json
{
  "detected_items": [
    {
      "food_name": "Chapati (whole wheat)",
      "quantity": 2,
      "portion_size": "medium (6 inch diameter)",
      "confidence": 0.92
    },
    {
      "food_name": "Dal Tadka",
      "quantity": 1,
      "portion_size": "~150ml (1 katori)",
      "confidence": 0.88
    },
    {
      "food_name": "Mixed Vegetable Sabzi",
      "quantity": 1,
      "portion_size": "~100g",
      "confidence": 0.85
    },
    {
      "food_name": "Cucumber Salad",
      "quantity": 1,
      "portion_size": "~50g",
      "confidence": 0.90
    }
  ]
}
```

#### B. Nutritional Calculation
```json
{
  "total_nutrition": {
    "calories": 485,
    "protein": 18,
    "carbs": 68,
    "fat": 14,
    "fiber": 12,
    "sugar": 4,
    "sodium": 450
  },
  "glycemic_load": 18,
  "insulin_impact_score": 42,
  "pcos_friendliness": "good",
  "recommendations": [
    "Add 100g paneer for better protein balance",
    "Eat salad first to reduce GL by 25%"
  ]
}
```

#### C. Meal Timing Analysis
```json
{
  "meal_time": "13:30",
  "meal_type": "lunch",
  "optimal_for_pcos": true,
  "reason": "Carb tolerance is highest during daytime",
  "next_meal_suggestion": "Light dinner before 8 PM"
}
```

### GPT-4V Prompt Engineering

```python
SYSTEM_PROMPT = """
You are a nutrition expert specializing in PCOS/PCOD management.
Analyze food images and provide:
1. Food identification (Indian and international cuisine)
2. Portion estimation (visual cues)
3. Nutritional breakdown
4. Glycemic index/load
5. PCOS-specific recommendations

Focus on:
- Insulin resistance management
- Anti-inflammatory foods
- Hormonal balance
"""

USER_PROMPT = """
Analyze this meal image:
1. List all food items with portion sizes
2. Calculate total calories and macros
3. Estimate glycemic load
4. Rate PCOS-friendliness (1-10)
5. Suggest modifications for better hormonal balance

User context:
- Phenotype: {insulin_resistant}
- Cycle phase: {follicular}
- Recent HRV: {55}
"""
```

### Database Schema
```sql
CREATE TABLE meal_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  photo_url TEXT,
  detected_foods JSONB,
  nutrition_summary JSONB,
  glycemic_load FLOAT,
  insulin_impact_score INTEGER,
  pcos_score INTEGER,
  recommendations JSONB,
  meal_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 3. 🤖 Chatbot & Voice Bot (Azure OpenAI + Speech Services)

### A. Text Chatbot

**Azure Service**: Azure OpenAI GPT-4

**Features**:
- PCOS/PCOD knowledge base (RAG)
- Symptom checking
- Treatment guidance
- Emotional support
- Cycle tracking assistance

**RAG Implementation**:
```
Knowledge Base:
- Clinical guidelines (Rotterdam, NIH criteria)
- Treatment protocols
- Lifestyle recommendations
- Research papers (PubMed integration)
- Success stories

Vector DB: Azure AI Search
Embedding Model: text-embedding-ada-002
```

**Conversation Flow**:
```typescript
User: "I'm feeling anxious about my PCOS diagnosis"

Bot: "I understand this can feel overwhelming. PCOS is manageable with the right approach. 

Your current plan:
✅ Diet: Low-GI foods
✅ Exercise: 4x/week
📊 Your insulin levels improved 15% in 30 days

What specific concerns do you have? I'm here to help."
```

### B. Voice Bot

**Azure Services**:
1. **Azure Speech-to-Text** (STT)
2. **Azure Text-to-Speech** (TTS)
3. **Azure OpenAI** (GPT-4)

**Voice Configuration**:
```typescript
{
  "voice_name": "en-IN-NeerjaNeural",  // Female Indian voice
  "speaking_rate": "0.95",  // Calm, empathetic
  "pitch": "+2Hz",
  "style": "empathetic"
}
```

**Use Cases**:
- Hands-free symptom logging
- Meditation/stress management guidance
- Daily check-ins
- Medication reminders

**Implementation**:
```typescript
// Real-time voice conversation
WebSocket Connection:
  Client (React Native) ↔ Backend ↔ Azure Speech Services

Flow:
1. User speaks → Azure STT → Text
2. Text → GPT-4 → Response
3. Response → Azure TTS → Audio
4. Audio → Client (plays instantly)
```

---

## 4. 😊 Facial Feature Detection (Hirsutism & Acne)

### Purpose
Automate Ferriman-Gallwey score and acne severity assessment using computer vision.

### Azure Service
**Azure AI Vision + Custom Vision**

### A. Hirsutism Detection (Facial Hair)

**Target Areas**:
- Upper lip
- Chin
- Sideburns

**Ferriman-Gallwey Score Automation**:
```json
{
  "faceRegions": {
    "upperLip": {
      "hairDensity": "moderate",
      "score": 3,
      "confidence": 0.87
    },
    "chin": {
      "hairDensity": "high",
      "score": 4,
      "confidence": 0.91
    }
  },
  "totalScore": 7,
  "classification": "mild_hirsutism",
  "androgen_indicator": "likely_elevated"
}
```

**Training Data Needed**:
- Annotated facial images with hirsutism scores (0-4 per region)
- Diverse skin tones
- Different lighting conditions

**Dataset**: Transfer learn from face detection models + custom hirsutism annotations

### B. Acne Severity Detection

**Classification** (Global Acne Grading System):
- Comedones (whiteheads/blackheads)
- Papules (red bumps)
- Pustules (pus-filled)
- Nodules (deep, painful)

```json
{
  "acneAnalysis": {
    "totalLesions": 15,
    "comedones": 8,
    "papules": 5,
    "pustules": 2,
    "nodules": 0,
    "severity": "moderate",
    "score": 18,
    "pcos_correlation": 0.76
  }
}
```

**Training**: Transfer learning from ACNE04 dataset

### Implementation
```typescript
POST /api/facial-analysis/assess
Request: { selfieImage: File }
Response: { hirsutism: {...}, acne: {...}, androgenScore: 0-100 }
```

---

## 5. ❤️ HRV Detection via rPPG (Autonomic Dysfunction)

### Purpose
Detect sympathetic dominance (stress/PCOS marker) using phone camera.

### Technology
**Custom OpenCV Pipeline** (deployed on Azure Container Instances)

Not a direct Azure AI service, but deployed on Azure infrastructure.

### How rPPG Works
1. User places finger on camera with flash on
2. Detect subtle color changes in fingertip (blood volume pulse)
3. Extract heart rate variability signal
4. Calculate LF/HF ratio (sympathetic vs parasympathetic)

### Implementation

**Signal Processing**:
```python
# backend/ml_services/rppg/hrv_detector.py

def analyze_hrv_from_video(video_frames):
    """
    Input: 60 seconds of fingertip video (30 fps)
    Output: HRV metrics
    """
    # 1. ROI Detection (fingertip)
    roi = detect_fingertip_roi(frames)
    
    # 2. Extract RGB signals
    rgb_signals = extract_color_channels(roi)
    
    # 3. Independent Component Analysis (remove noise)
    cleaned_signal = apply_ica(rgb_signals)
    
    # 4. Peak detection (R-R intervals)
    rr_intervals = detect_heartbeats(cleaned_signal)
    
    # 5. Frequency domain analysis
    lf_power, hf_power = fft_analysis(rr_intervals)
    
    return {
        "lf_hf_ratio": lf_power / hf_power,
        "sympathetic_dominance": lf_hf_ratio > 2.5,
        "pcos_risk_indicator": "high" if lf_hf_ratio > 3 else "normal"
    }
```

**Expected Metrics**:
```json
{
  "hrv_analysis": {
    "mean_hr": 78,
    "rmssd": 25,  // Normal: >30
    "lf_power": 850,
    "hf_power": 280,
    "lf_hf_ratio": 3.04,  // PCOS indicator: >2.5
    "stress_level": "elevated",
    "pcos_correlation": 0.82
  },
  "recommendation": "Practice deep breathing 5min daily to reduce sympathetic activity"
}
```

**Mobile UI**:
```
Screen: HRV Test
1. "Place your fingertip on the camera"
2. "Keep still for 60 seconds"
3. Real-time heart rate display
4. Completion: HRV score + stress level
```

---

## 6. 🧠 Adaptive Risk Assessment (ML-Powered Questionnaire)

### Purpose
Intelligent questionnaire that adapts based on responses, powered by XGBoost/Random Forest.

### Azure Service
**Azure Machine Learning** (model training & deployment)

### Features

**Dynamic Questioning**:
```
If BMI > 30:
  → Ask: "Do you have dark patches on neck/armpits?" (Acanthosis Nigricans)
  → Weight: 0.8 (high importance)

If Cycle Length > 35 days:
  → Ask: "Do you experience hair thinning?" (Androgenic alopecia)
  → Weight: 0.7

If Age < 18:
  → Skip fertility questions
  → Focus on adolescent-specific symptoms
```

### Risk Calculation Model

**Input Features** (22 features):
```python
features = {
    # Clinical
    "age": 26,
    "bmi": 28.5,
    "waist_hip_ratio": 0.88,
    "cycle_length": 42,
    "cycle_regularity": "irregular",
    
    # Symptoms
    "hirsutism_score": 7,
    "acne_severity": 2,
    "hair_loss": True,
    "acanthosis_nigricans": True,
    "weight_gain_last_year": 8,  // kg
    
    # Self-reported
    "family_history_pcos": True,
    "family_history_diabetes": True,
    "difficulty_losing_weight": True,
    "mood_swings": True,
    "fatigue": True,
    
    # Lab (if available)
    "lh_fsh_ratio": 2.8,
    "testosterone": 82,
    "fasting_insulin": 18,
    "fasting_glucose": 95
}
```

**Output**:
```json
{
  "pcos_probability": 0.87,
  "confidence": 0.92,
  "risk_level": "high",
  "phenotype": "insulin_resistant",
  "contributing_factors": [
    { "factor": "irregular_cycles", "weight": 0.25 },
    { "factor": "elevated_bmi", "weight": 0.22 },
    { "factor": "hirsutism", "weight": 0.18 }
  ],
  "next_steps": [
    "Schedule blood test for LH, FSH, Testosterone",
    "Track cycle for 3 months",
    "Consider ultrasound evaluation"
  ]
}
```

### Model Training

**Dataset**: Kaggle PCOS Dataset (540+ samples)
- Physical parameters
- Clinical features
- PCOS diagnosis labels

**Algorithm**: XGBoost (best for tabular data)

```python
# Train on Azure ML
from azureml.core import Workspace, Experiment
from azureml.train.sklearn import SKLearn

# Model performance target
Accuracy: >92%
Sensitivity: >90% (catch true positives)
Specificity: >85%
```

**Deployment**: Azure ML real-time endpoint

```typescript
POST /api/risk-assessment/predict
Request: { features: {...} }
Response: { pcos_probability: 0.87, ... }
```

---

## 7. 🗂️ Complete Azure Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Native App                        │
│  (Camera, Mic, Forms, Photo Capture)                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              NestJS Backend (Azure App Service)             │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   OCR    │  │   Food   │  │  Chat    │  │   Risk   │  │
│  │ Service  │  │  Vision  │  │  Service │  │Assessment│  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
└───────┼─────────────┼─────────────┼─────────────┼─────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                   Azure AI Services                          │
│                                                              │
│  ┌────────────────────┐  ┌────────────────────┐            │
│  │ Document           │  │ OpenAI GPT-4V      │            │
│  │ Intelligence       │  │ (Food Vision)      │            │
│  │ (OCR)              │  │                    │            │
│  └────────────────────┘  └────────────────────┘            │
│                                                              │
│  ┌────────────────────┐  ┌────────────────────┐            │
│  │ OpenAI GPT-4       │  │ Speech Services    │            │
│  │ (Chatbot)          │  │ (STT + TTS)        │            │
│  └────────────────────┘  └────────────────────┘            │
│                                                              │
│  ┌────────────────────┐  ┌────────────────────┐            │
│  │ Custom Vision      │  │ Machine Learning   │            │
│  │ (Facial Analysis)  │  │ (Risk Model)       │            │
│  └────────────────────┘  └────────────────────┘            │
│                                                              │
│  ┌────────────────────┐  ┌────────────────────┐            │
│  │ Container          │  │ Blob Storage       │            │
│  │ Instances          │  │ (Images, Reports)  │            │
│  │ (rPPG Service)     │  │                    │            │
│  └────────────────────┘  └────────────────────┘            │
└──────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Supabase (PostgreSQL)                      │
│  - User profiles, meal logs, reports, HRV data              │
│  - RLS policies for data privacy                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. 💰 Azure Cost Estimation (Monthly)

| Service | Usage | Cost/Month |
|---------|-------|------------|
| Azure Document Intelligence | 1000 reports | $10 |
| Azure OpenAI GPT-4V | 5000 food scans | $50 |
| Azure OpenAI GPT-4 | 10K chat messages | $30 |
| Azure Speech Services | 2000 voice sessions | $15 |
| Azure Custom Vision | 5000 facial analyses | $10 |
| Azure ML (inference) | 10K risk assessments | $20 |
| Azure Container Instances | rPPG processing | $15 |
| Azure Blob Storage | 50GB images | $1 |
| **Total** | | **~$151/month** |

**For 1000 active users**: **$0.15 per user/month**

**Azure for Students $100 credit covers ~650 users/month!** ✅

---

## 9. 🚀 Implementation Roadmap

### Phase 1: Core AI Features (Weeks 1-3)
- [ ] Set up Azure OpenAI resource
- [ ] Implement GPT-4V food detection
- [ ] Basic chatbot with RAG
- [ ] Azure Blob Storage setup

### Phase 2: Advanced Diagnostics (Weeks 4-6)
- [ ] Train Custom Vision for facial analysis
- [ ] Deploy XGBoost risk model to Azure ML
- [ ] Implement rPPG HRV detection

### Phase 3: Medical OCR (Weeks 7-8)
- [ ] Train Azure Document Intelligence on medical reports
- [ ] Generate 1000+ fake reports with NanoBanana
- [ ] Validate extraction accuracy (>95%)

### Phase 4: Voice & Integration (Weeks 9-10)
- [ ] Azure Speech Services integration
- [ ] Real-time voice conversations
- [ ] End-to-end testing
- [ ] Clinical validation study

---

## 10. 📚 Research Papers & Datasets

### Key Papers:
1. "AI-based decision support for early PCOS diagnosis" (facial features)
2. "Heart Rate Variability in PCOS" (HRV/autonomic dysfunction)
3. "PCOSt: Non-invasive screening tool" (risk scoring)

### Datasets:
1. **Kaggle PCOS Dataset**: Physical & clinical parameters
2. **ACNE04 Dataset**: Acne severity grading
3. **Custom**: Hirsutism annotations (need to create)

### Training Data Requirements:
- **Facial Analysis**: 2000+ annotated images (hirsutism + acne)
- **Medical OCR**: 500+ diverse report formats
- **Risk Model**: 540+ clinical cases (Kaggle)

---

## 11. ✅ Next Steps

1. **Set up Azure OpenAI** and get API keys
2. **Generate test data** with NanoBanana (1000 medical reports)
3. **Train Custom Vision** for facial analysis
4. **Deploy ML model** for risk assessment
5. **Build backend endpoints** for each feature

Ready to start implementing! 🚀
