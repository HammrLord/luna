# Contributing to PCOD/PCOS Management App

Thank you for your interest in contributing to this project! This guide will help you get started.

## 🎯 Project Overview

This is a comprehensive health management application requiring collaboration across multiple domains:
- **Frontend (React Native)**
- **Backend (NestJS)**
- **Azure ML Services**
- **OCR Processing**
- **Database Design**

## 🔀 Git Workflow

### Branch Strategy

We use a feature-branch workflow:

```
main (production-ready code)
  ↓
develop (integration branch)
  ↓
feature/* (individual features)
```

### Branch Naming Convention

- `feature/module-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/what-changed` - Documentation updates
- `refactor/component-name` - Code refactoring

### Making Changes

1. **Create a new branch from `develop`**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Follow the code style guide below
   - Add comments for complex logic

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add blood report OCR extraction"
   ```

4. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Build process or auxiliary tool changes

## 📂 Module Ownership

Team members can work independently on these modules:

### Frontend Modules
- `src/modules/auth/` - Authentication screens
- `src/modules/onboarding/` - User onboarding flow
- `src/modules/labData/` - OCR and lab data upload
- `src/modules/healthSync/` - Health Connect integration
- `src/modules/diagnosis/` - Diagnostic results display
- `src/modules/digitalTwin/` - Simulator UI
- `src/modules/sentinel/` - Sentinel dashboard
- `src/modules/metabolicVision/` - Food scanning
- `src/modules/avatar/` - 3D avatar visualization
- `src/modules/community/` - Community insights

### Backend Modules
- `backend/src/modules/user/` - User management
- `backend/src/modules/health-data/` - Health data APIs
- `backend/src/modules/diagnostic/` - Diagnostic endpoints

### Services
- `azure-services/ocr/` - Document Intelligence
- `azure-services/models/` - ML models
- `src/services/` - Frontend service layer

## 💻 Code Style

### TypeScript/React Native

- Use **functional components** with hooks
- Use **TypeScript** for all files
- Follow **ESLint** rules (run `npm run lint`)
- Use **Prettier** for formatting

### File Structure

```typescript
// 1. Imports (external, then internal)
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { supabase } from '../../lib/supabaseClient';

// 2. Types/Interfaces
interface Props {
  userId: string;
}

// 3. Component
export const MyComponent: React.FC<Props> = ({ userId }) => {
  // Hooks
  const [data, setData] = useState(null);

  // Effects
  useEffect(() => {
    // ...
  }, []);

  // Handlers
  const handleAction = () => {
    // ...
  };

  // Render
  return (
    <View>
      <Text>Content</Text>
    </View>
  );
};

// 4. Styles
const styles = StyleSheet.create({
  // ...
});
```

### Python (Azure Services)

- Follow **PEP 8** style guide
- Use **type hints**
- Document functions with docstrings

## 🧪 Testing

Before submitting a PR:

1. **Test your changes**
   ```bash
   npm run android  # Test on Android
   ```

2. **Run linter**
   ```bash
   npm run lint
   ```

3. **Check TypeScript**
   ```bash
   npm run type-check
   ```

## 📝 Pull Request Process

1. **Update documentation** if needed
2. **Add description** of changes in PR
3. **Link related issues** if applicable
4. **Request review** from at least one team member
5. **Address review comments**
6. **Squash commits** before merging (if requested)

## 🤝 Code Review Guidelines

When reviewing PRs:

- ✅ Check for code quality and readability
- ✅ Verify TypeScript types are correct
- ✅ Ensure no sensitive data is exposed
- ✅ Test the feature if possible
- ✅ Provide constructive feedback

## 🔒 Security Guidelines

- **Never commit** API keys, secrets, or credentials
- Use **environment variables** for all sensitive data
- Follow **Supabase RLS** policies for data access
- Encrypt **medical data** at rest and in transit
- Test **authentication** flows thoroughly

## 📚 Resources

- [React Native Docs](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Azure Documentation](https://docs.microsoft.com/azure)

## 💬 Communication

- Use GitHub Issues for bug reports and feature requests
- Use Pull Request comments for code discussions
- Tag team members for specific reviews

## 🎉 Thank You!

Your contributions help make this app better for women's health. We appreciate your effort!
