# Supabase Configuration Guide

## Your Supabase Project Details

**Project URL**: https://bpbksoysihkzljsbxlap.supabase.co
**Database Password**: IsywQIfdMNjnGYVg

## Getting Your API Keys

To get your Supabase API keys:

1. Go to: https://supabase.com/dashboard/project/bpbksoysihkzljsbxlap/settings/api

2. Copy the following keys:
   - **anon/public key** - This is safe to use in your React Native app
   - **service_role key** - Keep this secret! Only use in backend

## Updating Your .env File

Since `.env` is gitignored (for security), you need to create it manually:

```bash
# In your project root, create .env file
cp .env.example .env
```

Then update these values in `.env`:

```bash
SUPABASE_URL=https://bpbksoysihkzljsbxlap.supabase.co
SUPABASE_ANON_KEY=<your-anon-key-from-dashboard>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key-from-dashboard>
SUPABASE_DB_PASSWORD=IsywQIfdMNjnGYVg
```

## Database Tables Created ✅

The following tables are now set up in your Supabase database:

1. **health_profiles** - User biometrics and onboarding data
2. **lab_results** - OCR-extracted hormonal markers
3. **wearable_data** - Health Connect metrics (time-series)
4. **diagnostic_results** - PCOD/PCOS classifications
5. **meal_logs** - Food scanning history
6. **interventions** - Hormonal Sentinel recommendations

All tables have **Row Level Security (RLS)** enabled!

## Viewing Your Database

You can view your tables in the Supabase dashboard:
https://supabase.com/dashboard/project/bpbksoysihkzljsbxlap/editor

## Testing the Connection

Once you have your anon key, test the connection:

```bash
cd pcod_app
npm install
npm run android
```

The app should be able to connect to Supabase for authentication and data storage!

## Next Steps

1. ✅ Database schema is set up
2. ⏳ Get your API keys from dashboard
3. ⏳ Update .env file
4. ⏳ Set up Azure services (when ready)
5. ⏳ Start development!
