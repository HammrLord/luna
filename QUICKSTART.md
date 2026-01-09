# Quick Start Guide

## 🚀 Getting Started with Your PCOD/PCOS App

### ✅ What's Already Done

1. **Git Repository** - Initialized and committed
2. **React Native Project** - Expo with TypeScript
3. **Supabase Database** - 6 tables with Row Level Security
4. **Environment Configuration** - .env file created with Supabase credentials

### 📋 Immediate Next Steps

#### 1. Install Dependencies
```bash
npm install
```

This will install:
- React Native & Expo
- Supabase client
- Navigation libraries
- Redux Toolkit
- Health Connect SDK
- And more...

#### 2. Run the App
```bash
# Start the Metro bundler
npm start

# Or run directly on Android
npm run android
```

#### 3. Test Supabase Connection

The app is already configured to connect to your Supabase database. Test it by:

1. Open the app on Android
2. Try the signup/login screen (`src/modules/auth/AuthScreen.tsx`)
3. Create a test account

Your data will be automatically saved to Supabase with Row Level Security!

### 🔧 Configure Azure Services (When Ready)

Your `.env` file has placeholders for Azure services. You'll need to:

1. **Sign up for Azure for Students**: https://azure.microsoft.com/free/students/
2. **Create these resources**:
   - Document Intelligence (for OCR)
   - Computer Vision (for food scanning)
   - Machine Learning workspace
   - Blob Storage account

3. **Update .env** with your Azure credentials

See `ARCHITECTURE.md` for detailed Azure setup instructions.

### 👥 Team Development

Each team member should:

```bash
# Clone the repository
git clone <repository-url>
cd pcod_app

# Install dependencies
npm install

# The .env file is already created, no need to copy from example
# (It was set up by the setup script)

# Run the app
npm run android
```

### 📂 Where to Start Coding

Based on your role:

**Frontend Developers:**
- `src/modules/` - Feature screens (auth, onboarding, etc.)
- `src/components/` - Reusable UI components
- `src/navigation/` - App navigation setup

**Backend Developers:**
- `backend/src/` - NestJS API endpoints
- `supabase/migrations/` - Database changes

**ML/AI Team:**
- `azure-services/models/` - Machine learning models
- `azure-services/ocr/` - OCR processing scripts

**See `CONTRIBUTING.md` for Git workflow and code style guide**

### 🗄️ Database Access

View your Supabase database:
https://supabase.com/dashboard/project/bpbksoysihkzljsbxlap/editor

**Tables:**
- `health_profiles` - User biometrics
- `lab_results` - Blood test & ultrasound data
- `wearable_data` - Health Connect metrics
- `diagnostic_results` - PCOD/PCOS diagnoses
- `meal_logs` - Food scanning history
- `interventions` - Hormonal Sentinel recommendations

### 📚 Documentation

- `README.md` - Project overview
- `ARCHITECTURE.md` - Technical architecture
- `CONTRIBUTING.md` - Team collaboration guide
- `SUPABASE_SETUP.md` - Database setup details
- `walkthrough.md` (in brain folder) - Complete setup walkthrough

### 🎯 Current Implementation Status

**✅ Complete:**
- Project structure
- Database schema
- Authentication module
- Onboarding screens (biometrics, cycle tracking)
- Service layer architecture (OCR, diagnostics, etc.)

**⏳ In Progress:**
- Need to complete: Navigation setup, Redux store, UI components
- Need to integrate: Azure services, Health Connect

### 💡 Pro Tips

1. **Start with authentication**: Test login/signup first
2. **Use Supabase dashboard**: Monitor data in real-time
3. **Read ARCHITECTURE.md**: Understand the three-tier data flow
4. **Follow CONTRIBUTING.md**: Keep code consistent
5. **Use Azure free credits wisely**: Test locally when possible

### 🆘 Common Issues

**Issue**: Metro bundler won't start
```bash
npx expo start -c  # Clear cache
```

**Issue**: Android build fails
```bash
cd android && ./gradlew clean
cd .. && npm run android
```

**Issue**: Can't connect to Supabase
- Check .env file has correct URL and key
- Verify internet connection

### 🎉 You're Ready!

Your PCOD/PCOS app infrastructure is fully set up. Start building features and let the team collaborate on different modules!

For questions, check the documentation or open a GitHub issue.

**Happy coding! 💻**
