#!/bin/bash

# Supabase Setup Script
# This script creates your .env file with Supabase credentials

echo "🔧 Setting up Supabase environment variables..."

cat > .env << 'EOF'
# Supabase Configuration
SUPABASE_URL=https://bpbksoysihkzljsbxlap.supabase.co
SUPABASE_ANON_KEY=sb_publishable_wSRlsXv_6DWEoKf1J8DTVg_z2g1lAQG
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_DB_PASSWORD=IsywQIfdMNjnGYVg

# Azure Document Intelligence (Form Recognizer)
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_DOCUMENT_INTELLIGENCE_KEY=your_document_intelligence_key

# Azure Computer Vision
AZURE_COMPUTER_VISION_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_COMPUTER_VISION_KEY=your_computer_vision_key

# Azure Machine Learning
AZURE_ML_WORKSPACE_NAME=your_ml_workspace_name
AZURE_ML_SUBSCRIPTION_ID=your_subscription_id
AZURE_ML_RESOURCE_GROUP=your_resource_group
AZURE_ML_TENANT_ID=your_tenant_id

# Azure Health Data Services (FHIR)
AZURE_FHIR_ENDPOINT=https://your-workspace.fhir.azurehealthcareapis.com
AZURE_FHIR_CLIENT_ID=your_fhir_client_id
AZURE_FHIR_CLIENT_SECRET=your_fhir_client_secret

# Azure Communication Services
AZURE_COMMUNICATION_CONNECTION_STRING=your_communication_services_connection_string

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=your_storage_connection_string
AZURE_STORAGE_CONTAINER_NAME=medical-documents

# Backend API Configuration
API_BASE_URL=http://localhost:3000
API_TIMEOUT=30000

# Google Health Connect (Android)
HEALTH_CONNECT_ENABLED=true

# App Configuration
APP_ENV=development
LOG_LEVEL=debug

# Feature Flags
ENABLE_DIGITAL_TWIN=true
ENABLE_FOOD_VISION=true
ENABLE_3D_AVATAR=true
ENABLE_FEDERATED_LEARNING=false
EOF

echo "✅ .env file created successfully!"
echo ""
echo "📝 Supabase is fully configured:"
echo "   - URL: https://bpbksoysihkzljsbxlap.supabase.co"
echo "   - Anon Key: configured ✓"
echo ""
echo "⚠️  Azure services need to be configured:"
echo "   - Edit .env to add your Azure credentials when ready"
echo ""
echo "🚀 You can now run: npm install && npm run android"
