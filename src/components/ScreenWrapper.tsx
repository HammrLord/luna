import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { COLORS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface ScreenWrapperProps {
    children: React.ReactNode;
    bgType?: 'plain' | 'gradient';
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, bgType = 'gradient' }) => {
    if (bgType === 'gradient') {
        return (
            <LinearGradient
                colors={[COLORS.background, '#FFFFFF']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <SafeAreaView style={styles.safeArea}>
                    <StatusBar barStyle="dark-content" />
                    {children}
                </SafeAreaView>
            </LinearGradient>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: COLORS.background }]}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" />
                {children}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});
