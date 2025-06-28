import { router } from 'expo-router';
import {
  Bell,
  Calendar,
  CreditCard,
  Hotel,
  MapPin,
  Plane,
  Sun
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TravelAgentManager, { AgentSession } from '@/agents/TravelAgentManager';
import { type Message } from '@/components/ChatMessage';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import MultiAgentTravelAI from '@/components/MultiAgentTravelAI';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [agentManager] = useState(() => new TravelAgentManager(process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY || ''));
  const [currentSession, setCurrentSession] = useState<AgentSession | null>(null);
  const [currentTrip, setCurrentTrip] = useState({
    destination: 'Tokyo, Japan',
    daysLeft: 12,
    weather: '22°C Sunny',
  });

  const handleAIMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);

    // Handle AI-suggested actions
    if (message.source === 'ai' && message.message.includes('Navigate to')) {
      // Extract navigation intent and route accordingly
      if (message.message.includes('trip-planning')) {
        setTimeout(() => router.push('/trip-planning'), 1000);
      } else if (message.message.includes('booking')) {
        setTimeout(() => router.push('/booking'), 1000);
      } else if (message.message.includes('emergency')) {
        setTimeout(() => router.push('/emergency'), 1000);
      }
    }
  };

  const quickActions = [
    {
      title: 'Plan Trip',
      icon: MapPin,
      color: '#667eea',
      onPress: () => router.push('/trip-planning'),
    },
    {
      title: 'Find Flights',
      icon: Plane,
      color: '#f093fb',
      onPress: () => router.push('/booking'),
    },
    {
      title: 'Book Hotels',
      icon: Hotel,
      color: '#4facfe',
      onPress: () => router.push('/booking'),
    },
    {
      title: 'Travel Wallet',
      icon: CreditCard,
      color: '#43e97b',
      onPress: () => router.push('/wallet'),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: Colors[colorScheme ?? 'light'].text }]}>
              Good morning!
            </Text>
            <Text style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Ready for your next adventure?
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
        </View>

        {/* Voice Assistant Button */}
        <View style={styles.voiceSection}>
          {/* <MultiAgentTravelAI
            agentManager={agentManager}
            userId="user_123" // Replace with actual user ID
            size="large"
            theme="primary"
            onAgentTransfer={(fromAgent, toAgent) => {
              console.log(`Transferred from ${fromAgent} to ${toAgent}`);
            }}
            onSessionUpdate={(session) => {
              setCurrentSession(session);
            }}
          /> */}
          <Text style={[styles.voiceText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Tap to speak with your AI travel assistant
          </Text>
          {currentSession && (
            <Text style={[styles.messageCount, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              {currentSession.conversationHistory.length} messages in current session
            </Text>
          )}
        </View>

        {/* Current Trip Card */}
        <View style={styles.currentTripCard}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.tripImage}
          />
          <View style={styles.tripOverlay}>
            <Text style={styles.tripTitle}>Next Trip</Text>
            <Text style={styles.tripDestination}>{currentTrip.destination}</Text>
            <View style={styles.tripDetails}>
              <View style={styles.tripDetailItem}>
                <Calendar size={16} color="#fff" />
                <Text style={styles.tripDetailText}>{currentTrip.daysLeft} days left</Text>
              </View>
              <View style={styles.tripDetailItem}>
                <Sun size={16} color="#fff" />
                <Text style={styles.tripDetailText}>{currentTrip.weather}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickActionCard, { backgroundColor: action.color }]}
                onPress={action.onPress}
              >
                <action.icon size={28} color="#fff" />
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentSection}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Recent Activity
          </Text>
          <View style={[styles.activityCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#667eea' }]}>
                <Plane size={20} color="#fff" />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Flight to Tokyo booked
                </Text>
                <Text style={[styles.activityTime, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                  2 hours ago
                </Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#f093fb' }]}>
                <Hotel size={20} color="#fff" />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Hotel reservation confirmed
                </Text>
                <Text style={[styles.activityTime, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                  1 day ago
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
  },
  voiceSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  voiceButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  voiceButtonActive: {
    backgroundColor: '#f093fb',
  },
  voiceText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  messageCount: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  currentTripCard: {
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
  },
  tripImage: {
    width: '100%',
    height: '100%',
  },
  tripOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },
  tripTitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  tripDestination: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  tripDetails: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  tripDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tripDetailText: {
    color: '#fff',
    fontSize: 14,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 56) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  activityCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 14,
    marginTop: 2,
  },
});