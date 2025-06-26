import { router } from 'expo-router';
import {
  AlertTriangle,
  ArrowLeft,
  Heart,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Shield,
  Video
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type Message } from '@/components/ChatMessage';
import TravelVoiceAI from '@/components/TravelVoiceAI';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const emergencyContacts = [
  {
    title: 'Emergency Services',
    number: '911',
    description: 'Police, Fire, Medical',
    icon: AlertTriangle,
    color: '#ff4757',
  },
  {
    title: 'Medical Emergency',
    number: '911',
    description: 'Ambulance & Hospital',
    icon: Heart,
    color: '#ff6b6b',
  },
  {
    title: 'Police',
    number: '911',
    description: 'Law Enforcement',
    icon: Shield,
    color: '#3742fa',
  },
  {
    title: 'Travel Insurance',
    number: '+1-800-555-0123',
    description: '24/7 Travel Assistance',
    icon: Phone,
    color: '#2ed573',
  },
];

const embassyContacts = [
  {
    country: 'US Embassy Tokyo',
    address: '1-10-5 Akasaka, Minato-ku, Tokyo',
    phone: '+81-3-3224-5000',
    emergency: '+81-3-3224-5000',
  },
  {
    country: 'US Consulate Osaka',
    address: '2-11-5 Nishitenma, Kita-ku, Osaka',
    phone: '+81-6-6315-5900',
    emergency: '+81-6-6315-5900',
  },
];

