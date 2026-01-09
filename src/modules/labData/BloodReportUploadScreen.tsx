/**
 * Blood Report Upload Screen (Tier 2: Lab Data)
 * 
 * Allows users to upload blood test reports
 * Uses Azure Document Intelligence for OCR extraction
 * 
 * TODO: Implement:
 * - Camera integration
 * - Image picker from gallery
 * - Upload to Azure Blob Storage
 * - Call Azure Document Intelligence API
 * - Parse and display extracted hormonal values
 * - Save to lab_results table
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export const BloodReportUploadScreen: React.FC = () => {
    const [imageUri, setImageUri] = useState<string | null>(null);

    const handleTakePhoto = () => {
        // TODO: Implement camera capture
        console.log('Opening camera...');
    };

    const handlePickImage = () => {
        // TODO: Implement image picker
        console.log('Opening gallery...');
    };

    const handleUpload = async () => {
        // TODO: Implement OCR processing
        // 1. Upload image to Azure Blob Storage
        // 2. Call Azure Document Intelligence API
        // 3. Extract: Free Testosterone, LH, FSH, AMH
        // 4. Save to Supabase lab_results table
        console.log('Processing blood report...');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Upload Blood Test Report</Text>
            <Text style={styles.subtitle}>
                We'll extract hormonal markers automatically
            </Text>

            {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.preview} />
            ) : (
                <View style={styles.placeholder}>
                    <Text>No image selected</Text>
                </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
                <Text style={styles.buttonText}>📸 Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handlePickImage}>
                <Text style={styles.buttonText}>🖼️ Choose from Gallery</Text>
            </TouchableOpacity>

            {imageUri && (
                <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                    <Text style={styles.buttonText}>✓ Process Report</Text>
                </TouchableOpacity>
            )}

            <Text style={styles.info}>
                📄 Supported formats: PDF, JPG, PNG{'\n'}
                🔒 Your data is encrypted and secure
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    placeholder: {
        height: 200,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 10,
    },
    preview: {
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    uploadButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    info: {
        marginTop: 20,
        color: '#666',
        textAlign: 'center',
        fontSize: 12,
    },
});
