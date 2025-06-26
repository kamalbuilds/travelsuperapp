import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Settings,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Mic,
  Video,
  Crown,
  LogOut,
  ChevronRight,
  Edit,
} from 'lucide-react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade to TravelPro',
      'Get unlimited AI conversations, video consultations, and premium features for $9.99/month',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade Now', onPress: () => console.log('Upgrade pressed') },
      ]
    );
  };

  const menuItems = [
    {
      icon: Settings,
      title: 'Account Settings',
      subtitle: 'Personal information and preferences',
      onPress: () => console.log('Account Settings'),
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Push notifications and alerts',
      onPress: () => console.log('Notifications'),
      rightComponent: (
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#767577', true: '#667eea' }}
          thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
        />
      ),
    },
    {
      icon: Mic,
      title: 'Voice Assistant',
      subtitle: 'AI voice settings and preferences',
      onPress: () => console.log('Voice Assistant'),
      rightComponent: (
        <Switch
          value={voiceEnabled}
          onValueChange={setVoiceEnabled}
          trackColor={{ false: '#767577', true: '#667eea' }}
          thumbColor={voiceEnabled ? '#fff' : '#f4f3f4'}
        />
      ),
    },
    {
      icon: Video,
      title: 'Video Consultations',
      subtitle: 'AI video agent preferences',
      onPress: () => console.log('Video Consultations'),
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      subtitle: 'Biometrics, passwords, and privacy',
      onPress: () => console.log('Security'),
      rightComponent: (
        <Switch
          value={biometricsEnabled}
          onValueChange={setBiometricsEnabled}
          trackColor={{ false: '#767577', true: '#667eea' }}
          thumbColor={biometricsEnabled ? '#fff' : '#f4f3f4'}
        />
      ),
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      subtitle: 'Cards and blockchain wallets',
      onPress: () => console.log('Payment Methods'),
    },
    {
      icon: Globe,
      title: 'Language & Region',
      subtitle: 'App language and currency',
      onPress: () => console.log('Language'),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            Profile
          </Text>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Edit size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: Colors[colorScheme ?? 'light'].text }]}>
                Sarah Johnson
              </Text>
              <Text style={[styles.userEmail, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                sarah.johnson@email.com
              </Text>
              <View style={styles.membershipBadge}>
                <Text style={styles.membershipText}>Free Plan</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
            <Crown size={20} color="#fff" />
            <Text style={styles.upgradeButtonText}>Upgrade</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors[colorScheme ?? 'light'].text }]}>12</Text>
            <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              Trips Planned
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors[colorScheme ?? 'light'].text }]}>8</Text>
            <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              Countries Visited
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors[colorScheme ?? 'light'].text }]}>156</Text>
            <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              AI Conversations
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                { backgroundColor: Colors[colorScheme ?? 'light'].background }
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: Colors[colorScheme ?? 'light'].tint + '20' }]}>
                  <item.icon size={20} color={Colors[colorScheme ?? 'light'].tint} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.menuItemSubtitle, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                    {item.subtitle}
                  </Text>
                </View>
              </View>
              {item.rightComponent || (
                <ChevronRight size={20} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Premium Features */}
        <View style={styles.premiumSection}>
          <View style={styles.premiumCard}>
            <View style={styles.premiumHeader}>
              <Crown size={24} color="#FFD700" />
              <Text style={styles.premiumTitle}>Unlock Premium Features</Text>
            </View>
            <Text style={styles.premiumDescription}>
              Get unlimited AI conversations, 24/7 video concierge, and exclusive travel deals
            </Text>
            <View style={styles.premiumFeatures}>
              <Text style={styles.premiumFeature}>• Unlimited AI conversations</Text>
              <Text style={styles.premiumFeature}>• Video travel consultations</Text>
              <Text style={styles.premiumFeature}>• Priority booking support</Text>
              <Text style={styles.premiumFeature}>• Advanced blockchain features</Text>
            </View>
            <TouchableOpacity style={styles.premiumButton} onPress={handleUpgrade}>
              <Text style={styles.premiumButtonText}>Start Free Trial</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
          onPress={() => Alert.alert('Logout', 'Are you sure you want to logout?')}
        >
          <LogOut size={20} color="#ff4757" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            TravelVoice AI v1.0.0
          </Text>
          <Text style={[styles.footerText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            Built with Bolt.new
          </Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileCard: {
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  membershipBadge: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  membershipText: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '500',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginHorizontal: 16,
  },
  menuSection: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
  },
  premiumSection: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  premiumCard: {
    backgroundColor: '#667eea',
    padding: 20,
    borderRadius: 16,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  premiumTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  premiumDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  premiumFeatures: {
    marginBottom: 20,
  },
  premiumFeature: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginBottom: 4,
  },
  premiumButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  premiumButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logoutText: {
    color: '#ff4757',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
  },
});