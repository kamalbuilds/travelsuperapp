import { router } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Mic,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Plane,
  Hotel,
  Camera,
  Utensils,
  Send,
} from 'lucide-react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width } = Dimensions.get('window');

const suggestions = [
  'Plan a romantic getaway to Paris',
  'Family vacation to Disney World',
  'Adventure trip to New Zealand',
  'Cultural tour of Japan',
  'Beach holiday in Maldives',
  'Safari in Kenya',
];

const aiResponses = [
  {
    id: 1,
    type: 'ai',
    message: "Hi! I'm your AI travel assistant. I'd love to help you plan the perfect trip! Where would you like to go?",
    timestamp: '2:30 PM',
  },
];

export default function TripPlanningScreen() {
  const colorScheme = useColorScheme();
  const [messages, setMessages] = useState(aiResponses);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        message: inputText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages([...messages, newMessage]);
      setInputText('');

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          type: 'ai',
          message: "Great choice! I can help you plan an amazing trip. Let me suggest some activities and accommodations. What's your budget range?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
  };

  const handleVoicePress = () => {
    setIsListening(!isListening);
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

      {/* Input Area */}
      <View style={[styles.inputContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.inputRow}>
          <TouchableOpacity
            style={[
              styles.voiceButton,
              isListening && styles.voiceButtonActive,
            ]}
            onPress={handleVoicePress}
          >
            <Mic size={20} color={isListening ? '#fff' : Colors[colorScheme ?? 'light'].tint} />
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
            placeholder="Ask me anything about your trip..."
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() && styles.sendButtonActive,
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Send size={20} color={inputText.trim() ? '#fff' : Colors[colorScheme ?? 'light'].tabIconDefault} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
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
});