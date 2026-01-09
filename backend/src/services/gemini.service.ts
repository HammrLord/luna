/**
 * Gemini AI Service
 * 
 * Handles all interactions with Google Gemini API
 * Supports both text (Gemini Pro) and vision (Gemini Vision) models
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private textModel: any;
    private visionModel: any;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY!;
        this.genAI = new GoogleGenerativeAI(apiKey);

        // Gemini 2.5 Flash for text
        this.textModel = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // Gemini 2.5 Flash for vision (supports multimodal)
        this.visionModel = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }

    /**
     * Analyze image with vision model
     */
    async analyzeImage(
        systemPrompt: string,
        userMessage: string,
        imageBase64: string,
        options: {
            temperature?: number;
        } = {}
    ): Promise<string> {
        try {
            const imagePart = {
                inlineData: {
                    data: imageBase64,
                    mimeType: 'image/jpeg'
                }
            };

            const prompt = `${systemPrompt}\n\n${userMessage}`;

            const result = await this.visionModel.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }, imagePart] }],
                generationConfig: {
                    temperature: options.temperature || 0.1,
                    maxOutputTokens: 2048
                }
            });

            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error('Gemini Vision Error:', error);
            throw new Error(`Failed to analyze image: ${error.message}`);
        }
    }

    /**
     * Chat with text model
     */
    async chat(
        systemPrompt: string,
        userMessage: string,
        options: {
            temperature?: number;
        } = {}
    ): Promise<string> {
        try {
            const prompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`;

            const result = await this.textModel.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: options.temperature || 0.3,
                    maxOutputTokens: 1024
                }
            });

            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error('Gemini Chat Error:', error);
            throw new Error(`Failed to generate response: ${error.message}`);
        }
    }

    /**
     * Streaming chat for real-time conversations
     */
    async *chatStream(
        systemPrompt: string,
        userMessage: string
    ): AsyncGenerator<string> {
        try {
            const prompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`;

            const result = await this.textModel.generateContentStream({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7
                }
            });

            for await (const chunk of result.stream) {
                const text = chunk.text();
                if (text) {
                    yield text;
                }
            }
        } catch (error: any) {
            console.error('Gemini Stream Error:', error);
            throw new Error(`Failed to stream response: ${error.message}`);
        }
    }

    /**
     * Extract JSON from response (handles markdown code blocks)
     */
    extractJSON(response: string): any {
        try {
            // cleanup markdown code blocks
            let clean = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            // cleanup unexpected tokens if Gemini adds text before/after
            const firstBrace = clean.indexOf('{');
            const lastBrace = clean.lastIndexOf('}');

            if (firstBrace !== -1 && lastBrace !== -1) {
                clean = clean.substring(firstBrace, lastBrace + 1);
            }

            return JSON.parse(clean);
        } catch (e) {
            console.error('Failed to parse Gemini JSON:', response);
            throw new Error(`Invalid JSON format from Gemini`);
        }
    }
}

export const geminiService = new GeminiService();
