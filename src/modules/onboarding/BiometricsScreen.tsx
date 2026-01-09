/**
 * Biometrics Input Screen (Tier 1 Onboarding)
 * 
 * Collects basic health metrics: age, height, weight
 * Automatically calculates BMI
 * 
 * TODO: Implement:
 * - Form validation
 * - BMI calculation display
 * - Save to Supabase health_profiles table
 * - Navigation to next onboarding screen
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabaseClient';

export const BiometricsScreen: React.FC = () => {
    const [age, setAge] = useState('');
    const [height, setHeight] = useState(''); // cm
    const [weight, setWeight] = useState(''); // kg

    const calculateBMI = () => {
        const h = parseFloat(height) / 100;
        const w = parseFloat(weight);
        return (w / (h * h)).toFixed(2);
    };

    const handleSave = async () => {
        // TODO: Save to Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('health_profiles')
            .upsert({
                user_id: user.id,
                age: parseInt(age),
                height: parseFloat(height),
                weight: parseFloat(weight),
            });

        if (error) console.error('Error saving biometrics:', error);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Basic Health Information</Text>
            <TextInput
                style={styles.input}
                placeholder="Age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Height (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
            />
            {height && weight && (
                <Text style={styles.bmi}>BMI: {calculateBMI()}</Text>
            )}
            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
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
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    bmi: {
        fontSize: 18,
        marginTop: 10,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
