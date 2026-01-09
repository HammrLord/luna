import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { API_ENDPOINTS } from '../../services/api.config';

export default function FoodScannerScreen() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<any | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
            analyzeFood(result.assets[0].base64);
        }
    };

    const takePicture = async () => {
        // In a real app, you'd use the camera ref here. 
        // For simplicity in this demo, let's stick to picker or add full camera logic if requested.
        // Assuming we want picker mainly for emulator/ease.
        Alert.alert("Feature", "Camera integration requires physical device or configured emulator. Using gallery for now.");
        pickImage();
    };

    const analyzeFood = async (base64: string | undefined | null) => {
        if (!base64) return;

        setLoading(true);
        setAnalysis(null);

        try {
            const response = await fetch(API_ENDPOINTS.FOOD_ANALYZE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageBase64: base64 }),
            });

            const data = await response.json();

            if (data.success) {
                setAnalysis(data.analysis);
            } else {
                Alert.alert("Error", data.error || "Failed to analyze food");
            }
        } catch (error) {
            Alert.alert("Error", "Could not connect to server. Check your backend.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (hasPermission === null) {
        return <View style={styles.container}><Text>Requesting permissions...</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={styles.container}><Text>No access to camera</Text></View>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Metabolic Vision</Text>
                    <Text style={styles.subtitle}>Scan your meal for PCOS insights</Text>
                </View>

                {/* Image Preview or Placeholder */}
                <View style={styles.imageContainer}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.previewImage} />
                    ) : (
                        <View style={styles.placeholderContainer}>
                            <Ionicons name="fast-food-outline" size={64} color="#ccc" />
                            <Text style={styles.placeholderText}>No food scanned yet</Text>
                        </View>
                    )}
                </View>

                {/* Actions */}
                <View style={styles.controls}>
                    <TouchableOpacity style={styles.button} onPress={pickImage}>
                        <Ionicons name="images-outline" size={24} color="#FFF" />
                        <Text style={styles.buttonText}>Upload Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.cameraButton]} onPress={takePicture}>
                        <Ionicons name="camera-outline" size={24} color="#FFF" />
                        <Text style={styles.buttonText}>Scan Meal</Text>
                    </TouchableOpacity>
                </View>

                {/* Loading State */}
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#E91E63" />
                        <Text style={styles.loadingText}>Analyzing nutritional content...</Text>
                    </View>
                )}

                {/* Analysis Results */}
                {analysis && !loading && (
                    <View style={styles.resultContainer}>

                        {/* Overall Compatibility Score */}
                        <View style={styles.scoreCard}>
                            <Text style={styles.scoreLabel}>PCOS Support Score</Text>
                            <View style={styles.scoreCircle}>
                                <Text style={styles.scoreValue}>{analysis.pcosCompatibility?.score || 0}</Text>
                                <Text style={styles.scoreTotal}>/100</Text>
                            </View>
                            <Text style={[
                                styles.statusText,
                                { color: analysis.pcosCompatibility?.status === 'Safe' ? '#4CAF50' : '#FF5722' }
                            ]}>
                                {analysis.pcosCompatibility?.status}
                            </Text>
                        </View>

                        {/* Stats Grid */}
                        <View style={styles.statsGrid}>
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>Glycemic Load</Text>
                                <Text style={styles.statValue}>{analysis.metabolicStats?.glycemicLoad}</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>Insulin Risk</Text>
                                <Text style={styles.statValue}>{analysis.metabolicStats?.insulinSpikeRisk}</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>Protein</Text>
                                <Text style={styles.statValue}>{analysis.metabolicStats?.totalProteing}g</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>Net Carbs</Text>
                                <Text style={styles.statValue}>{analysis.metabolicStats?.netCarbsg}g</Text>
                            </View>
                        </View>

                        {/* Recommendation */}
                        <View style={styles.feedbackContainer}>
                            <Text style={styles.feedbackTitle}>💡 AI Recommendation</Text>
                            <Text style={styles.feedbackText}>{analysis.feedback?.improvementTip}</Text>
                        </View>

                        {/* Issues List */}
                        {analysis.pcosCompatibility?.issues?.length > 0 && (
                            <View style={styles.issuesContainer}>
                                <Text style={styles.issuesTitle}>⚠️ Attention Needed</Text>
                                {analysis.pcosCompatibility.issues.map((issue: string, index: number) => (
                                    <Text key={index} style={styles.issueText}>• {issue}</Text>
                                ))}
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    imageContainer: {
        width: '100%',
        height: 250,
        borderRadius: 20,
        backgroundColor: '#FFF',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderContainer: {
        alignItems: 'center',
    },
    placeholderText: {
        marginTop: 10,
        color: '#999',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    cameraButton: {
        backgroundColor: '#E91E63',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '600',
        marginLeft: 8,
    },
    loadingContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    resultContainer: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 20,
        marginTop: 10,
        elevation: 2,
    },
    scoreCard: {
        alignItems: 'center',
        marginBottom: 20,
    },
    scoreLabel: {
        fontSize: 14,
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    scoreCircle: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginVertical: 10,
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333',
    },
    scoreTotal: {
        fontSize: 18,
        color: '#999',
    },
    statusText: {
        fontSize: 18,
        fontWeight: '600',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 15,
    },
    statBox: {
        width: '48%',
        marginBottom: 10,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#777',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    feedbackContainer: {
        backgroundColor: '#E3F2FD',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    feedbackTitle: {
        color: '#1976D2',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    feedbackText: {
        color: '#0D47A1',
        lineHeight: 20,
    },
    issuesContainer: {
        marginTop: 10,
    },
    issuesTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#D32F2F',
        marginBottom: 8,
    },
    issueText: {
        color: '#B71C1C',
        marginBottom: 4,
        fontSize: 14,
    },
});
