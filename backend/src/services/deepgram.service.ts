/**
 * Deepgram Voice Service
 * 
 * Handles both Speech-to-Text (STT) and Text-to-Speech (TTS)
 * Using Deepgram Nova-2 for STT and Aura for TTS
 */

import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';

export class DeepgramService {
    private client;
    private apiKey: string;

    constructor() {
        this.apiKey = process.env.DEEPGRAM_API_KEY!;
        this.client = createClient(this.apiKey);
    }

    /**
     * Speech-to-Text (STT) - Real-time streaming
     * Uses Nova-2 model optimized for medical terminology
     */
    async transcribeAudio(audioBuffer: Buffer): Promise<string> {
        try {
            const { result, error } = await this.client.listen.prerecorded.transcribeFile(
                audioBuffer,
                {
                    model: 'nova-2',
                    smart_format: true,
                    punctuate: true,
                    language: 'en-IN',  // Indian English
                    keywords: [
                        'PCOS', 'PCOD', 'polycystic', 'ovarian', 'syndrome',
                        'hirsutism', 'acne', 'insulin', 'resistance', 'hormone',
                        'menstrual', 'cycle', 'ovulation', 'testosterone'
                    ],
                    keywords_boost_legacy: 'high'  // Boost medical terms
                }
            );

            if (error) throw error;

            const transcript = result.results.channels[0].alternatives[0].transcript;
            return transcript;
        } catch (error: any) {
            console.error('Deepgram STT Error:', error);
            throw new Error(`Failed to transcribe audio: ${error.message}`);
        }
    }

    /**
     * Speech-to-Text (STT) - WebSocket streaming for real-time
     */
    createLiveTranscription(
        onTranscript: (text: string) => void,
        onError: (error: Error) => void
    ) {
        const connection = this.client.listen.live({
            model: 'nova-2',
            language: 'en-IN',
            smart_format: true,
            interim_results: true,
            keywords: [
                'PCOS', 'PCOD', 'polycystic', 'hirsutism', 'insulin'
            ]
        });

        connection.on(LiveTranscriptionEvents.Open, () => {
            console.log('Deepgram connection opened');
        });

        connection.on(LiveTranscriptionEvents.Transcript, (data) => {
            const transcript = data.channel.alternatives[0].transcript;
            if (transcript && transcript.length > 0) {
                onTranscript(transcript);
            }
        });

        connection.on(LiveTranscriptionEvents.Error, (error) => {
            console.error('Deepgram live error:', error);
            onError(error);
        });

        return connection;
    }

    /**
     * Text-to-Speech (TTS) - Deepgram Aura
     * Returns audio buffer that can be streamed to client
     */
    async synthesizeSpeech(
        text: string,
        options: {
            voice?: string;
            speed?: number;
            encoding?: "linear16" | "mulaw" | "alaw" | "mp3" | "opus" | "flac" | "aac";
        } = {}
    ): Promise<Buffer> {
        try {
            const response = await this.client.speak.request(
                { text },
                {
                    model: options.voice || 'aura-luna-en',  // Calm, soothing voice
                    // @ts-ignore - speed might not be in the strict type yet but is valid API
                    speed: options.speed || 0.9  // Slower pace (0.9x) for better understanding
                }
            );

            // Get audio stream
            const stream = await response.getStream();
            if (!stream) throw new Error('No audio stream received');

            // Convert stream to buffer
            const chunks: Buffer[] = [];
            const reader = stream.getReader();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(Buffer.from(value));
            }

            return Buffer.concat(chunks);
        } catch (error: any) {
            console.error('Deepgram TTS Error:', error);
            throw new Error(`Failed to synthesize speech: ${error.message}`);
        }
    }

    /**
     * Available Deepgram Aura voices
     */
    static readonly VOICES = {
        // Female voices
        ASTERIA: 'aura-asteria-en',    // Warm, empathetic
        LUNA: 'aura-luna-en',          // Calm, soothing
        STELLA: 'aura-stella-en',      // Professional

        // Male voices
        ORION: 'aura-orion-en',        // Confident
        ARCAS: 'aura-arcas-en',        // Friendly

        // Multilingual
        ATHENA: 'aura-athena-en'       // Clear, neutral
    };

    /**
     * Create empathetic voice response for PCOS support
     */
    async createEmpatheticResponse(text: string): Promise<Buffer> {
        return this.synthesizeSpeech(text, {
            voice: DeepgramService.VOICES.LUNA,  // Calm, soothing voice for emotional support
            speed: 0.95  // Slightly slower for better comprehension
        });
    }

    /**
     * Create medical information voice response
     */
    async createMedicalResponse(text: string): Promise<Buffer> {
        return this.synthesizeSpeech(text, {
            voice: DeepgramService.VOICES.STELLA,  // Professional voice
            speed: 1.0
        });
    }
}

export const deepgramService = new DeepgramService();
