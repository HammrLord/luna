import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { LunaMascot } from '../components/LunaMascot';
import { COLORS, SPACING } from '../constants/theme';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    DiagnosisUpload: undefined;
    // Add other screens here
};

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DiagnosisUpload'>;

export const WelcomeScreen = () => {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.illustrationArea}>
                    <LunaMascot size="large" />
                </View>

                <View style={styles.textArea}>
                    <Text style={styles.title}>Welcome to Luna</Text>
                    <Text style={styles.subtitle}>
                        No daily logging. No diet plans.{'\n'}
                        Just quiet understanding.
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        console.log("Get Started Pressed");
                        try {
                            navigation.navigate('DiagnosisUpload');
                        } catch (e) {
                            console.error("Navigation failed:", e);
                        }
                    }}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.xxl,
    },
    illustrationArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textArea: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: SPACING.m,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: 'center',
        lineHeight: 24,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.m,
        borderRadius: 999,
        width: '80%',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
    }
});
