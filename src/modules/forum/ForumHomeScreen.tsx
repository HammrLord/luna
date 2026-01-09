/**
 * Forum Home Screen
 * 
 * Community forum for PCOD/PCOS support and discussions
 * 
 * TODO: Implement:
 * - Fetch forum categories from Supabase
 * - Display category list with post counts
 * - Navigation to category posts
 * - Search functionality
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabaseClient';

interface Category {
    id: string;
    name: string;
    description: string;
    icon: string;
    postCount?: number;
}

export const ForumHomeScreen: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            // TODO: Fetch from forum_categories table
            const { data, error } = await supabase
                .from('forum_categories')
                .select('*');

            if (error) throw error;

            // Placeholder data
            setCategories([
                { id: '1', name: 'PCOD Support', description: 'Share experiences and support', icon: '💙', postCount: 45 },
                { id: '2', name: 'PCOS Support', description: 'Connect with others', icon: '💜', postCount: 67 },
                { id: '3', name: 'Lifestyle & Diet', description: 'Tips and recipes', icon: '🥗', postCount: 89 },
                { id: '4', name: 'Success Stories', description: 'Celebrate victories', icon: '🌟', postCount: 34 },
                { id: '5', name: 'Mental Health', description: 'Emotional wellness', icon: '🧠', postCount: 23 },
                { id: '6', name: 'Ask the Community', description: 'Questions and answers', icon: '❓', postCount: 56 },
            ]);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const navigateToCategory = (category: Category) => {
        // TODO: Navigate to PostListScreen
        console.log('Navigate to category:', category.name);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Community Forum 💬</Text>
                <Text style={styles.headerSubtitle}>
                    A safe space to connect and support each other
                </Text>
            </View>

            <TouchableOpacity style={styles.createPostButton}>
                <Text style={styles.createPostText}>✏️ Create New Post</Text>
            </TouchableOpacity>

            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.categoryCard}
                        onPress={() => navigateToCategory(item)}
                    >
                        <Text style={styles.categoryIcon}>{item.icon}</Text>
                        <View style={styles.categoryInfo}>
                            <Text style={styles.categoryName}>{item.name}</Text>
                            <Text style={styles.categoryDescription}>{item.description}</Text>
                        </View>
                        <View style={styles.categoryStats}>
                            <Text style={styles.postCount}>{item.postCount}</Text>
                            <Text style={styles.postLabel}>posts</Text>
                        </View>
                    </TouchableOpacity>
                )}
                refreshing={loading}
                onRefresh={loadCategories}
            />

            <View style={styles.guidelines}>
                <Text style={styles.guidelinesTitle}>Community Guidelines</Text>
                <Text style={styles.guidelinesText}>
                    • Be respectful and supportive{'\n'}
                    • No medical advice from non-professionals{'\n'}
                    • Protect privacy - no personal medical details{'\n'}
                    • Report inappropriate content
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#007AFF',
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
    createPostButton: {
        backgroundColor: '#34C759',
        padding: 16,
        margin: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    createPostText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    categoryCard: {
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    categoryIcon: {
        fontSize: 32,
        marginRight: 16,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    categoryDescription: {
        fontSize: 14,
        color: '#666',
    },
    categoryStats: {
        alignItems: 'center',
    },
    postCount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    postLabel: {
        fontSize: 12,
        color: '#666',
    },
    guidelines: {
        backgroundColor: 'white',
        padding: 16,
        margin: 16,
        borderRadius: 12,
    },
    guidelinesTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    guidelinesText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});
