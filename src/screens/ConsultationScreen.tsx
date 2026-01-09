import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

const DOCTORS = [
    { id: 1, name: 'Dr. Sarah Chen', specialty: 'Endocrinologist', rating: 4.9, available: true },
    { id: 2, name: 'Dr. Alisha Patel', specialty: 'PCOS Nutritionist', rating: 4.8, available: false },
    { id: 3, name: 'Dr. Emily Rose', specialty: 'Gynecologist', rating: 5.0, available: true },
];

export const ConsultationScreen = () => {
    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.container}>
                <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
                    <Text style={styles.headerTitle}>Consultation</Text>
                    <Text style={styles.headerSubtitle}>Connect with PCOD specialists.</Text>
                </Animated.View>

                {/* Quick Connect Banner */}
                <Animated.View entering={FadeInUp.delay(400)} style={styles.quickConnectStart}>
                    <View style={styles.quickConnectTextContainer}>
                        <Text style={styles.quickTitle}>Urgent Question?</Text>
                        <Text style={styles.quickSubtitle}>Talk to a general practitioner in 10 mins.</Text>
                    </View>
                    <TouchableOpacity style={styles.quickButton}>
                        <Text style={styles.quickButtonText}>Start Now</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Text style={styles.sectionTitle}>Available Specialists</Text>

                {DOCTORS.map((doc, index) => (
                    <Animated.View
                        key={doc.id}
                        entering={FadeInUp.delay(600 + (index * 100))}
                        style={styles.doctorCard}
                    >
                        <View style={styles.docAvatar}>
                            <Ionicons name="person" size={24} color={COLORS.primary} />
                        </View>
                        <View style={styles.docInfo}>
                            <Text style={styles.docName}>{doc.name}</Text>
                            <Text style={styles.docSpecialty}>{doc.specialty}</Text>
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={12} color="#FFD700" />
                                <Text style={styles.ratingText}>{doc.rating}</Text>
                                {doc.available && (
                                    <View style={styles.availableBadge}>
                                        <Text style={styles.availableText}>Available</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        <TouchableOpacity style={styles.bookButton}>
                            <Text style={styles.bookButtonText}>Book</Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}

            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        marginBottom: 30,
    },
    headerTitle: {
        ...FONTS.h1,
        color: COLORS.text,
    },
    headerSubtitle: {
        ...FONTS.body1,
        color: COLORS.gray,
    },
    quickConnectStart: {
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
        ...SHADOWS.soft,
    },
    quickConnectTextContainer: {
        flex: 1,
    },
    quickTitle: {
        ...FONTS.h3,
        color: COLORS.white,
    },
    quickSubtitle: {
        ...FONTS.body3,
        color: 'rgba(255,255,255,0.9)',
    },
    quickButton: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    quickButtonText: {
        ...FONTS.body3,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    sectionTitle: {
        ...FONTS.h3,
        color: COLORS.text,
        marginBottom: 16,
    },
    doctorCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        ...SHADOWS.glass,
    },
    docAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    docInfo: {
        flex: 1,
    },
    docName: {
        ...FONTS.body1,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    docSpecialty: {
        ...FONTS.body3,
        color: COLORS.gray,
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        ...FONTS.body3,
        marginLeft: 4,
        marginRight: 8,
        color: COLORS.text,
    },
    availableBadge: {
        backgroundColor: '#E6FFFA',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    availableText: {
        fontSize: 10,
        color: COLORS.success,
        fontWeight: 'bold',
    },
    bookButton: {
        backgroundColor: COLORS.background,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    bookButtonText: {
        ...FONTS.body3,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
});
