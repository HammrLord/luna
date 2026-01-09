import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

export const SettingsScreen = () => {
    const [appleHealth, setAppleHealth] = useState(true);
    const [oura, setOura] = useState(false);
    const [notifications, setNotifications] = useState(true);

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
                    <Text style={styles.headerTitle}>Settings</Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(300)}>
                    <Text style={styles.sectionTitle}>Integrations</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="heart" size={24} color={COLORS.sentinelStressed} />
                            <View style={styles.textContainer}>
                                <Text style={styles.settingLabel}>Apple Health</Text>
                                <Text style={styles.settingStatus}>{appleHealth ? 'Connected' : 'Disconnected'}</Text>
                            </View>
                        </View>
                        <Switch
                            value={appleHealth}
                            onValueChange={setAppleHealth}
                            trackColor={{ false: '#E0E0E0', true: COLORS.success }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="infinite" size={24} color={COLORS.text} />
                            <View style={styles.textContainer}>
                                <Text style={styles.settingLabel}>Oura Ring</Text>
                                <Text style={styles.settingStatus}>{oura ? 'Syncing...' : 'Tap to connect'}</Text>
                            </View>
                        </View>
                        <Switch
                            value={oura}
                            onValueChange={setOura}
                            trackColor={{ false: '#E0E0E0', true: COLORS.success }}
                        />
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(500)}>
                    <Text style={styles.sectionTitle}>Preferences</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="notifications" size={24} color={COLORS.primary} />
                            <View style={styles.textContainer}>
                                <Text style={styles.settingLabel}>Notifications</Text>
                                <Text style={styles.settingStatus}>Daily insights & reminders</Text>
                            </View>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: '#E0E0E0', true: COLORS.primary }}
                        />
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(700)} style={styles.footer}>
                    <TouchableOpacity style={styles.linkButton}>
                        <Text style={styles.linkText}>Privacy Policy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.linkButton}>
                        <Text style={[styles.linkText, { color: COLORS.error }]}>Sign Out</Text>
                    </TouchableOpacity>
                </Animated.View>

            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 30,
    },
    headerTitle: {
        ...FONTS.h1,
        color: COLORS.text,
    },
    sectionTitle: {
        ...FONTS.h3,
        color: COLORS.gray,
        marginBottom: 16,
        marginTop: 10,
    },
    settingItem: {
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        ...SHADOWS.glass,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 16,
    },
    settingLabel: {
        ...FONTS.body1,
        fontWeight: '600',
        color: COLORS.text,
    },
    settingStatus: {
        fontSize: 12,
        color: COLORS.gray,
    },
    footer: {
        marginTop: 30,
        alignItems: 'center',
    },
    linkButton: {
        padding: 10,
    },
    linkText: {
        ...FONTS.body2,
        color: COLORS.gray,
        textDecorationLine: 'underline',
    },
});
