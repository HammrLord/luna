# PCOD/PCOS Management App - Technical Architecture

## System Overview

This document describes the technical architecture of the PCOD/PCOS Management App, a comprehensive health management platform leveraging AI, cloud services, and privacy-preserving technologies.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile App (React Native)                │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Tier 1       │  │ Tier 2       │  │ Tier 3       │       │
│  │ Onboarding   │  │ Lab Data/OCR │  │ Health       │       │
│  │              │  │              │  │ Connect      │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                 │                │
│         └─────────────────┼─────────────────┘                │
│                           │                                  │
│                  ┌────────▼─────────┐                        │
│                  │  Redux Store     │                        │
│                  │  (State Mgmt)    │                        │
│                  └────────┬─────────┘                        │
└───────────────────────────┼──────────────────────────────────┘
                            │
           ┌────────────────┼────────────────┐
           │                │                │
    ┌──────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐
    │  Supabase   │  │   Backend   │  │   Azure    │
    │  (Database, │  │   NestJS    │  │  Services  │
    │   Auth,     │  │   API       │  │            │
    │   Storage)  │  │   Gateway   │  │            │
    └─────────────┘  └──────┬──────┘  └─────┬──────┘
                            │                │
                     ┌──────▼────────────────▼──────┐
                     │   Azure Cloud Ecosystem      │
                     │                              │
                     │  • Document Intelligence     │
                     │  • Computer Vision           │
                     │  • Machine Learning          │
                     │  • Health Data Services      │
                     │  • Blob Storage              │
                     │  • Functions                 │
                     └──────────────────────────────┘
```

## Three-Tier Data Architecture

### Tier 1: Static Onboarding Data
**Purpose**: Collect baseline health information during user registration

**Data Collected**:
- Biometrics: Age, Height, Weight → Auto-calculated BMI
- Menstrual Cycle: Regularity, average duration
- Physical Markers: Self-reported acne, hirsutism, Acanthosis Nigricans

**Storage**: `health_profiles` table in Supabase

**Implementation**:
- React Native forms with validation
- Direct save to Supabase with Row Level Security (RLS)

### Tier 2: Lab & Clinical Data (Verified)
**Purpose**: Extract medical data from uploaded documents via OCR

**Data Sources**:
- Blood test reports (PDF/Image)
- Ultrasound summaries (PDF/Image)

**Extracted Metrics**:
- **Hormonal**: Free Testosterone, LH, FSH, AMH
- **Imaging**: Follicle count, Endometrium thickness

**Technology Flow**:
1. User uploads document (Camera/Gallery) → `expo-image-picker`
2. Upload to Azure Blob Storage
3. Process with **Azure Document Intelligence**
4. Extract key-value pairs using custom extraction models
5. Parse hormonal values with confidence scoring
6. Save to `lab_results` table in Supabase

**Implementation Files**:
- `src/modules/labData/BloodReportUploadScreen.tsx`
- `src/services/ocrService.ts`
- `azure-services/ocr/blood_report_extractor.py`

### Tier 3: Passive Health Streams
**Purpose**: Continuous health monitoring from wearables

**Data Sources**:
- Google Health Connect (Android)

**Metrics Collected**:
- Basal Body Temperature (BBT)
- Heart Rate Variability (HRV)
- Sleep quality and duration
- Steps and activity levels

**Technology**:
- Background sync service using `react-native-health-connect`
- Time-series storage in `wearable_data` table
- Indexed by user_id and timestamp for efficient querying

**Implementation**:
- `src/modules/healthSync/HealthConnectIntegration.ts`

## AI Services Architecture

### 1. Diagnostic Support Service

**Purpose**: PCOD vs PCOS differentiation and phenotype classification

**Input Data**:
- All Tier 1, 2, and 3 data
- Calculated BMI
- Hormonal ratios (LH/FSH, AMH levels)

**Classification Logic**:
```
IF (follicle_count >= 12) AND (LH/FSH > 2 OR free_testosterone > 45):
  → PCOS
  
  Phenotype Classification:
  - IF BMI > 25 AND HRV < 50  → Insulin Resistant
  - IF acne OR hirsutism       → Inflammatory
  - ELSE                       → General PCOS

