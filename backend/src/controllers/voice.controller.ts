/**
 * Voice Chat Controller
 * 
 * Handles real-time voice conversations using:
 * - Deepgram STT (speech-to-text)
 * - Azure OpenAI GPT-4 (conversation)
 * - Deepgram TTS (text-to-speech)
 */

import { Request, Response } from 'express';
import { deepgramService } from '../services/deepgram.service';
import { azureOpenAIService } from '../services/azureOpenAI.service';
import { MEDICAL_CHATBOT_PROMPT } from '../prompts/chatbot.prompt';

export class VoiceController {

    /**
     * Handle voice message (audio in, audio out)
     * POST /api/voice/conversation
     */
    async handleVoiceMessage(req: Request, res: Response) {
        try {
            const audioBuffer = req.file?.buffer;
            if (!audioBuffer) {
                return res.status(400).json({ error: 'No audio file provided' });
            }

            // Step 1: Speech-to-Text
            const userText = await deepgramService.transcribeAudio(audioBuffer);
            console.log('User said:', userText);

            // Step 2: Get AI response
            const aiResponse = await azureOpenAIService.chat(
                MEDICAL_CHATBOT_PROMPT,
                userText,
                { temperature: 0.7 }
            );
            console.log('AI response:', aiResponse);

            // Step 3: Text-to-Speech (empathetic voice)
            const audioResponse = await deepgramService.createEmpatheticResponse(aiResponse);

            // Step 4: Send audio back
            res.set({
                'Content-Type': 'audio/wav',
                'Content-Length': audioResponse.length
            });
            res.send(audioResponse);

        } catch (error) {
            console.error('Voice conversation error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Transcribe audio only (STT)
     * POST /api/voice/transcribe
     */
    async transcribe(req: Request, res: Response) {
        try {
            const audioBuffer = req.file?.buffer;
            if (!audioBuffer) {
                return res.status(400).json({ error: 'No audio file provided' });
            }

            const transcript = await deepgramService.transcribeAudio(audioBuffer);

            res.json({
                success: true,
                transcript
            });

        } catch (error) {
            console.error('Transcription error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Synthesize speech only (TTS)
     * POST /api/voice/synthesize
     */
    async synthesize(req: Request, res: Response) {
        try {
            const { text, type } = req.body;

            if (!text) {
                return res.status(400).json({ error: 'No text provided' });
            }

            let audioBuffer: Buffer;

            if (type === 'empathetic') {
                audioBuffer = await deepgramService.createEmpatheticResponse(text);
            } else {
                audioBuffer = await deepgramService.createMedicalResponse(text);
            }

            res.set({
                'Content-Type': 'audio/wav',
                'Content-Length': audioBuffer.length
            });
            res.send(audioBuffer);

        } catch (error) {
            console.error('Speech synthesis error:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

export const voiceController = new VoiceController();
