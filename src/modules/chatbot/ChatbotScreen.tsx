/**
 * Chatbot Screen
 * 
 * AI chatbot for PCOD/PCOS information and guidance
 * Uses Azure OpenAI GPT-4 for conversations
 * 
 * TODO: Implement:
 * - Chat interface with message history
 * - Integration with backend chatbot API
 * - Quick action buttons for common questions
 * - Voice input support
 * - Context from user's health profile
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabaseClient';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export const ChatbotScreen: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
        // TODO: Load chat history from Supabase
        loadChatHistory();
    }, []);

    const loadChatHistory = async () => {
        // TODO: Fetch messages from chat_sessions and chat_messages tables
        console.log('Loading chat history...');
    };

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputText,
            timestamp: new Date(),
        };

        setMessages([...messages, userMessage]);
        setInputText('');
        setLoading(true);

        try {
            // TODO: Call backend API /api/chatbot/message
            // const response = await fetch('API_URL/chatbot/message', {
            //   method: 'POST',
            //   body: JSON.stringify({ message: inputText, sessionId }),
            // });

            // Placeholder AI response
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'This is a placeholder response. Connect to Azure OpenAI backend.',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        'What is PCOS?',
        'Diet tips for PCOD',
        'Exercise recommendations',
        'Understanding my symptoms',
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Health Assistant 🤖</Text>

            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageBubble,
                        item.role === 'user' ? styles.userMessage : styles.aiMessage
                    ]}>
                        <Text style={styles.messageText}>{item.content}</Text>
                    </View>
                )}
                style={styles.messageList}
            />

            {messages.length === 0 && (
                <View style={styles.quickActionsContainer}>
                    <Text style={styles.quickActionsTitle}>Quick Questions:</Text>
                    {quickActions.map((action, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.quickActionButton}
                            onPress={() => setInputText(action)}
                        >
                            <Text style={styles.quickActionText}>{action}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Ask me anything about PCOD/PCOS..."
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                />
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={sendMessage}
                    disabled={loading || !inputText.trim()}
                >
                    <Text style={styles.sendButtonText}>
                        {loading ? '...' : '→'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    messageList: {
        flex: 1,
        padding: 16,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
    },
    aiMessage: {
        alignSelf: 'flex-start',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    messageText: {
        fontSize: 16,
        color: '#333',
    },
    quickActionsContainer: {
        padding: 16,
    },
    quickActionsTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    quickActionButton: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    quickActionText: {
        fontSize: 14,
        color: '#007AFF',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        maxHeight: 100,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    sendButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
