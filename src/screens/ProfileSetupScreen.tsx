import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

export const ProfileSetupScreen = () => {
    const navigation = useNavigation<any>();
    const [selectedAge, setSelectedAge] = useState<string | null>(null);
    const [selectedCycle, setSelectedCycle] = useState<string | null>(null);

    const handleFinish = () => {
        navigation.navigate('OnboardingCompletion');
    };

    const OptionPill = ({ label, selected, onPress }: { label: string, selected: boolean, onPress: () => void }) => (
        <TouchableOpacity
            style={[styles.pill, selected && styles.pillSelected]}
            onPress={onPress}
        >
            <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.headerTitle}>Quick Setup</Text>

                    <View style={styles.section}>
                        <Text style={styles.label}>Age Range</Text>
                        <View style={styles.pillRow}>
                            {['18-24', '25-30', '31-35', '35+'].map(opt => (
                                <OptionPill
                                    key={opt}
                                    label={opt}
                                    selected={selectedAge === opt}
                                    onPress={() => setSelectedAge(opt)}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Cycle Regularity</Text>
                        <View style={styles.pillRow}>
                            {['Regular', 'Irregular', 'Scanning...'].map(opt => (
                                <OptionPill
                                    key={opt}
                                    label={opt}
                                    selected={selectedCycle === opt}
                                    onPress={() => setSelectedCycle(opt)}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Primary Concern</Text>
                        <Text style={styles.helperText}>Select all that apply</Text>
                        <View style={styles.pillWrap}>
                            {['Acne', 'Weight Gain', 'Hair Loss', 'Fatigue', 'Mood'].map(opt => (
                                <OptionPill
                                    key={opt} label={opt} selected={false} onPress={() => { }}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Physical Markers (Private)</Text>
                        <Text style={styles.helperText}>Helps map phenotype</Text>
                        <View style={styles.pillWrap}>
                            {['Hirsutism', 'Dark Patches', 'None'].map(opt => (
                                <OptionPill
                                    key={opt} label={opt} selected={false} onPress={() => { }}
                                />
                            ))}
                        </View>
                    </View>
                </ScrollView>

                <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
                    <Text style={styles.buttonText}>Finish Setup</Text>
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SPACING.l,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginTop: SPACING.l,
        marginBottom: SPACING.xl,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textDark,
        marginBottom: SPACING.s,
    },
    helperText: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: SPACING.m,
    },
    pillRow: {
        flexDirection: 'row',
        gap: SPACING.s,
        marginBottom: SPACING.s,
    },
    pillWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.s,
    },
    pill: {
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.s,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
    },
    pillSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    pillText: {
        color: COLORS.textLight,
    },
    pillTextSelected: {
        color: COLORS.white,
        fontWeight: '600',
    },
    finishButton: {
        position: 'absolute',
        bottom: SPACING.l,
        left: SPACING.l,
        right: SPACING.l,
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.m,
        borderRadius: BORDER_RADIUS.circle,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        elevation: 4,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
