/**
 * Cycle Tracking Screen (Tier 1 Onboarding)
 * 
 * Collects menstrual cycle information
 * 
 * TODO: Implement:
 * - Cycle regularity selection (dropdown)
 * - Average cycle duration input
 * - Calendar-based last period tracking
 * - Save to health_profiles table
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const CycleTrackingScreen: React.FC = () => {
    const [regularity, setRegularity] = useState<string>('');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Menstrual Cycle Information</Text>
            <Text style={styles.subtitle}>How regular is your cycle?</Text>

            {['regular', 'irregular', 'very_irregular'].map((option) => (
                <TouchableOpacity
                    key={option}
                    style={[
                        styles.option,
                        regularity === option && styles.selectedOption
                    ]}
                    onPress={() => setRegularity(option)}
                >
                    <Text style={styles.optionText}>
                        {option.replace('_', ' ').toUpperCase()}
                    </Text>
                </TouchableOpacity>
            ))}

            <Text style={styles.note}>
                ℹ️ This information helps us provide personalized recommendations
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
        color: '#666',
    },
    option: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 10,
    },
    selectedOption: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    optionText: {
        fontSize: 16,
        textAlign: 'center',
    },
    note: {
        marginTop: 20,
        color: '#666',
        fontStyle: 'italic',
    },
});