ELSE IF (follicle_count >= 12):
  → PCOD

ELSE:
  → NORMAL
```

**Azure ML Integration**:
- Trained XGBoost model hosted on Azure ML
- REST API endpoint for real-time predictions
- Confidence scoring for all classifications

**Output**:
- Condition: PCOD | PCOS | NORMAL
- Phenotype: insulin_resistant | inflammatory | adrenal | post_pill
- Confidence score (0-1)
- Personalized recommendations array
- Risk factors list

**Implementation**: `src/services/diagnosticService.ts`

### 2. Digital Twin Simulator

**Purpose**: Predictive modeling for lifestyle interventions

**Scenarios Supported**:
- Sugar reduction (% decrease)
- Exercise regimen (minutes/week)
- Sleep improvement (hours/night)
- Stress management (low/medium/high)

**Prediction Outputs**:
- Insulin sensitivity change
- Ovulation likelihood (%)
- Weight change (kg)
- Hormonal balance predictions
- Timeline visualization (30/60/90 days)

**ML Model**:
- Time-series prediction using LSTM
- Trained on clinical research data
- Personalized to user's phenotype

**Implementation**: `src/services/digitalTwinService.ts`

### 3. Hormonal Sentinel Agent

**Purpose**: Proactive real-time monitoring and intervention

**Monitoring Logic**:
```python
IF stress == 'high' AND sleep_hours < 6:
  → Trigger: Diet intervention (magnesium-rich foods)
  → Trigger: Exercise adjustment (replace HIIT with walking)

IF HRV < 40:
  → Trigger: Stress management (breathing exercises)

IF sleep_quality < 60:
  → Trigger: Sleep hygiene recommendations
```

**Implementation**:
- Background service running every 6 hours
- Analyzes latest wearable data
- Generates interventions stored in `interventions` table
- Sends push notifications for high-priority alerts

**Implementation**: `src/services/hormonalSentinelService.ts`

### 4. Metabolic Vision (Food Scanning)

**Purpose**: Real-time meal analysis using computer vision

**Technology Flow**:
1. User takes food photo
2. **Azure Computer Vision** detects food items
3. Match foods to glycemic index database
4. Calculate total glycemic load
5. Assess metabolic impact (low/medium/high)
6. Generate personalized bio-hack recommendations

**Special Features**:
- HRV-based insulin sensitivity detection
- Eating order optimization: "Eat fiber first, then protein, then carbs"
- Phenotype-specific warnings for insulin-resistant users

**Implementation**: `src/services/foodVisionService.ts`

## Database Schema (Supabase)

### Row Level Security (RLS) Policies

All tables have RLS enabled with policies:
```sql
CREATE POLICY "Users can view their own data"
  ON table_name FOR SELECT
  USING (auth.uid() = user_id);
```

### Key Tables

**health_profiles**
- One-to-one with `auth.users`
- Stores Tier 1 onboarding data
- Auto-calculates BMI via generated column

**lab_results**
- One-to-many with users
- Stores OCR-extracted hormonal data
- Includes confidence scores for verification

**wearable_data**
- Time-series data from Health Connect
- Indexed on (user_id, recorded_at) for fast queries
- Supports multiple data types (BBT, HRV, sleep, etc.)

**diagnostic_results**
- Stores AI diagnostic outputs
- Includes JSONB recommendations for flexibility

**meal_logs**
- Food scanning history
- JSONB array of detected foods
- Glycemic load calculations

**interventions**
- Hormonal Sentinel recommendations
- Status tracking (pending/viewed/applied/dismissed)

### Migration Strategy

- SQL migrations in `supabase/migrations/`
- Version-controlled schema changes
- Local development with Supabase CLI

## Azure Services Integration

### Document Intelligence (Form Recognizer)

**Use Case**: Extract structured data from medical documents

**Custom Models**:
1. **Blood Test Model**
   - Key-value pairs: Testosterone, LH, FSH, AMH
   - Unit extraction and normalization
   - Date of test

2. **Ultrasound Model**
   - Follicle count extraction
   - Endometrium thickness measurement
   - Ovarian volume (future)

**API Endpoint**: `https://<resource>.cognitiveservices.azure.com/formrecognizer/v3.0/custom/analyze`

