import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useIsFocused } from '@react-navigation/native';

export const MealScanScreen = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [scannedTags, setScannedTags] = useState<string[]>([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused && !permission?.granted) {
            requestPermission();
        }
    }, [isFocused]);

    useEffect(() => {
        // Simulate finding tags after a delay
        if (isFocused) {
            const timer = setTimeout(() => {
                setScannedTags(['Fiber Rich: Good', 'Low Glycemic Load']);
            }, 1500);
            return () => clearTimeout(timer);
        } else {
            setScannedTags([]);
        }
    }, [isFocused]);

    if (!permission?.granted) {
        return (
            <View style={styles.center}>
                <Text>Camera permission needed for Metabolic Vision.</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.permBtn}>
                    <Text style={styles.btnText}>Grant Access</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isFocused && (
                <CameraView style={styles.camera} facing="back">
                    {/* AR Overlay Area */}
                    <View style={styles.overlay}>
                        <View style={styles.header}>
                            <BlurView intensity={30} tint="dark" style={styles.glassHeader}>
                                <Text style={styles.headerTitle}>Metabolic Vision</Text>
                                <Ionicons name="scan-outline" size={20} color="#fff" />
                            </BlurView>
                        </View>

                        {/* Floating Tags */}
                        {scannedTags.map((tag, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.arTag,
                                    { top: 200 + index * 60, left: 100 + index * 20 } // Rough positioning mock
                                ]}
                            >
                                <View style={styles.dot} />
                                <View style={styles.tagContent}>
                                    <Text style={styles.tagText}>{tag}</Text>
                                </View>
                            </View>
                        ))}

                        {/* Custom Corners for "Scanner" feel */}
                        <View style={styles.scanFrame} />

                        {/* Shutter Button */}
                        <View style={styles.controls}>
                            <TouchableOpacity style={styles.shutterOuter}>
                                <View style={styles.shutterInner} />
                            </TouchableOpacity>
                            <Text style={styles.instruction}>Snap to analyze insulin impact</Text>
                        </View>
                    </View>
                </CameraView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        padding: SPACING.l,
    },
    header: {
        marginTop: 40,
        alignItems: 'center',
    },
    glassHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.s,
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.s,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerTitle: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    scanFrame: {
        position: 'absolute',
        top: '25%',
        left: '10%',
        right: '10%',
        bottom: '25%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 20,
        borderStyle: 'dashed',
    },
    arTag: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.white,
        marginRight: 8,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
    tagContent: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: SPACING.m,
        paddingVertical: 6,
        borderRadius: 12,
    },
    tagText: {
        color: COLORS.textDark,
        fontSize: 12,
        fontWeight: 'bold',
    },
    controls: {
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    shutterOuter: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 4,
        borderColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    shutterInner: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
    },
    instruction: {
        color: COLORS.white,
        opacity: 0.8,
        fontSize: 14,
    },
    permBtn: {
        marginTop: SPACING.m,
        padding: SPACING.m,
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.m
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold'
    }
});
