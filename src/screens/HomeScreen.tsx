import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { LunaMascot } from '../components/LunaMascot';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useUser } from '../context/UserContext';
// ... items ...

export const HomeScreen = () => {
    const { userName, sentinelMode, toggleStressMode } = useUser();

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.date}>TODAY</Text>
                        <Text style={styles.greeting}>Good Morning, {userName}</Text>
                    </View>
                    <View style={styles.mascotContainer}>
                        <LunaMascot size="small" mode={sentinelMode} />
                    </View>
                </View>

                {/* The Breathing Sentinel */}
                <TouchableOpacity onPress={toggleStressMode} activeOpacity={0.9} style={styles.sentinelArea}>
                    <LunaMascot size="large" mode={sentinelMode} />
                    <Text style={styles.sentinelStatus}>
                        Hormonal Sentinel: <Text style={[styles.statusHighlight, sentinelMode === 'stressed' && { color: COLORS.sentinelStressed }]}>
                            {sentinelMode === 'stressed' ? 'Stress Detected' : 'Learning Quietly'}
                        </Text>
                    </Text>
                </TouchableOpacity>

                {/* Status Cards */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="moon" size={24} color="#2196F3" />
                        </View>
                        <Text style={styles.statLabel}>Sleep</Text>
                        <Text style={styles.statValue}>7h 12m</Text>
                        <Text style={styles.statSub}>+15% vs last week</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                            <Ionicons name="flame" size={24} color="#FF5252" />
                        </View>
                        <Text style={styles.statLabel}>Activity</Text>
                        <Text style={styles.statValue}>4,200</Text>
                        <Text style={styles.statSub}>Steps today</Text>
                    </View>
                </View>

                {/* Insight Card */}
                <TouchableOpacity style={styles.insightCard}>
                    <View style={styles.insightHeader}>
                        <Ionicons name="sparkles" size={20} color={COLORS.white} />
                        <Text style={styles.insightTitle}>Daily Insight</Text>
                    </View>
                    <Text style={styles.insightText}>
                        Your sleep regularity has improved by 15% this week. This stabilizes your cortisol levels.
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: SPACING.l,
        paddingBottom: 120, // Increased for floating tab bar
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    date: {
        fontSize: 12,
        color: COLORS.textLight,
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 4,
    },
    greeting: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    mascotContainer: {
        // Positioning context for the mascot
    },
    sentinelArea: {
        alignItems: 'center',
        marginVertical: SPACING.xl,
    },
    sentinelRingOuter: {
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: 'rgba(232, 93, 117, 0.05)', // Very faint pink ring
        justifyContent: 'center',
        alignItems: 'center',
    },
    sentinelRingInner: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(232, 93, 117, 0.1)', // Faint pink ring
        justifyContent: 'center',
        alignItems: 'center',
    },
    sentinelStatus: {
        marginTop: SPACING.l,
        fontSize: 16,
        color: COLORS.textLight,
    },
    statusHighlight: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.l,
        gap: SPACING.m,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.m,
        shadowColor: SHADOWS.soft.shadowColor,
        shadowOffset: SHADOWS.soft.shadowOffset,
        shadowOpacity: SHADOWS.soft.shadowOpacity,
        shadowRadius: SHADOWS.soft.shadowRadius,
        elevation: 3,
        alignItems: 'center',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    statLabel: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    statSub: {
        fontSize: 10,
        color: COLORS.textLight,
        marginTop: 2,
    },
    insightCard: {
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.l,
        padding: SPACING.l,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    insightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.s,
        gap: SPACING.s,
    },
    insightTitle: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    insightText: {
        color: COLORS.white,
        fontSize: 15,
        lineHeight: 22,
        opacity: 0.9,
    },
});
