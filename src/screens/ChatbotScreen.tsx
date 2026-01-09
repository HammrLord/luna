import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Modal } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp, FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { useUser } from '../context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { LunaMascot } from '../components/LunaMascot';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'luna';
    timestamp: Date;
    isTyping?: boolean; // For the typing placeholder
}

// Typing Indicator Component
const TypingIndicator = () => {
    const opacity = useSharedValue(0.5);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 600 }),
                withTiming(0.5, { duration: 600 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    return (
        <Animated.View style={[styles.typingBubble, animatedStyle]}>
            <View style={styles.dot} />
            <View style={[styles.dot, { marginHorizontal: 4 }]} />
            <View style={styles.dot} />
        </Animated.View>
    );
};

export const ChatbotScreen = () => {
    const navigation = useNavigation<any>();
    const { userName } = useUser();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `Hey ${userName}! 💖 I'm here for you. Whether you want to vent, ask health questions, or just chat, I'm all ears!`,
            sender: 'luna',
            timestamp: new Date(),
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [voiceModeVisible, setVoiceModeVisible] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const sendMessage = () => {
        if (inputText.trim().length === 0) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputText('');
        setIsTyping(true);

        // Simulate thoughtful response time
        setTimeout(() => {
            const responses = [
                "Honestly, I totally get that. It's so frustrating when your body doesn't cooperate. 🥺",
                "You're doing amazing, even if it doesn't feel like it today. ✨ Have you drank enough water?",
                "That sounds super tough. Do you think it's related to your cycle phase?",
                "I'm sending you a virtual hug! 🤗 Remember to be kind to yourself.",
                "Ooh, that's a great question! Based on your logs, it might be stress-related.",
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const newLunaMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: randomResponse,
                sender: 'luna',
                timestamp: new Date(),
            };

            setIsTyping(false);
            setMessages(prev => [...prev, newLunaMessage]);
        }, 2000);
    };

    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages, isTyping]);

    const renderItem = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';

        if (isUser) {
            return (
                <Animated.View entering={FadeInUp.duration(400)} style={[styles.messageRow, { justifyContent: 'flex-end' }]}>
                    <LinearGradient
                        colors={[COLORS.primary, COLORS.secondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.messageBubble, styles.userBubble]}
                    >
                        <Text style={styles.userText}>{item.text}</Text>
                    </LinearGradient>
                </Animated.View>
            );
        }

        return (
            <Animated.View entering={FadeInUp.duration(400)} style={[styles.messageRow, { justifyContent: 'flex-start' }]}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../assets/images/mascot.webp')} style={styles.avatar} />
                </View>
                <View style={[styles.messageBubble, styles.lunaBubble]}>
                    <Text style={styles.lunaText}>{item.text}</Text>
                </View>
            </Animated.View>
        );
    };

    return (
        <ScreenWrapper>
            {/* Voice Mode Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={voiceModeVisible}
                onRequestClose={() => setVoiceModeVisible(false)}
            >
                <View style={styles.voiceOverlay}>
                    <TouchableOpacity
                        style={styles.closeVoiceButton}
                        onPress={() => setVoiceModeVisible(false)}
                    >
                        <Ionicons name="close" size={24} color={COLORS.white} />
                    </TouchableOpacity>

                    <View style={styles.voiceContent}>
                        <LunaMascot size="large" mode="listening" />

                        <Text style={styles.voicePrompt}>
                            Go ahead, I'm listening...
                        </Text>

                        <Animated.Text entering={FadeInUp.delay(1000)} style={styles.voiceTranscript}>
                            "My energy levels have been really low lately..."
                        </Animated.Text>
                    </View>

                    <View style={styles.voiceControls}>
                        <View style={[styles.controlButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <Ionicons name="keypad" size={24} color={COLORS.white} />
                        </View>

                        <TouchableOpacity style={styles.mainMicButton}>
                            <Ionicons name="mic" size={32} color={COLORS.white} />
                        </TouchableOpacity>

                        <View style={[styles.controlButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <Ionicons name="close" size={24} color={COLORS.white} />
                        </View>
                    </View>
                </View>
            </Modal>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.headerAvatarContainer}>
                            <Image source={require('../assets/images/mascot.webp')} style={styles.headerAvatar} />
                            <View style={styles.activeBadge} />
                        </View>
                        <View>
                            <Text style={styles.headerTitle}>Luna Bestie</Text>
                            <Text style={styles.headerSubtitle}>Always here • Replies instantly</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.consultButton}
                        onPress={() => navigation.navigate('Consultation')}
                    >
                        <Ionicons name="medical" size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>

                {/* Chat Area */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={
                        isTyping ? (
                            <View style={[styles.messageRow, { justifyContent: 'flex-start', marginLeft: 50 }]}>
                                <TypingIndicator />
                            </View>
                        ) : null
                    }
                />

                {/* Input Area */}
                <View style={styles.inputContainer}>
                    <TouchableOpacity
                        style={styles.micButtonInput}
                        onPress={() => setVoiceModeVisible(true)}
                    >
                        <Ionicons name="mic" size={24} color={COLORS.primary} />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        placeholder="Tell me everything..."
                        placeholderTextColor={COLORS.textLight}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, { opacity: inputText.trim() ? 1 : 0.5 }]}
                        onPress={sendMessage}
                        disabled={!inputText.trim()}
                    >
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.secondary]}
                            style={styles.gradientButton}
                        >
                            <Ionicons name="arrow-up" size={24} color={COLORS.white} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
        paddingBottom: 15,
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        ...SHADOWS.soft,
        zIndex: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAvatarContainer: {
        marginRight: 12,
    },
    headerAvatar: {
        width: 45,
        height: 45,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: COLORS.secondary,
    },
    activeBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: COLORS.success,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    headerTitle: {
        ...FONTS.h3,
        color: COLORS.text,
    },
    headerSubtitle: {
        fontSize: 12,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    consultButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 100, // Space for input
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-end',
    },
    avatarContainer: {
        marginRight: 8,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: COLORS.background,
    },
    messageBubble: {
        maxWidth: '75%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        ...SHADOWS.glass,
    },
    userBubble: {
        borderBottomRightRadius: 4,
    },
    lunaBubble: {
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    userText: {
        ...FONTS.body1,
        color: COLORS.white,
    },
    lunaText: {
        ...FONTS.body1,
        color: COLORS.text,
    },
    typingBubble: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        borderBottomLeftRadius: 4,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.textLight,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginBottom: 110, // Increased to clear floating tab bar
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 14,
        marginRight: 10,
        fontSize: 16,
        color: COLORS.text,
        ...SHADOWS.soft,
        maxHeight: 100,
    },
    sendButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        ...SHADOWS.soft,
    },
    gradientButton: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    micButtonInput: {
        marginRight: 10,
        padding: 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
    },
    voiceOverlay: {
        flex: 1,
        backgroundColor: '#0F0F13', // Deep dark background like reference
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeVoiceButton: {
        position: 'absolute',
        top: 60,
        right: 30,
        padding: 10,
        zIndex: 10,
    },
    voiceContent: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    voicePrompt: {
        ...FONTS.body1,
        color: '#A0A0A0',
        marginTop: 40,
        marginBottom: 20,
    },
    voiceTranscript: {
        ...FONTS.h3,
        color: COLORS.white,
        textAlign: 'center',
        paddingHorizontal: 40,
        fontWeight: '300',
    },
    voiceControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
        marginBottom: 60,
    },
    controlButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainMicButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FF4081', // Hot Pink accent
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.soft,
        shadowColor: '#FF4081',
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
});
