import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { LunaMascot } from '../components/LunaMascot';
import { COLORS, FONTS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

import { useUser } from '../context/UserContext';

// ... other imports

export const AnalysisScreen = () => {
    const { sentinelMode } = useUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Simulate analysis loading when screen mount or mode changes
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [sentinelMode]);

    if (loading) {
        return (
            <ScreenWrapper>
                <View style={styles.loadingContainer}>
                    <LunaMascot size="large" mode="analyzing" />
                    <Text style={styles.loadingText}>
                        {sentinelMode === 'stressed' ? 'Analyzing Stress Patterns...' : 'Verifying Metabolic Stability...'}
                    </Text>
                </View>
            </ScreenWrapper>
        );
    }

    const isStressed = sentinelMode === 'stressed';

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.header}>
                    <Text style={styles.headerTitle}>Metabolic Analysis</Text>
                    <Text style={styles.headerSubtitle}>Real-time Assessment</Text>
                </Animated.View>

                {/* Risk Phenotype Card */}
                <Animated.View entering={FadeInUp.delay(500).duration(800)} style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons
                            name={isStressed ? "medical" : "shield-checkmark"}
                            size={24}
                            color={isStressed ? COLORS.warning : COLORS.success}
                        />
                        <Text style={styles.cardTitle}>Primary Phenotype</Text>
                    </View>
                    <Text style={[styles.phenotypeText, { color: isStressed ? COLORS.primary : COLORS.success }]}>
                        {isStressed ? 'Insulin Resistant Type' : 'Metabolically Stable'}
                    </Text>
                    <Text style={styles.phenotypeDescription}>
                        {isStressed
                            ? "Your glucose response suggests mild insulin resistance. Focus on fiber-rich breakfasts."
                            : "Your patterns are within optimal ranges. Hormonal rhythm is balanced."}
                    </Text>
                    <View style={styles.tagContainer}>
                        <View style={[styles.tag, { backgroundColor: isStressed ? '#FFE5E9' : '#E6FFFA' }]}>
                            <Text style={[styles.tagText, { color: isStressed ? COLORS.primary : COLORS.success }]}>
                                {isStressed ? 'High Risk' : 'Optimal'}
                            </Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Counterfactual Insights */}
                <Animated.View entering={FadeInUp.delay(700).duration(800)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Insights</Text>
                    <View style={styles.insightCard}>
                        <Text style={styles.insightText}>
                            {isStressed ? (
                                <Text>
                                    If you hadn't slept well last night, your acne flare risk would be <Text style={{ fontWeight: 'bold', color: COLORS.error }}>+40%</Text> higher today.
                                </Text>
                            ) : (
                                <Text>
                                    Maintaining this sleep schedule reduces your cortisol spikes by <Text style={{ fontWeight: 'bold', color: COLORS.success }}>25%</Text>.
                                </Text>
                            )}
                        </Text>
                    </View>
                </Animated.View>

                {/* Drift Detection */}
                <Animated.View entering={FadeInUp.delay(900).duration(800)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Pattern Drift</Text>
                    <View style={styles.driftCard}>
                        <View style={styles.driftRow}>
                            <Text style={styles.driftLabel}>Cycle Regularity</Text>
                            <Text style={[styles.driftValue, { color: COLORS.success }]}>Stable</Text>
                        </View>
                        <View style={styles.driftRow}>
                            <Text style={styles.driftLabel}>Sleep Quality</Text>
                            <Text style={[styles.driftValue, { color: isStressed ? COLORS.warning : COLORS.success }]}>
                                {isStressed ? 'Declining' : 'Improving'}
                            </Text>
                        </View>
                    </View>
                </Animated.View>


                {/* Clinical Report Button */}
                <Animated.View entering={FadeInUp.delay(1100).duration(800)} style={{ marginTop: 20, marginBottom: 40 }}>
                    <TouchableOpacity style={styles.button}>
                        <Ionicons name="document-text-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.buttonText}>Generate Clinical PDF</Text>
                    </TouchableOpacity>
                </Animated.View>

            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 20,
        ...FONTS.body3,
        color: COLORS.text,
    },
    container: {
        padding: 20,
        paddingBottom: 120, // Increased to clear floating tab bar
    },
    header: {
        marginBottom: 30,
    },
    headerTitle: {
        ...FONTS.h1,
        color: COLORS.text,
    },
    headerSubtitle: {
        ...FONTS.body3,
        color: COLORS.gray,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        ...FONTS.h3,
        color: COLORS.text,
        marginLeft: 10,
    },
    phenotypeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 8,
    },
    phenotypeDescription: {
        ...FONTS.body3,
        color: COLORS.gray,
        marginBottom: 15,
        lineHeight: 22,
    },
    tagContainer: {
        flexDirection: 'row',
    },
    tag: {
        backgroundColor: '#FFE5E9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    tagText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 12,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        ...FONTS.h3,
        color: COLORS.text,
        marginBottom: 10,
    },
    insightCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    insightText: {
        ...FONTS.body3,
        color: COLORS.text,
        fontStyle: 'italic',
        lineHeight: 22,
    },
    driftCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
    },
    driftRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    driftLabel: {
        ...FONTS.body3,
        color: COLORS.gray,
    },
    driftValue: {
        ...FONTS.body3,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 30,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
