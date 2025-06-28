import { router } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  MapPin,
  Mic,
  Send,
  Users
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ConversationalAIDOMComponent from '@/components/ConversationalAI';
import { Colors } from '@/constants/Colors';
import { AGENT_IDS, isElevenLabsConfigured, SETUP_INSTRUCTIONS } from '@/constants/ElevenLabsConfig';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width } = Dimensions.get('window');

interface Message {
  id: number;
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
}

const suggestions = [
  'Plan a romantic getaway to Paris',
  'Family vacation to Disney World',
  'Adventure trip to New Zealand',
  'Cultural tour of Japan',
  'Beach holiday in Maldives',
  'Safari in Kenya',
];

const aiResponses: Message[] = [
  {
    id: 1,
    type: 'ai' as const,
    message: "Hi! I'm Sofia, your travel assistant. I'd love to help you plan the perfect trip! Where would you like to go?",
    timestamp: '2:30 PM',
  },
];

export default function TripPlanningScreen() {
  const colorScheme = useColorScheme();
  const [messages, setMessages] = useState<Message[]>(aiResponses);
  const [inputText, setInputText] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isAIConnected, setIsAIConnected] = useState(false);

  console.log("🎤 platform:", Platform);
  // Get ElevenLabs Agent ID from configuration
  const AGENT_ID = AGENT_IDS.SOFIA;
  const isConfigured = isElevenLabsConfigured();

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        type: 'user',
        message: inputText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages([...messages, newMessage]);
      setInputText('');

      // Only add mock response if not connected to AI voice
      if (!isAIConnected) {
        setTimeout(() => {
          const aiResponse: Message = {
            id: messages.length + 2,
            type: 'ai',
            message: isConfigured 
              ? "Great choice! I can help you plan an amazing trip. Try using the voice button for a more natural conversation with our AI assistant!"
              : "Great choice! I can help you plan an amazing trip. Voice AI requires ElevenLabs configuration - check the setup instructions in the console.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages(prev => [...prev, aiResponse]);
        }, 1000);
      }
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
  };

  const handleVoiceModeToggle = async () => {
    console.log('🎤 Voice Mode Toggle Pressed');
    console.log('📋 Is Configured:', isConfigured);
    console.log('🆔 Agent ID:', AGENT_ID);
    console.log('🔑 Has API Key:', !!process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY);
    
    if (!isConfigured) {
      console.log('❌ ElevenLabs Setup Instructions:', SETUP_INSTRUCTIONS.steps);
      Alert.alert('Configuration Required', 'ElevenLabs configuration required. Check console for setup instructions.');
      return;
    }

    // Simply toggle voice mode - the DOM component will handle microphone permissions
    console.log('✅ Toggling voice mode from', isVoiceMode, 'to', !isVoiceMode);
    setIsVoiceMode(!isVoiceMode);
  };

  const handleAIMessage = (message: any) => {
    console.log('Received AI message:', message);
    
    // Convert ElevenLabs message to our chat format
    if (message.type === 'agent_response' || message.content) {
      const aiMessage: Message = {
        id: messages.length + 1,
        type: 'ai',
        message: message.content || message.text || 'AI response received',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMessage]);
    }
  };

  const handleAIConnect = () => {
    console.log('🎉 AI Assistant connected successfully!');
    console.log('🔄 Setting isAIConnected to true');
    setIsAIConnected(true);
    
    const connectMessage: Message = {
      id: messages.length + 1,
      type: 'ai',
      message: "🎤 Voice AI connected! You can now speak naturally with me about your travel plans.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, connectMessage]);
  };

  const handleAIDisconnect = () => {
    console.log('👋 AI Assistant disconnected');
    console.log('🔄 Setting isAIConnected to false');
    setIsAIConnected(false);
    
    const disconnectMessage: Message = {
      id: messages.length + 1,
      type: 'ai',
      message: "Voice AI disconnected. You can reconnect anytime or continue with text chat.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, disconnectMessage]);
  };

  const handleAIError = (error: Error) => {
    console.error('💥 AI Assistant error occurred:', error);
    console.error('🔍 Error name:', error.name);
    console.error('🔍 Error message:', error.message);
    console.error('🔍 Error stack:', error.stack);
    
    const errorMessage: Message = {
      id: messages.length + 1,
      type: 'ai',
      message: `Sorry, I encountered an issue with voice AI: ${error.message}. Please try again or use text chat.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, errorMessage]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          AI Trip Planner
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Chat Messages */}
      <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.type === 'user' ? styles.userMessage : styles.aiMessage,
            ]}
          >
            {message.type === 'ai' && (
              <View style={styles.aiAvatar}>
                <Text style={styles.aiAvatarText}>AI</Text>
              </View>
            )}
            <View
              style={[
                styles.messageBubble,
                message.type === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  { color: message.type === 'user' ? '#fff' : Colors[colorScheme ?? 'light'].text }
                ]}
              >
                {message.message}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  { color: message.type === 'user' ? 'rgba(255,255,255,0.7)' : Colors[colorScheme ?? 'light'].tabIconDefault }
                ]}
              >
                {message.timestamp}
              </Text>
            </View>
          </View>
        ))}

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <View style={styles.suggestionsContainer}>
            <Text style={[styles.suggestionsTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Popular Trip Ideas
            </Text>
            <View style={styles.suggestionsGrid}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionCard}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Trip Planning Tools */}
        <View style={styles.toolsContainer}>
          <Text style={[styles.toolsTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Planning Tools
          </Text>
          <View style={styles.toolsGrid}>
            <TouchableOpacity style={[styles.toolCard, { backgroundColor: '#667eea' }]}>
              <MapPin size={24} color="#fff" />
              <Text style={styles.toolText}>Destinations</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toolCard, { backgroundColor: '#f093fb' }]}>
              <Calendar size={24} color="#fff" />
              <Text style={styles.toolText}>Dates</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toolCard, { backgroundColor: '#4facfe' }]}>
              <Users size={24} color="#fff" />
              <Text style={styles.toolText}>Travelers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toolCard, { backgroundColor: '#43e97b' }]}>
              <DollarSign size={24} color="#fff" />
              <Text style={styles.toolText}>Budget</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Destinations */}
        <View style={styles.featuredContainer}>
          <Text style={[styles.featuredTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Trending Destinations
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.featuredList}>
              {[
                { name: 'Tokyo, Japan', image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400' },
                { name: 'Paris, France', image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400' },
                { name: 'Bali, Indonesia', image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=400' },
              ].map((destination, index) => (
                <TouchableOpacity key={index} style={styles.featuredCard}>
                  <Image source={{ uri: destination.image }} style={styles.featuredImage} />
                  <Text style={styles.featuredName}>{destination.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Voice AI Component - Show when in voice mode */}
      {isVoiceMode  && (
                <View style={styles.domComponentContainer}>
                <ConversationalAIDOMComponent
                  dom={{ style: styles.domComponent }}
                  platform={Platform.OS}
                  get_battery_level={() => 100}
                  change_brightness={() => {}}
                  flash_screen={() => {}}
                  onMessage={(message) => {
                    console.log("🔍 Parent received message:", message);
                    setMessages(prev => [...prev, message as unknown as Message]);
                  }}
                />
              </View>
      )}

      {/* Input Area */}
      <View style={[styles.inputContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        {/* Voice Mode Toggle */}
        {Platform.select({ web: false, default: true }) && (
          <View style={styles.voiceModeContainer}>
            <TouchableOpacity
              style={[
                styles.voiceModeToggle,
                isVoiceMode && styles.voiceModeToggleActive,
              ]}
              onPress={handleVoiceModeToggle}
            >
              <Text style={[
                styles.voiceModeText,
                { color: isVoiceMode ? '#fff' : Colors[colorScheme ?? 'light'].text }
              ]}>
                {isVoiceMode ? '🎤 Voice AI Active' : '💬 Text Mode'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputRow}>
          <TouchableOpacity
            style={[
              styles.voiceButton,
              (isVoiceMode && isAIConnected) && styles.voiceButtonActive,
            ]}
            onPress={Platform.select({ web: undefined, default: handleVoiceModeToggle })}
            disabled={Platform.select({ web: true, default: false })}
          >
            <Mic size={20} color={(isVoiceMode && isAIConnected) ? '#fff' : Colors[colorScheme ?? 'light'].tint} />
          </TouchableOpacity>
          <TextInput
            style={[
              styles.textInput,
              { 
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].tabIconDefault + '30',
              }
            ]}
            placeholder={isVoiceMode ? "Voice mode active - speak to the AI above" : "Ask me anything about your trip..."}
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isVoiceMode}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() && !isVoiceMode && styles.sendButtonActive,
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isVoiceMode}
          >
            <Send size={20} color={inputText.trim() && !isVoiceMode ? '#fff' : Colors[colorScheme ?? 'light'].tabIconDefault} />
          </TouchableOpacity>
        </View>

        {Platform.select({ web: true, default: false }) && (
          <Text style={[styles.webOnlyNote, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            Voice AI is available on mobile platforms (iOS & Android)
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  domComponentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  domComponent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 32,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  aiAvatarText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#667eea',
    marginLeft: 'auto',
  },
  aiBubble: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
  },
  suggestionsContainer: {
    marginVertical: 20,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionCard: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  suggestionText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '500',
  },
  toolsContainer: {
    marginVertical: 20,
  },
  toolsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toolCard: {
    width: (width - 56) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  toolText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  featuredContainer: {
    marginVertical: 20,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  featuredList: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 20,
  },
  featuredCard: {
    width: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 80,
  },
  featuredName: {
    padding: 8,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonActive: {
    backgroundColor: '#667eea',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#667eea',
  },
  voiceAIContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceAIComponent: {
    width: '80%',
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  voiceModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  voiceModeToggle: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#667eea',
    borderRadius: 12,
    flex: 1,
  },
  voiceModeToggleActive: {
    backgroundColor: '#667eea',
  },
  voiceModeText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  webOnlyNote: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
});