### Computer Vision

**Use Case**: Food recognition and meal analysis

**API Capabilities**:
- Object detection for food items
- Image tagging with confidence scores
- Custom trained model for regional Indian foods

**Endpoint**: `https://<resource>.cognitiveservices.azure.com/vision/v3.2/analyze`

### Machine Learning

**Hosted Models**:
1. **PCOD/PCOS Classifier** (XGBoost)
   - Input: 15+ features from all tiers
   - Output: Multi-class prediction with confidence

2. **Digital Twin Predictor** (LSTM)
   - Input: Lifestyle scenario parameters
   - Output: Time-series health predictions

3. **Cycle Phase Predictor** (XGBoost)
   - Input: Hormonal data + wearable metrics
   - Output: Follicular/Luteal phase with exercise recommendations

**Deployment**: Azure ML Managed Endpoints

### Health Data Services (FHIR API)

**Purpose**: Standardized health data storage for interoperability

**FHIR Resources Used**:
- `Patient`: User demographics
- `Observation`: Lab results, vital signs
- `DiagnosticReport`: Complete diagnostic summaries
- `Condition`: PCOD/PCOS diagnosis

**Future Use Cases**:
- Export data for healthcare providers
- Integration with electronic health records (EHRs)
- Data portability compliance (GDPR)

## Privacy & Security

### Data Encryption
- **At Rest**: Supabase encrypts all data with AES-256
- **In Transit**: TLS 1.3 for all API calls
- **Client-Side**: Sensitive data hashed before storage

### Authentication
- Supabase Auth with JWT tokens
- OAuth 2.0 for social login (Google)
- Secure session management with AsyncStorage

### Compliance
- **HIPAA**: Azure Health Data Services certified
- **GDPR**: User data export and deletion capabilities
- **Row Level Security**: PostgreSQL RLS ensures data isolation

### Federated Learning (Future)

**Purpose**: Privacy-preserving community insights

**Implementation**:
- On-device model training
- Only model weights uploaded (no raw data)
- Differential privacy techniques
- Aggregated insights: "85% of users with your profile improved with X"

## Development Setup

### Prerequisites
```bash
# Node.js and npm
node -v  # v18+

# Expo CLI
npm install -g expo-cli

# Supabase CLI
npm install -g supabase

# Azure CLI (for services)
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### Environment Configuration
```bash
# Copy template
cp .env.example .env

# Required variables:
SUPABASE_URL=<your-project-url>
SUPABASE_ANON_KEY=<your-anon-key>
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=<endpoint>
AZURE_DOCUMENT_INTELLIGENCE_KEY=<key>
# ... (see .env.example for full list)
```

### Running the App
```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android
npm run android
```

### Backend Setup
```bash
cd backend
npm install
npm run start:dev
```

## Testing Strategy

### Unit Tests
- Jest for service layer testing
- React Native Testing Library for components

### Integration Tests
- Supabase local environment
- Azure service mocks

### E2E Tests
- Detox for critical user flows
- OCR accuracy validation

## Deployment

### Mobile App
- **Android**: Google Play Store via Expo Application Services (EAS)

### Backend
- **Azure App Service**: Docker container deployment
- **CI/CD**: GitHub Actions

### Database
- **Supabase**: Managed PostgreSQL (Production tier)

## Performance Considerations

### Optimization Strategies
1. **Caching**: Cache OCR results to avoid re-processing
2. **Image Compression**: Reduce upload sizes before OCR
3. **Lazy Loading**: Load dashboard data on-demand
4. **Background Sync**: Batch wearable data uploads

### Monitoring
- Azure Application Insights for API monitoring
- Supabase Dashboard for database metrics
- Expo Analytics for mobile app usage

## Future Enhancements

1. **3D Avatar Visualization**: Three.js/React Native Skia for metabolic health visualization
2. **Cycle Prediction**: LSTM for period forecasting
3. **Medication Tracking**: Reminders and adherence monitoring
4. **Telehealth Integration**: Azure Communication Services for video consultations
5. **Multi-language Support**: i18n for regional languages
6. **iOS Support**: HealthKit integration

---

**Last Updated**: January 2026  
**Maintainers**: Development Team
