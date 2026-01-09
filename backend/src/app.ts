/**
 * Main Express Application
 * PCOD/PCOS Backend with Gemini AI
 */

import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { geminiService } from './services/gemini.service';
import { facialAnalysisService } from './services/facialAnalysis.service';
import { foodAnalysisService } from './services/foodAnalysis.service';
import { deepgramService } from './services/deepgram.service';
import { CHAT_SYSTEM_PROMPT } from './prompts/chat.prompt';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        // Log start of body for debugging (truncated)
        const bodyPreview = JSON.stringify(req.body).substring(0, 200);
        console.log(`   Body: ${bodyPreview}...`);
    }
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'PCOD/PCOS Backend', timestamp: new Date().toISOString() });
});

// Test Gemini endpoint
app.post('/api/test/gemini', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await geminiService.chat('You are a helpful PCOS medical assistant.', message);
        res.json({ success: true, response });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Facial analysis endpoint
app.post('/api/facial/analyze', async (req, res) => {
    console.log('[FACIAL] Request received, imageBase64 length:', req.body.imageBase64?.length || 0);
    try {
        const { imageBase64 } = req.body;

        if (!imageBase64) {
            console.log('[FACIAL] ERROR: No image provided');
            return res.status(400).json({ error: 'No image provided' });
        }

        console.log('[FACIAL] Calling facialAnalysisService...');
        const analysis = await facialAnalysisService.analyzeFacialFeatures(imageBase64);
        console.log('[FACIAL] Analysis complete, calculating score...');
        const pcosScore = facialAnalysisService.calculatePCOSFacialScore(analysis);

        console.log('[FACIAL] SUCCESS');
        res.json({
            success: true,
            analysis,
            pcosScore
        });
    } catch (error: any) {
        console.error('[FACIAL] ERROR:', error.message);
        console.error('[FACIAL] STACK:', error.stack);
        res.status(500).json({ error: error.message });
    }
});

// Food analysis endpoint (Metabolic Vision)
app.post('/api/food/analyze', async (req, res) => {
    console.log('[FOOD] Request received, imageBase64 length:', req.body.imageBase64?.length || 0);
    try {
        const { imageBase64 } = req.body;

        if (!imageBase64) {
            console.log('[FOOD] ERROR: No image provided');
            return res.status(400).json({ error: 'No image provided' });
        }

        console.log('[FOOD] Calling foodAnalysisService...');
        const analysis = await foodAnalysisService.analyzeFood(imageBase64);

        console.log('[FOOD] SUCCESS:', analysis.identification?.mainDish || 'unknown');
        res.json({
            success: true,
            analysis
        });
    } catch (error: any) {
        console.error('[FOOD] ERROR:', error.message);
        console.error('[FOOD] STACK:', error.stack);
        res.status(500).json({ error: error.message });
    }
});

// Speech-to-Text endpoint (Deepgram Nova-2)
app.post('/api/stt', async (req: any, res: any) => {
    console.log('📢 STT Request received');

    // Check Deepgram API key
    if (!process.env.DEEPGRAM_API_KEY) {
        console.error('❌ DEEPGRAM_API_KEY not set!');
        return res.status(500).json({ error: 'Deepgram API not configured' });
    }

    try {
        if (!req.file && !req.body.audio) {
            console.log('❌ No audio in request');
            return res.status(400).json({ error: 'No audio provided' });
        }

        // Handle both file upload (multer) or base64 body
        let audioBuffer: Buffer;
        if (req.file) {
            console.log('📁 Audio from file upload');
            audioBuffer = req.file.buffer;
        } else if (typeof req.body.audio === 'string') {
            console.log('📝 Audio from base64');
            const base64Audio = req.body.audio.replace(/^data:audio\/\w+;base64,/, "");
            audioBuffer = Buffer.from(base64Audio, 'base64');
        } else {
            console.log('❌ Invalid audio format');
            return res.status(400).json({ error: 'Invalid audio format' });
        }

        console.log(`🎤 Transcribing ${audioBuffer.length} bytes...`);
        const transcript = await deepgramService.transcribeAudio(audioBuffer);
        console.log(`✅ Transcript: "${transcript}"`);
        res.json({ success: true, transcript });
    } catch (error: any) {
        console.error('❌ STT Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Text-to-Speech endpoint (Deepgram Aura)
app.post('/api/tts', async (req, res) => {
    console.log('🔊 TTS Request received');

    // Check Deepgram API key
    if (!process.env.DEEPGRAM_API_KEY) {
        console.error('❌ DEEPGRAM_API_KEY not set!');
        return res.status(500).json({ error: 'Deepgram API not configured' });
    }

    try {
        const { text } = req.body;
        if (!text) {
            console.log('❌ No text provided');
            return res.status(400).json({ error: 'No text provided' });
        }

        console.log(`🎙️ Synthesizing: "${text.substring(0, 50)}..."`);
        const audioBuffer = await deepgramService.createEmpatheticResponse(text);
        console.log(`✅ Audio generated: ${audioBuffer.length} bytes`);

        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length
        });
        res.send(audioBuffer);
    } catch (error: any) {
        console.error('❌ TTS Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Chatbot endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, systemPrompt } = req.body;

        // Use the new enhanced system prompt by default, or allow override
        const prompt = systemPrompt || CHAT_SYSTEM_PROMPT;

        const response = await geminiService.chat(prompt, message);

        res.json({ success: true, response });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

export default app;
