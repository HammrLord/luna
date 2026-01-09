/**
 * Chatbot Service
 * 
 * Service layer for AI chatbot interactions
 * Integrates with Azure OpenAI GPT-4
 * 
 * TODO: Implement:
 * - Integration with backend /api/chatbot endpoints
 * - Session management
 * - Message caching
 * - Context building from user profile
 */

import { supabase } from '../lib/supabaseClient';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatSession {
    id: string;
    agent_type: 'chatbot' | 'empathetic';
    session_title: string;
    messages: ChatMessage[];
}

export class ChatbotService {
    private static API_URL = process.env.API_BASE_URL || 'http://localhost:3000';

    /**
     * Create a new chat session
     */
    static async createSession(agentType: 'chatbot' | 'empathetic'): Promise<string> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('chat_sessions')
            .insert({
                user_id: user.id,
                agent_type: agentType,
                session_title: `${agentType} - ${new Date().toLocaleDateString()}`,
            })
            .select()
            .single();

        if (error) throw error;
        return data.id;
    }

    /**
     * Send a message to the chatbot
     */
    static async sendMessage(
        sessionId: string,
        message: string
    ): Promise<string> {
        // TODO: Call backend API
        // const response = await fetch(`${this.API_URL}/api/chatbot/message`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ sessionId, message }),
        // });

        // Save user message to Supabase
        await supabase
            .from('chat_messages')
            .insert({
                session_id: sessionId,
                role: 'user',
                content: message,
            });

        // Placeholder AI response
        const aiResponse = 'This is a placeholder response. Connect to Azure OpenAI backend.';

        // Save AI response
        await supabase
            .from('chat_messages')
            .insert({
                session_id: sessionId,
                role: 'assistant',
                content: aiResponse,
            });

        return aiResponse;
    }

    /**
     * Get chat history for a session
     */
    static async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
        const { data, error } = await supabase
            .from('chat_messages')
            .select('role, content')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data;
    }

    /**
     * Get user's recent sessions
     */
    static async getUserSessions(agentType?: 'chatbot' | 'empathetic'): Promise<ChatSession[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        let query = supabase
            .from('chat_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('last_message_at', { ascending: false });

        if (agentType) {
            query = query.eq('agent_type', agentType);
        }

        const { data, error } = await query.limit(10);
        if (error) throw error;

        return data as ChatSession[];
    }

    /**
     * Delete a chat session
     */
    static async deleteSession(sessionId: string): Promise<void> {
        const { error } = await supabase
            .from('chat_sessions')
            .delete()
            .eq('id', sessionId);

        if (error) throw error;
    }
}

export default ChatbotService;
