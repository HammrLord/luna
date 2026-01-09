import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';
import { COLORS } from '../constants/theme';

interface LunaMascotProps {
    size?: 'small' | 'medium' | 'large';
    mode?: 'idle' | 'analyzing' | 'stressed' | 'listening';
}

export const LunaMascot: React.FC<LunaMascotProps> = ({ size = 'medium', mode = 'idle' }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.8);

    const getDimensions = () => {
        switch (size) {
            case 'small': return 40;
            case 'large': return 200;
            case 'medium': default: return 100;
        }
    };

    const dimension = getDimensions();

    useEffect(() => {
        if (mode === 'analyzing') {
            // Fast pulse
            scale.value = withRepeat(withTiming(1.2, { duration: 800, easing: Easing.ease }), -1, true);
            opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
        } else if (mode === 'listening') {
            // Voice Mode Pulse (Deep, Rhythmic)
            scale.value = withRepeat(withTiming(1.3, { duration: 1200, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }), -1, true);
            opacity.value = withRepeat(withTiming(0.4, { duration: 1200 }), -1, true);
        } else {
            // Slow breathing (idle) - Organic multi-layer effect
            scale.value = withRepeat(withTiming(1.05, { duration: 4000, easing: Easing.inOut(Easing.ease) }), -1, true);
            opacity.value = withRepeat(withTiming(0.6, { duration: 4000 }), -1, true);
        }
    }, [mode]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    // Secondary Ripple for "Premium" feel
    const rippleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value * 1.1 }],
        opacity: opacity.value * 0.5,
    }));

    return (
        <View style={[styles.container, { width: dimension, height: dimension }]}>
            {/* Outer Ripple */}
            <Animated.View
                style={[
                    styles.glow,
                    {
                        backgroundColor: mode === 'stressed' ? COLORS.sentinelStressed :
                            mode === 'listening' ? '#00E5FF' : // Electric Blue for Voice
                                COLORS.sentinelPulsing,
                        borderRadius: dimension,
                        width: dimension,
                        height: dimension,
                    },
                    rippleStyle
                ]}
            />

            {/* Inner Glow */}
            <Animated.View
                style={[
                    styles.glow,
                    {
                        backgroundColor: mode === 'stressed' ? COLORS.sentinelStressed :
                            mode === 'listening' ? '#00E5FF' :
                                COLORS.sentinelPulsing,
                        borderRadius: dimension / 2,
                        width: dimension,
                        height: dimension,
                    },
                    animatedStyle
                ]}
            />

            {/* The Mascot Image Layer - Using expo-image for animated WebP support */}
            <Image
                source={require('../assets/images/mascot.webp')}
                style={[
                    styles.mascot,
                    { width: dimension, height: dimension, borderRadius: dimension / 2 }
                ]}
                contentFit="cover"
                transition={500}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    glow: {
        position: 'absolute',
    },
    mascot: {
        // expo-image handles layout similar to RN Image
    }
});
