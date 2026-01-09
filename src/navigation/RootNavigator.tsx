import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

// Screens
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { OnboardingCompletionScreen } from '../screens/OnboardingCompletionScreen';
import { DiagnosisUploadScreen } from '../screens/DiagnosisUploadScreen';
import { PermissionsScreen } from '../screens/PermissionsScreen';
import { ProfileSetupScreen } from '../screens/ProfileSetupScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MealScanScreen } from '../screens/MealScanScreen';
import { AnalysisScreen } from '../screens/AnalysisScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { ChatbotScreen } from '../screens/ChatbotScreen';
import { ConsultationScreen } from '../screens/ConsultationScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AvatarScreen } from '../screens/AvatarScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarHideOnKeyboard: true, // Hide tab bar when keyboard opens
                tabBarStyle: {
                    backgroundColor: COLORS.white,
                    borderTopWidth: 0, // Remove flat border
                    height: 70, // Taller for bubbly feel
                    paddingBottom: 10,
                    paddingTop: 10,
                    borderRadius: 35, // Pill shape
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    ...SHADOWS.soft, // Soft pink shadow
                },
                tabBarShowLabel: false, // Hide labels for cleaner look (optional, but "girl coded" often means minimal)
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textLight,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: any;
                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Scan') iconName = focused ? 'scan' : 'scan-outline';
                    else if (route.name === 'Analysis') iconName = focused ? 'analytics' : 'analytics-outline';
                    else if (route.name === 'Community') iconName = focused ? 'people' : 'people-outline';
                    else if (route.name === 'Support') iconName = focused ? 'heart' : 'heart-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Scan" component={MealScanScreen} />
            <Tab.Screen name="Analysis" component={AnalysisScreen} />
            <Tab.Screen name="Community" component={CommunityScreen} />
            <Tab.Screen name="Support" component={ChatbotScreen} />
        </Tab.Navigator>
    );
};

export const RootNavigator = () => {
    // Temp bypass for testing
    const hasCompletedOnboarding = false;

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!hasCompletedOnboarding ? (
                    <>
                        <Stack.Screen name="Welcome" component={WelcomeScreen} />
                        <Stack.Screen name="DiagnosisUpload" component={DiagnosisUploadScreen} />
                        <Stack.Screen name="PermissionsScreen" component={PermissionsScreen} />
                        <Stack.Screen name="ProfileSetupScreen" component={ProfileSetupScreen} />
                        <Stack.Screen name="OnboardingCompletion" component={OnboardingCompletionScreen} />
                        <Stack.Screen name="MainTabs" component={MainTabs} />
                    </>
                ) : (
                    <Stack.Screen name="MainTabs" component={MainTabs} />
                )}
                {/* Global Screens accessible from anywhere */}
                <Stack.Screen name="Consultation" component={ConsultationScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="Avatar" component={AvatarScreen} />

            </Stack.Navigator>
        </NavigationContainer>
    );
};
