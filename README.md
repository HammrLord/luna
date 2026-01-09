# PCOD/PCOS Management App

A comprehensive React Native mobile application for PCOD and PCOS diagnosis, monitoring, and personalized treatment through AI-powered insights and multi-tier data aggregation.

## 🎯 Project Overview

This app provides:
- **Three-Tier Data Collection**: Onboarding, Lab/Clinical (OCR), and Passive Health Streams
- **AI Diagnostic Engine**: PCOD vs PCOS differentiation with phenotype classification
- **Digital Twin Simulator**: Predictive "what-if" modeling for lifestyle changes
- **Hormonal Sentinel**: Proactive monitoring and intervention system
- **Metabolic Vision**: Computer vision-based food scanning
- **Privacy-First Community**: Federated learning for anonymized insights

## 🏗️ Tech Stack

- **Mobile**: React Native (Expo) with TypeScript
- **Backend**: Node.js/NestJS hosted on Azure App Service
- **Database**: Supabase (PostgreSQL + Auth + Real-time + Storage)
- **Cloud Services**: Microsoft Azure ecosystem
  - Azure Document Intelligence (OCR)
  - Azure Computer Vision (Food scanning)
  - Azure Machine Learning (Diagnostics)
  - Azure Health Data Services (FHIR API)
  - Azure Blob Storage
- **State Management**: Redux Toolkit
- **Health Integration**: Google Health Connect (Android)

## 📁 Project Structure

```
pcod_app/
├── src/                          # React Native source code
│   ├── modules/                  # Feature modules
│   │   ├── auth/                # Authentication
│   │   ├── onboarding/          # Tier 1: User onboarding
│   │   ├── labData/             # Tier 2: OCR & clinical data
│   │   ├── healthSync/          # Tier 3: Wearable integration
│   │   ├── diagnosis/           # AI diagnostic results
│   │   ├── digitalTwin/         # Lifestyle simulator
│   │   ├── sentinel/            # Hormonal sentinel agent
│   │   ├── hormonalNudges/      # Cycle-aware recommendations
│   │   ├── metabolicVision/     # Food scanning
│   │   ├── avatar/              # 3D health visualization
│   │   ├── community/           # Privacy-preserving insights
│   │   └── reports/             # Practitioner reports
│   ├── services/                # API services
│   ├── store/                   # Redux state management
│   ├── navigation/              # Navigation configuration
│   ├── components/              # Shared UI components
│   ├── types/                   # TypeScript types
│   └── lib/                     # Utilities & config
├── backend/                     # NestJS backend API
│   └── src/
│       ├── modules/             # API modules
│       └── config/              # Configuration
├── azure-services/              # Azure ML & OCR services
│   ├── ocr/                     # Document Intelligence
│   ├── models/                  # ML models
│   └── fhir/                    # Health Data Services
├── supabase/                    # Database schema & migrations
│   └── migrations/
└── docs/                        # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI
- Android Studio (for Android development)
- Azure account with student credits
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pcod_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Run the app**
   ```bash
   npm run android
   ```

### Backend Setup

1. **Navigate to backend**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Add Supabase and Azure credentials
   ```

3. **Run backend**
   ```bash
   npm run start:dev
   ```

### Azure Services Setup

1. **Document Intelligence**: Create Azure Document Intelligence resource
2. **Computer Vision**: Create Azure Computer Vision resource
3. **Machine Learning**: Set up Azure ML workspace
4. **App Service**: Deploy backend to Azure App Service

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed setup instructions.

## 📚 Documentation

- [Architecture Overview](./ARCHITECTURE.md) - System design and data flow
- [API Documentation](./docs/API.md) - Backend API reference
- [Contributing Guidelines](./CONTRIBUTING.md) - How to contribute
- [Testing Guide](./docs/TESTING.md) - Testing strategies

## 🔐 Privacy & Compliance

- End-to-end encryption for medical data
- Row Level Security (RLS) in Supabase
- HIPAA/GDPR compliance through Azure services
- Federated learning for privacy-preserving insights
- User consent management

## 🎨 Features Roadmap

### Phase 1: MVP (Current)
- [ ] User authentication and onboarding
- [ ] Basic health profile creation
- [ ] OCR for blood reports
- [ ] Simple diagnostic classification

### Phase 2: AI Enhancement
- [ ] Digital Twin simulator
- [ ] Hormonal Sentinel agent
- [ ] Predictive nudges by cycle phase

### Phase 3: Advanced Features
- [ ] Food scanning with Computer Vision
- [ ] 3D avatar visualization
- [ ] Federated learning insights
- [ ] Practitioner report generation

## 👥 Team Collaboration

Each team member can work on different modules independently:

- **Frontend Team**: Work on modules in `src/modules/`
- **Backend Team**: Develop APIs in `backend/src/modules/`
- **ML Team**: Build models in `azure-services/models/`
- **OCR Team**: Implement Document Intelligence in `azure-services/ocr/`

See [CONTRIBUTING.md](./CONTRIBUTING.md) for branching strategy and workflow.

## 📄 License

This project is for educational and research purposes.

## 🤝 Support

For questions or issues, please open a GitHub issue or contact the team.

---

**Built with ❤️ for women's health**
