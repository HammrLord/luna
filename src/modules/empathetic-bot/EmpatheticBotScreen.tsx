/**
 * Empathetic Bot Screen
 * 
 * AI companion for emotional support and mental health
 * Provides daily mood check-ins and supportive conversations
 * 
 * TODO: Implement:
 * - Empathetic conversation interface
 * - Mood tracking visualization
 * - Daily check-in reminders
 * - Crisis detection and resource recommendations
 * - Journaling prompts
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MOOD_OPTIONS = [
    { emoji: '😊', label: 'Great', value: 5 },
    { emoji: '🙂', label: 'Good', value: 4 },
    { emoji: '😐', label: 'Okay', value: 3 },
    { emoji: '😔', label: 'Low', value: 2 },
    { emoji: '😢', label: 'Struggling', value: 1 },
];

export const EmpatheticBotScreen: React.FC = () => {
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [showChat, setShowChat] = useState(false);

    const handleMoodSelection = async (moodValue: number) => {
        setSelectedMood(moodValue);

        // TODO: Save mood to Supabase
        // TODO: Start empathetic conversation based on mood

        setShowChat(true);
    };

    const startConversation = () => {
        setShowChat(true);
    };

    if (showChat) {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Your Emotional Companion 💜</Text>
                <View style={styles.placeholder}>
                    <Text>Chat interface coming soon...</Text>
                    <Text style={styles.note}>
                        This will be a supportive conversation space with AI
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setShowChat(false)}
                    >
                        <Text style={styles.buttonText}>Back to Mood Check-in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>How are you feeling today? 💜</Text>

            <View style={styles.moodContainer}>
                {MOOD_OPTIONS.map((mood) => (
                    <TouchableOpacity
                        key={mood.value}
                        style={[
                            styles.moodOption,
                            selectedMood === mood.value && styles.selectedMood
                        ]}
                        onPress={() => handleMoodSelection(mood.value)}
                    >
                        <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                        <Text style={styles.moodLabel}>{mood.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>💬 Talk to Your Companion</Text>
                <TouchableOpacity
                    style={styles.conversationButton}
                    onPress={startConversation}
                >
                    <Text style={styles.conversationButtonText}>
                        Start a Conversation
                    </Text>
                </TouchableOpacity>
                <Text style={styles.description}>
                    A safe space for emotional support, stress management, and mental wellness
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📊 Your Mood History</Text>
                <Text style={styles.placeholder}>Mood tracking graph coming soon...</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>✍️ Journaling Prompts</Text>
                <Text style={styles.placeholder}>Guided journaling coming soon...</Text>
            </View>

            <Text style={styles.footer}>
                🔒 Your conversations are private and never shared
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#8B5CF6',
    },
    moodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 32,
    },
    moodOption: {
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        backgroundColor: 'white',
        minWidth: 60,
    },
    selectedMood: {
        backgroundColor: '#E9D5FF',
        borderWidth: 2,
        borderColor: '#8B5CF6',
    },
    moodEmoji: {
        fontSize: 32,
        marginBottom: 4,
    },
    moodLabel: {
        fontSize: 12,
        color: '#666',
    },
    section: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    conversationButton: {
        backgroundColor: '#8B5CF6',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 8,
    },
    conversationButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    placeholder: {
        padding: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        alignItems: 'center',
    },
    note: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
    },
    button: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#8B5CF6',
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
    footer: {
        textAlign: 'center',
        color: '#666',
        fontSize: 12,
        marginTop: 16,
    },
});