export default function EmergencyScreen() {
  const colorScheme = useColorScheme();
  const [currentLocation, setCurrentLocation] = useState('Tokyo, Japan');
  const [emergencyMessages, setEmergencyMessages] = useState<Message[]>([]);

  const handleEmergencyMessage = (message: Message) => {
    setEmergencyMessages(prev => [...prev, message]);
    
    // Auto-trigger emergency actions based on AI responses
    if (message.source === 'ai' && message.message.includes('🚨')) {
      // Flash screen or other emergency indicators
      console.log('Emergency situation detected by AI');
    }
  };

  const handleCall = (number: string) => {
    Alert.alert(
      'Emergency Call',
      `Call ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${number}`) },
      ]
    );
  };

  const handleVideoCall = () => {
    Alert.alert(
      'AI Emergency Assistant',
      'Connect with our AI video agent for immediate assistance?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Connect', onPress: () => console.log('Video call initiated') },
      ]
    );
  };

  const handleShareLocation = () => {
    Alert.alert(
      'Share Location',
      'Share your current location with emergency contacts?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => console.log('Location shared') },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            Emergency Assistance
          </Text>
          <View style={styles.headerRight} />
        </View>

        {/* Emergency Alert */}
        <View style={styles.alertContainer}>
          <View style={styles.alertIcon}>
            <AlertTriangle size={24} color="#fff" />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>24/7 Emergency Support</Text>
            <Text style={styles.alertDescription}>
              Get immediate help with our AI assistant or emergency contacts
            </Text>
          </View>
        </View>

        {/* AI Emergency Assistant */}
        <View style={styles.aiAssistantContainer}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            AI Emergency Assistant
          </Text>
          <View style={styles.aiAssistantCard}>
            <TravelVoiceAI
              onMessage={handleEmergencyMessage}
              size="large"
              variant="emergency"
              agentId="YOUR_EMERGENCY_AGENT_ID" // Replace with emergency-specific agent
            />
            <Text style={[styles.aiAssistantText, { color: Colors[colorScheme ?? 'light'].text }]}>
              Tap to speak for immediate emergency assistance
            </Text>
            {emergencyMessages.length > 0 && (
              <Text style={[styles.aiMessageCount, { color: '#EF4444' }]}>
                {emergencyMessages.length} emergency interaction{emergencyMessages.length > 1 ? 's' : ''}
              </Text>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard} onPress={handleVideoCall}>
              <Video size={32} color="#fff" />
              <Text style={styles.quickActionText}>AI Video Help</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard} onPress={handleShareLocation}>
              <MapPin size={32} color="#fff" />
              <Text style={styles.quickActionText}>Share Location</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Current Location */}
        <View style={styles.locationContainer}>
          <View style={styles.locationHeader}>
            <MapPin size={20} color={Colors[colorScheme ?? 'light'].tint} />
            <Text style={[styles.locationTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Current Location
            </Text>
          </View>
          <Text style={[styles.locationText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            {currentLocation}
          </Text>
          <TouchableOpacity style={styles.updateLocationButton}>
            <Navigation size={16} color={Colors[colorScheme ?? 'light'].tint} />
            <Text style={[styles.updateLocationText, { color: Colors[colorScheme ?? 'light'].tint }]}>
              Update Location
            </Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.contactsContainer}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Emergency Contacts
          </Text>
          {emergencyContacts.map((contact, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.contactCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
              onPress={() => handleCall(contact.number)}
            >
              <View style={[styles.contactIcon, { backgroundColor: contact.color }]}>
                <contact.icon size={24} color="#fff" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {contact.title}
                </Text>
                <Text style={[styles.contactDescription, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                  {contact.description}
                </Text>
                <Text style={[styles.contactNumber, { color: contact.color }]}>
                  {contact.number}
                </Text>
              </View>
              <Phone size={20} color={contact.color} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Embassy Information */}
        <View style={styles.embassyContainer}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Embassy Contacts
          </Text>
          {embassyContacts.map((embassy, index) => (
            <View
              key={index}
              style={[styles.embassyCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
            >
              <Text style={[styles.embassyName, { color: Colors[colorScheme ?? 'light'].text }]}>
                {embassy.country}
              </Text>
              <Text style={[styles.embassyAddress, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                {embassy.address}
              </Text>
              <View style={styles.embassyContacts}>
                <TouchableOpacity
                  style={styles.embassyContactButton}
                  onPress={() => handleCall(embassy.phone)}
                >
                  <Phone size={16} color={Colors[colorScheme ?? 'light'].tint} />
                  <Text style={[styles.embassyContactText, { color: Colors[colorScheme ?? 'light'].tint }]}>
                    Call
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.embassyContactButton}
                  onPress={() => handleCall(embassy.emergency)}
                >
                  <AlertTriangle size={16} color="#ff4757" />
                  <Text style={styles.emergencyContactText}>Emergency</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Safety Tips */}
        <View style={styles.tipsContainer}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Safety Tips
          </Text>
          <View style={[styles.tipsCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={[styles.tipText, { color: Colors[colorScheme ?? 'light'].text }]}>
                Always keep your passport and important documents secure
              </Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={[styles.tipText, { color: Colors[colorScheme ?? 'light'].text }]}>
                Share your itinerary with family or friends
              </Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={[styles.tipText, { color: Colors[colorScheme ?? 'light'].text }]}>
                Keep emergency contacts easily accessible
              </Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={[styles.tipText, { color: Colors[colorScheme ?? 'light'].text }]}>
                Know the local emergency numbers for your destination
              </Text>
            </View>
          </View>
        </View>

        {/* AI Assistant */}
        <View style={styles.aiAssistantContainer}>
          <View style={styles.aiAssistantCard}>
            <View style={styles.aiAssistantHeader}>
              <MessageCircle size={24} color="#fff" />
              <Text style={styles.aiAssistantTitle}>AI Emergency Assistant</Text>
            </View>
            <Text style={styles.aiAssistantDescription}>
              Get instant help with our AI assistant. Available 24/7 for emergency guidance and support.
            </Text>
            <TouchableOpacity style={styles.aiAssistantButton}>
              <Text style={styles.aiAssistantButtonText}>Chat with AI Assistant</Text>
            </TouchableOpacity>
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
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff4757',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 16,
    borderRadius: 12,
  },
  alertIcon: {
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alertDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  quickActionsContainer: {
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
    gap: 16,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#667eea',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  locationContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  locationText: {
    fontSize: 14,
    marginBottom: 12,
  },
  updateLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  updateLocationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  contactsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  embassyContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  embassyCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  embassyName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  embassyAddress: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  embassyContacts: {
    flexDirection: 'row',
    gap: 12,
  },
  embassyContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  embassyContactText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emergencyContactText: {
    color: '#ff4757',
    fontSize: 14,
    fontWeight: '500',
  },
  tipsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  tipsCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#667eea',
    marginTop: 6,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  aiAssistantContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  aiAssistantCard: {
    backgroundColor: '#667eea',
    padding: 20,
    borderRadius: 16,
  },
  aiAssistantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aiAssistantTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  aiAssistantDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  aiAssistantButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  aiAssistantButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});