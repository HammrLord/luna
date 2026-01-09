import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { LunaMascot } from '../components/LunaMascot';
import { IllustrationHeader } from '../components/IllustrationHeader';
import { COLORS, FONTS, SHADOWS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

export const CommunityScreen = () => {
    const [activeTab, setActiveTab] = useState<'tribe' | 'forums' | 'victories'>('forums');

    const renderTabContent = () => {
        if (activeTab === 'tribe') {
            return (
                <Animated.View entering={FadeInUp.duration(600)}>
                    <View style={styles.emptyStateContainer}>
                        <LunaMascot size="medium" mode="idle" />
                        <Text style={styles.emptyStateText}>
                            "Searching for your perfect tribe match based on your 'Insulin Resistant' pattern..."
                        </Text>
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.sectionHeader}>Why Tribes?</Text>
                        <Text style={styles.infoText}>
                            Luna matches you with a small group of women who share your specific metabolic phenotype.
                            Share recipes, sleep tips, and encouragement without the noise.
                        </Text>
                    </View>
                </Animated.View>
            );
        } else if (activeTab === 'forums') {
            return (
                <Animated.View entering={FadeInUp.duration(600)}>
                    <TouchableOpacity style={styles.forumCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                            <MaterialCommunityIcons name="food-apple-outline" size={24} color="#2196F3" />
                        </View>
                        <View style={styles.forumContent}>
                            <Text style={styles.forumTitle}>Diet & Nutrition</Text>
                            <Text style={styles.forumSubtitle}>1.2k members • "Breakfast ideas for insulin resistance?"</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forumCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                            <MaterialCommunityIcons name="yoga" size={24} color="#4CAF50" />
                        </View>
                        <View style={styles.forumContent}>
                            <Text style={styles.forumTitle}>Stress Management</Text>
                            <Text style={styles.forumSubtitle}>850 members • "My evening routine for cortisol control"</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forumCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                            <MaterialCommunityIcons name="medical-bag" size={24} color="#FF9800" />
                        </View>
                        <View style={styles.forumContent}>
                            <Text style={styles.forumTitle}>Supplement Reviews</Text>
                            <Text style={styles.forumSubtitle}>500 members • "Ovasitol experiences?"</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
                    </TouchableOpacity>
                </Animated.View>
            );
        } else {
            return (
                <Animated.View entering={FadeInUp.duration(600)}>
                    <View style={styles.victoryCard}>
                        <View style={styles.victoryHeader}>
                            <View style={styles.avatarPlaceholder}><Text style={styles.avatarText}>S</Text></View>
                            <View>
                                <Text style={styles.victoryUser}>Sarah M.</Text>
                                <Text style={styles.victoryBadge}>Cured • 6 months symptom free</Text>
                            </View>
                        </View>
                        <Text style={styles.victoryBody}>
                            "I didn't believe it at first, but aligning my workouts to my cycle changed everything. My acne cleared up in 3 months!"
                        </Text>
                        <View style={styles.reactionRow}>
                            <Ionicons name="heart" size={16} color={COLORS.primary} />
                            <Text style={styles.reactionCount}>245 likes</Text>
                        </View>
                    </View>

                    <View style={styles.victoryCard}>
                        <View style={styles.victoryHeader}>
                            <View style={[styles.avatarPlaceholder, { backgroundColor: '#E1BEE7' }]}><Text style={styles.avatarText}>J</Text></View>
                            <View>
                                <Text style={styles.victoryUser}>Jessica K.</Text>
                                <Text style={styles.victoryBadge}>Managing • Adrenal Type</Text>
                            </View>
                        </View>
                        <Text style={styles.victoryBody}>
                            "Sleep was the missing piece. Once I fixed my circadian rhythm, the weight started dropping off naturally."
                        </Text>
                        <View style={styles.reactionRow}>
                            <Ionicons name="heart" size={16} color={COLORS.primary} />
                            <Text style={styles.reactionCount}>120 likes</Text>
                        </View>
                    </View>
                </Animated.View>
            );
        }
    };

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <IllustrationHeader height={200} />

                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Community Hub</Text>

                    {/* Tabs */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'forums' && styles.activeTab]}
                            onPress={() => setActiveTab('forums')}
                        >
                            <Text style={[styles.tabText, activeTab === 'forums' && styles.activeTabText]}>Forums</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'victories' && styles.activeTab]}
                            onPress={() => setActiveTab('victories')}
                        >
                            <Text style={[styles.tabText, activeTab === 'victories' && styles.activeTabText]}>Victories</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'tribe' && styles.activeTab]}
                            onPress={() => setActiveTab('tribe')}
                        >
                            <Text style={[styles.tabText, activeTab === 'tribe' && styles.activeTabText]}>My Tribe</Text>
                        </TouchableOpacity>
                    </View>

                    {renderTabContent()}

                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 120, // Increased for floating tab bar
    },
    contentContainer: {
        padding: 24,
        marginTop: -30,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        minHeight: 500,
    },
    title: {
        ...FONTS.h1,
        color: COLORS.text,
        marginBottom: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: COLORS.white,
        ...SHADOWS.soft,
    },
    tabText: {
        ...FONTS.body3,
        color: COLORS.textLight,
        fontWeight: '600',
    },
    activeTabText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    // Forum Styles
    forumCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        ...SHADOWS.soft,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    forumContent: {
        flex: 1,
    },
    forumTitle: {
        ...FONTS.body1,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    forumSubtitle: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    // Victory Styles
    victoryCard: {
        padding: 20,
        backgroundColor: '#FFF0F5', // Very light pink
        borderRadius: 20,
        marginBottom: 16,
    },
    victoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFCDD2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontWeight: 'bold',
        color: COLORS.primary,
        fontSize: 18,
    },
    victoryUser: {
        ...FONTS.body1,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    victoryBadge: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '600',
    },
    victoryBody: {
        ...FONTS.body2,
        color: COLORS.text,
        lineHeight: 22,
        marginBottom: 12,
    },
    reactionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reactionCount: {
        fontSize: 12,
        color: COLORS.textLight,
        marginLeft: 6,
        fontWeight: '600',
    },
    // Tribe/Empty State
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        backgroundColor: COLORS.background,
        borderRadius: 24,
        marginBottom: 32,
    },
    emptyStateText: {
        ...FONTS.body2,
        color: COLORS.primary,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 24,
    },
    infoSection: {
        marginBottom: 20,
    },
    sectionHeader: {
        ...FONTS.h3,
        color: COLORS.text,
        marginBottom: 8,
    },
    infoText: {
        ...FONTS.body2,
        color: COLORS.gray,
        lineHeight: 22,
    },
});
