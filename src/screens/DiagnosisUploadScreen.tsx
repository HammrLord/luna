import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { LunaMascot } from '../components/LunaMascot';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export const DiagnosisUploadScreen = () => {
    // Navigate strictly to 'PermissionsScreen' based on the concept flow
    // But we need to define the Type for navigation in a real app.
    // using any for quick prototyping
    const navigation = useNavigation<any>();
    const [permission, requestPermission] = useCameraPermissions();
    const [isScanning, setIsScanning] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    // Mock function to simulate scanning
    const handleScan = async () => {
        if (!permission?.granted) {
            const result = await requestPermission();
            if (!result.granted) return;
        }

        setIsScanning(true);
        // Simulate capture after 2s
        setTimeout(() => {
            setIsScanning(false);
            setAnalyzing(true);
            // Simulate analysis
            setTimeout(() => {
                setAnalyzing(false);
                navigation.navigate('PermissionsScreen');
            }, 3000);
        }, 2000);
    };

    const handleSkip = () => {
        navigation.navigate('PermissionsScreen');
    };

    if (analyzing) {
        return (
            <ScreenWrapper>
                <View style={styles.centerContainer}>
                    <LunaMascot size="large" mode="analyzing" />
                    <Text style={styles.analyzingText}>Luna is analyzing your patterns...</Text>
                    <Text style={styles.subText}>Extracting FSH, LH, and Insulin levels</Text>
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Optional Diagnosis</Text>
                    <Text style={styles.subtitle}>
                        Have a recent blood report? Luna can extract key markers to personalize your insights from Day 1.
                    </Text>
                </View>

                <View style={styles.scanArea}>
                    {isScanning ? (
                        <CameraView style={styles.camera} facing="back">
                            <View style={styles.overlay}>
                                <View style={styles.scanFrame} />
                                <Text style={styles.scanText}>Position document in frame</Text>
                            </View>
                        </CameraView>
                    ) : (
                        <View style={styles.placeholder}>
                            <Ionicons name="document-text-outline" size={64} color={COLORS.primary} />
                            <Text style={styles.placeholderText}>Tap to Scan Report</Text>
                        </View>
                    )}
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.mainButton} onPress={handleScan}>
                        <Text style={styles.buttonText}>{isScanning ? "Scanning..." : "Scan Report"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                        <Text style={styles.skipText}>Skip for Now</Text>
                    </TouchableOpacity>
                </View>
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginTop: SPACING.xl,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: SPACING.s,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        lineHeight: 24,
    },
    scanArea: {
        flex: 1,
        marginVertical: SPACING.xl,
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: 250,
        height: 350,
        borderWidth: 2,
        borderColor: COLORS.white,
        borderRadius: BORDER_RADIUS.m,
    },
    scanText: {
        color: COLORS.white,
        marginTop: SPACING.m,
        fontWeight: '600',
    },
    placeholder: {
        alignItems: 'center',
    },
    placeholderText: {
        marginTop: SPACING.m,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    actions: {
        gap: SPACING.m,
        marginBottom: SPACING.l,
    },
    mainButton: {
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
    skipButton: {
        paddingVertical: SPACING.s,
        alignItems: 'center',
    },
    skipText: {
        color: COLORS.textLight,
        fontSize: 14,
    },
    analyzingText: {
        marginTop: SPACING.xl,
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textDark,
    },
    subText: {
        marginTop: SPACING.s,
        color: COLORS.textLight,
    }
});
