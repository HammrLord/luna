import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export const PermissionsScreen = () => {
    const navigation = useNavigation<any>();

    const handleContinue = () => {
        navigation.navigate('ProfileSetupScreen');
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Passive Learning</Text>
                    <Text style={styles.subtitle}>
                        Luna works best when she can quietly learn from your routine.
                        Allow access to your activity data.
                    </Text>
                </View>

                <View style={styles.cardContainer}>
                    <View style={styles.permissionCard}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="moon" size={24} color={COLORS.primary} />
                        </View>
                        <View style={styles.cardText}>
                            <Text style={styles.cardTitle}>Sleep Patterns</Text>
                            <Text style={styles.cardDesc}>To anticipate energy dips.</Text>
                        </View>
                        <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                    </View>

                    <View style={styles.permissionCard}>
                        <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="footsteps" size={24} color="#2196F3" />
                        </View>
                        <View style={styles.cardText}>
                            <Text style={styles.cardTitle}>Activity Rhythm</Text>
                            <Text style={styles.cardDesc}>To detect fatigue early.</Text>
                        </View>
                        <TouchableOpacity style={styles.connectButton}>
                            <Text style={styles.connectText}>Connect</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.mainButton} onPress={handleContinue}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SPACING.l,
        justifyContent: 'space-between',
    },
    header: {
        marginTop: SPACING.xl,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textDark,
        textAlign: 'center',
        marginBottom: SPACING.m,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: '80%',
    },
    cardContainer: {
        gap: SPACING.m,
    },
    permissionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: BORDER_RADIUS.l,
        shadowColor: SHADOWS.soft.shadowColor,
        shadowOffset: SHADOWS.soft.shadowOffset,
        shadowOpacity: SHADOWS.soft.shadowOpacity,
        shadowRadius: SHADOWS.soft.shadowRadius,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFEFF5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    cardText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textDark,
    },
    cardDesc: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    connectButton: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: 20,
        backgroundColor: '#F5F6F7',
    },
    connectText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textDark,
    },
    mainButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.m,
        borderRadius: BORDER_RADIUS.circle,
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
