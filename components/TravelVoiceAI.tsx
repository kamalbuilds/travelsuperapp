"use dom";
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useConversation } from "@11labs/react";
import { Mic, MicOff } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import type { Message } from "./ChatMessage";

async function requestMicrophonePermission() {
  try {
    if (Platform.OS === 'web') {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    }
    return true;
  } catch (error) {
    console.log(error);
    console.error("Microphone permission denied");
    return false;
  }
}

// Mock travel tools for now (will be replaced with real implementation later)
const mockTravelTools = {
  get_current_location: async () => {
    return "You are currently in San Francisco, CA. Perfect weather for travel planning!";
  },
  search_flights: async ({ origin, destination, departureDate }: any) => {
    return `Found 3 flights from ${origin} to ${destination} on ${departureDate}. Best price: $650 with Emirates.`;
  },
  get_weather: async ({ destination }: any) => {
    return `Weather in ${destination}: 24°C, Sunny. Perfect for outdoor activities!`;
  },
  save_trip_preferences: async (preferences: any) => {
    return `Saved your preferences: ${JSON.stringify(preferences)}`;
  },
  get_travel_recommendations: async ({ destination }: any) => {
    return `Top recommendations for ${destination}: Visit the historic downtown, try local cuisine, and don't miss the sunset viewpoint!`;
  },
  emergency_assistance: async ({ emergencyType }: any) => {
    return `🚨 Emergency assistance for ${emergencyType}. Call local emergency services immediately if urgent!`;
  },
};

interface TravelVoiceAIProps {
  dom?: import("expo/dom").DOMProps;
  onMessage?: (message: Message) => void;
  agentId?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'emergency';
}

export default function TravelVoiceAI({
  onMessage,
  agentId = "YOUR_AGENT_ID", // Replace with actual agent ID
  size = 'medium',
  variant = 'primary'
}: TravelVoiceAIProps) {
  const colorScheme = useColorScheme();
  const [isInitialized, setIsInitialized] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log("TravelVoice AI Connected");
      onMessage?.({
        source: "ai",
        message: "Hi! I'm your AI travel assistant. I can help you plan trips, find flights, get weather updates, and handle travel emergencies. What would you like to do?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    },
    onDisconnect: () => {
      console.log("TravelVoice AI Disconnected");
      setIsInitialized(false);
    },
    onMessage: message => {
      onMessage?.({
        source: "ai",
        message: message.message || message.toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    },
    onError: error => {
      console.error("TravelVoice AI Error:", error);
      Alert.alert(
        "Connection Error",
        "Unable to connect to AI assistant. Please check your internet connection and try again.",
        [{ text: "OK" }]
      );
    },
  });

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        Alert.alert(
          "Microphone Access Required",
          "Please enable microphone access to use voice features with your AI travel assistant.",
          [{ text: "OK" }]
        );
        return;
      }

      // Start the conversation with your agent
      console.log("Starting TravelVoice AI session");
      await conversation.startSession({
        agentId: agentId,
        dynamicVariables: {
          platform: Platform.OS,
          app_name: "TravelVoice AI",
          user_type: "traveler",
        },
        clientTools: {
          // Travel-specific tools
          get_current_location: mockTravelTools.get_current_location,
          search_flights: mockTravelTools.search_flights,
          get_weather: mockTravelTools.get_weather,
          save_trip_preferences: mockTravelTools.save_trip_preferences,
          get_travel_recommendations: mockTravelTools.get_travel_recommendations,
          emergency_assistance: mockTravelTools.emergency_assistance,
          
          // Utility functions
          log_message: async ({ message }: { message: string }) => {
            console.log("AI Log:", message);
            return "Message logged";
          },
          
          navigate_to_screen: async ({ screen }: { screen: string }) => {
            // This would trigger navigation in the real app
            console.log("Navigate to:", screen);
            return `Navigating to ${screen}`;
          },
        },
      });

      setIsInitialized(true);
    } catch (error) {
      console.error("Failed to start TravelVoice AI conversation:", error);
      Alert.alert(
        "Startup Error",
        "Failed to initialize AI assistant. Please try again.",
        [{ text: "OK" }]
      );
    }
  }, [conversation, agentId]);

  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession();
      setIsInitialized(false);
      onMessage?.({
        source: "ai",
        message: "AI assistant disconnected. Tap to reconnect when you need help!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (error) {
      console.error("Error stopping conversation:", error);
    }
  }, [conversation, onMessage]);

  // Dynamic sizing
  const buttonSizes = {
    small: { width: 60, height: 60, iconSize: 20 },
    medium: { width: 80, height: 80, iconSize: 28 },
    large: { width: 120, height: 120, iconSize: 32 },
  };

  const currentSize = buttonSizes[size];

  // Dynamic colors based on variant
  const getVariantColors = () => {
    const colors = Colors[colorScheme ?? 'light'];
    switch (variant) {
      case 'emergency':
        return {
          active: '#EF4444',
          inactive: '#DC2626',
          background: 'rgba(239, 68, 68, 0.1)',
        };
      case 'secondary':
        return {
          active: colors.tabIconSelected,
          inactive: colors.tabIconDefault,
          background: colors.tabIconDefault + '20',
        };
      default:
        return {
          active: '#EF4444',
          inactive: colors.tint,
          background: colors.tint + '20',
        };
    }
  };

  const variantColors = getVariantColors();
  const isActive = conversation.status === "connected";

  return (
    <Pressable
      style={[
        styles.callButton,
        {
          width: currentSize.width,
          height: currentSize.height,
          borderRadius: currentSize.width / 2,
          backgroundColor: variantColors.background,
        },
        isActive && {
          backgroundColor: variantColors.active + '30',
        },
      ]}
      onPress={isActive ? stopConversation : startConversation}
    >
      <View
        style={[
          styles.buttonInner,
          {
            width: currentSize.width * 0.7,
            height: currentSize.height * 0.7,
            borderRadius: (currentSize.width * 0.7) / 2,
            backgroundColor: isActive ? variantColors.active : variantColors.inactive,
          },
        ]}
      >
        {isActive ? (
          <MicOff
            size={currentSize.iconSize}
            color="#FFFFFF"
            strokeWidth={1.5}
          />
        ) : (
          <Mic
            size={currentSize.iconSize}
            color="#FFFFFF"
            strokeWidth={1.5}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  callButton: {
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonInner: {
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
}); 