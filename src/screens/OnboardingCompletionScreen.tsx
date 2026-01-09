import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { LunaMascot } from '../components/LunaMascot';
import { COLORS, SPACING } from '../constants/theme';

export const OnboardingCompletionScreen = () => {
    const navigation = useNavigation<any>();

    useEffect(() => {
        // Auto navigate to Home after animation
        const timer = setTimeout(() => {
            navigation.replace('MainTabs');
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <LunaMascot size="medium" mode="idle" />
                <Text style={styles.title}>Silent Learning Begun</Text>
                <Text style={styles.subtitle}>Luna is now quietly observing your patterns.</Text>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.l,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginTop: SPACING.xl,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: 'center',
        marginTop: SPACING.s,
    }
});
