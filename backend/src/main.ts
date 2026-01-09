/**
 * Server Entry Point
 * Starts the Express server
 */

import * as path from 'path';
import * as dotenv from 'dotenv';

// Explicitly load .env from backend root with override
const envPath = path.resolve(__dirname, '../.env');
const result = dotenv.config({ path: envPath, override: true });

if (result.error) {
    console.warn('⚠️  Warning: .env file not found at:', envPath);
}

const apiKey = process.env.GEMINI_API_KEY;
console.log('🔒 Loaded Environment from:', envPath);
// Log first 4 and last 4 chars for security
console.log('🔑 Gemini API Key:', apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : '❌ NOT FOUND');

// Import app AFTER environment is configured to ensure all services access the correct keys
const app = require('./app').default;

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log('');
    console.log('🚀 PCOD/PCOS Backend Server Started!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log('');
    console.log('📋 Available Endpoints:');
    console.log(`   POST /api/test/gemini - Test Gemini API`);
    console.log(`   POST /api/facial/analyze - Analyze facial features`);
    console.log(`   POST /api/chat - Medical chatbot`);
    console.log(`   POST /api/stt - Speech-to-Text (Deepgram)`);
    console.log(`   POST /api/tts - Text-to-Speech (Deepgram)`);
    console.log('');
    console.log('✅ Gemini API: Configured');
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
