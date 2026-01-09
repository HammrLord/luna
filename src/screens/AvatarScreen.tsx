import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { LunaMascot } from '../components/LunaMascot';
import { COLORS, FONTS } from '../constants/theme';
import Animated, { FadeInUp } from 'react-native-reanimated';

export const AvatarScreen = () => {
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Animated.View entering={FadeInUp.delay(200)} style={styles.content}>
                    <Text style={styles.title}>Metabolic Avatar</Text>
                    <View style={styles.avatarContainer}>
                        <LunaMascot size="large" mode="idle" />
                    </View>
                    <Text style={styles.subtitle}>Your avatar is evolving based on your metabolic data.</Text>
                    <Text style={styles.status}>Current Status: <Text style={{ fontWeight: 'bold', color: COLORS.primary }}>Learning</Text></Text>
                </Animated.View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        alignItems: 'center',
    },
    title: {
        ...FONTS.h1,
        color: COLORS.text,
        marginBottom: 40,
    },
    avatarContainer: {
        marginBottom: 40,
    },
    subtitle: {
        ...FONTS.body1,
        textAlign: 'center',
        color: COLORS.gray,
        marginBottom: 20,
    },
    status: {
        ...FONTS.body2,
        color: COLORS.text,
    },
});
