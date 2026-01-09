/**
 * Doctor List Screen
 * 
 * Browse and search verified doctors for consultations
 * 
 * TODO: Implement:
 * - Fetch doctors from Supabase
 * - Filter by specialization
 * - Search functionality
 * - Sort by rating, price, availability
 * - Navigation to doctor profile
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabaseClient';

interface Doctor {
    id: string;
    full_name: string;
    specialization: string;
    years_of_experience: number;
    consultation_fee: number;
    average_rating: number;
    total_consultations: number;
    profile_photo_url?: string;
    is_available: boolean;
}

export const DoctorListScreen: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = async () => {
        try {
            const { data, error } = await supabase
                .from('doctors')
                .select('*')
                .eq('is_verified', true)
                .order('average_rating', { ascending: false });

            if (error) throw error;

            // Placeholder data
            setDoctors([
                {
                    id: '1',
                    full_name: 'Dr. Sarah Johnson',
                    specialization: 'Endocrinologist',
                    years_of_experience: 12,
                    consultation_fee: 500,
                    average_rating: 4.8,
                    total_consultations: 234,
                    is_available: true,
                },
                {
                    id: '2',
                    full_name: 'Dr. Priya Sharma',
                    specialization: 'Gynecologist',
                    years_of_experience: 15,
                    consultation_fee: 600,
                    average_rating: 4.9,
                    total_consultations: 456,
                    is_available: true,
                },
                {
                    id: '3',
                    full_name: 'Dr. Anita Patel',
                    specialization: 'PCOD/PCOS Specialist',
                    years_of_experience: 10,
                    consultation_fee: 550,
                    average_rating: 4.7,
                    total_consultations: 189,
                    is_available: false,
                },
            ]);
        } catch (error) {
            console.error('Error loading doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const navigateToDoctorProfile = (doctor: Doctor) => {
        // TODO: Navigate to DoctorProfileScreen
        console.log('View doctor:', doctor.full_name);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Consult a Doctor 👩‍⚕️</Text>
                <Text style={styles.headerSubtitle}>
                    1v1 video consultations with verified specialists
                </Text>
            </View>

            <View style={styles.filterContainer}>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>All Specialists</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>Available Now</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>Sorted by Rating</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={doctors}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.doctorCard}
                        onPress={() => navigateToDoctorProfile(item)}
                    >
                        <View style={styles.profilePhoto}>
                            <Text style={styles.profileInitial}>
                                {item.full_name.charAt(0)}
                            </Text>
                        </View>

                        <View style={styles.doctorInfo}>
                            <Text style={styles.doctorName}>{item.full_name}</Text>
                            <Text style={styles.specialization}>{item.specialization}</Text>
                            <Text style={styles.experience}>
                                {item.years_of_experience} years experience • {item.total_consultations} consultations
                            </Text>

                            <View style={styles.footer}>
                                <View style={styles.rating}>
                                    <Text style={styles.ratingText}>⭐ {item.average_rating}</Text>
                                </View>
                                <Text style={styles.fee}>₹{item.consultation_fee}</Text>
                                {item.is_available ? (
                                    <View style={styles.availableBadge}>
                                        <Text style={styles.availableText}>Available</Text>
                                    </View>
                                ) : (
                                    <View style={styles.unavailableBadge}>
                                        <Text style={styles.unavailableText}>Busy</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                refreshing={loading}
                onRefresh={loadDoctors}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#10B981',
        padding: 20,
        paddingTop: 40,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    filterContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 8,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    filterText: {
        fontSize: 14,
        color: '#666',
    },
    listContent: {
        padding: 16,
    },
    doctorCard: {
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 16,
        marginBottom: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    profilePhoto: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    profileInitial: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
    },
    doctorInfo: {
        flex: 1,
    },
    doctorName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    specialization: {
        fontSize: 14,
        color: '#10B981',
        marginBottom: 4,
    },
    experience: {
        fontSize: 12,
        color: '#666',
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    rating: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '600',
    },
    fee: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    availableBadge: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    availableText: {
        fontSize: 12,
        color: '#10B981',
        fontWeight: '600',
    },
    unavailableBadge: {
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    unavailableText: {
        fontSize: 12,
        color: '#EF4444',
        fontWeight: '600',
    },
});
