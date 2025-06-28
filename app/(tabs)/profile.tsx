import { MaterialIcons } from '@expo/vector-icons';
import { Bell, ChevronRight, CreditCard, Crown, CreditCard as Edit, Globe, LogOut, Mic, Settings, Shield, Video } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HybridPaymentScreen from '@/components/HybridPaymentScreen';
import { Colors } from '@/constants/Colors';
import { SUBSCRIPTION_PLANS, SubscriptionTier } from '@/constants/PaymentConfig';
import { useColorScheme } from '@/hooks/useColorScheme';
import { paymentManager, UserEntitlements } from '@/utils/HybridPaymentManager';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [userEntitlements, setUserEntitlements] = useState<UserEntitlements | null>(null);
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();

    // Set up payment event listeners
    paymentManager.onEntitlementsUpdated((entitlements) => {
      setUserEntitlements(entitlements);
    });
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const entitlements = await paymentManager.checkSubscriptionStatus();
      setUserEntitlements(entitlements);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    setShowPaymentScreen(true);
  };

  const handleUpgradeSubscription = () => {
    setShowPaymentScreen(true);
  };

  const handleManageSubscription = () => {
    Alert.alert(
      'Manage Subscription',
      'What would you like to do?',
      [
        {
          text: 'Upgrade Plan',
          onPress: () => setShowPaymentScreen(true)
        },
        {
          text: 'Restore Purchases',
          onPress: async () => {
            const success = await paymentManager.restorePurchases();
            if (success) {
              Alert.alert('Success', 'Purchases restored successfully');
              await loadUserData();
            } else {
              Alert.alert('Error', 'Failed to restore purchases');
            }
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
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

  const renderSubscriptionStatus = () => {
    if (isLoading) {
      return (
        <View style={styles.subscriptionCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="star-border" size={24} color="#FF9500" />
            <Text style={styles.cardTitle}>Loading subscription status...</Text>
          </View>
        </View>
      );
    }

    if (!userEntitlements || !userEntitlements.isActive) {
      return (
        <View style={styles.subscriptionCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="star-border" size={24} color="#FF9500" />
            <Text style={styles.cardTitle}>No Active Subscription</Text>
          </View>
          <Text style={styles.cardDescription}>
            Upgrade to unlock premium travel features
          </Text>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={handleUpgradeSubscription}
          >
            <Text style={styles.upgradeButtonText}>Choose Plan</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const plan = SUBSCRIPTION_PLANS[userEntitlements.tier];

    return (
      <View style={styles.subscriptionCard}>
        <View style={styles.cardHeader}>
          <MaterialIcons
            name={userEntitlements.tier === SubscriptionTier.VIP ? "star" : "star-half"}
            size={24}
            color="#4CAF50"
          />
          <Text style={styles.cardTitle}>{plan.name}</Text>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>ACTIVE</Text>
          </View>
        </View>

        <Text style={styles.cardDescription}>{plan.description}</Text>

        <View style={styles.paymentMethodContainer}>
          <MaterialIcons
            name={userEntitlements.paymentMethod === 'traditional' ? "credit-card" : "account-balance-wallet"}
            size={16}
            color="#666"
          />
          <Text style={styles.paymentMethodText}>
            {userEntitlements.paymentMethod === 'traditional' ? 'Traditional Payment' : 'Crypto Payment'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.manageButton}
          onPress={handleManageSubscription}
        >
          <Text style={styles.manageButtonText}>Manage Subscription</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFeatureAccess = () => {
    if (!userEntitlements || !userEntitlements.isActive) {
      return null;
    }

    const features = userEntitlements.features;

    return (
      <View style={styles.featuresCard}>
        <Text style={styles.cardTitle}>Your Features</Text>

        {Object.entries(features).map(([feature, value]) => {
          if (value === false) return null;

          return (
            <View key={feature} style={styles.featureItem}>
              <MaterialIcons
                name="check-circle"
                size={20}
                color="#4CAF50"
              />
              <Text style={styles.featureText}>
                {feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Text>
              {typeof value === 'string' && (
                <Text style={styles.featureLevel}>({value})</Text>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  if (showPaymentScreen) {
    return (
      <HybridPaymentScreen
        onSuccess={(result) => {
          setShowPaymentScreen(false);
          Alert.alert('Success!', `Subscription activated with ${result.paymentMethod} payment`);
          loadUserData();
        }}
        onError={(error) => {
          setShowPaymentScreen(false);
          Alert.alert('Error', error);
        }}
        onClose={() => setShowPaymentScreen(false)}
      />
    );
  }

  const textColor = Colors[colorScheme ?? 'light'].text;
  const defaultBgColor = Colors[colorScheme ?? 'light'].background;
  const defaultIconColor = Colors[colorScheme ?? 'light'].tabIconDefault;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: defaultBgColor }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>
            Profile
          </Text>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: defaultBgColor }]}>
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
              <Text style={[styles.userName, { color: textColor }]}>
                Sarah Johnson
              </Text>
              <Text style={[styles.userEmail, { color: defaultIconColor }]}>
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
        <View style={[styles.statsContainer, { backgroundColor: defaultBgColor }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: textColor }]}>12</Text>
            <Text style={[styles.statLabel, { color: defaultIconColor }]}>
              Trips Planned
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: textColor }]}>8</Text>
            <Text style={[styles.statLabel, { color: defaultIconColor }]}>
              Countries Visited
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: textColor }]}>156</Text>
            <Text style={[styles.statLabel, { color: defaultIconColor }]}>
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
                { backgroundColor: defaultBgColor }
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: Colors[colorScheme ?? 'light'].tint + '20' }]}>
                  <item.icon size={20} color={Colors[colorScheme ?? 'light'].tint} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemTitle, { color: textColor }]}>
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

        {/* Subscription Status */}
        <View style={styles.subscriptionSection}>
          <Text style={[styles.subscriptionTitle, { color: textColor }]}>Subscription Status</Text>
          {renderSubscriptionStatus()}
        </View>

        {/* Feature Access */}
        <View style={styles.featureAccessSection}>
          <Text style={[styles.featureAccessTitle, { color: textColor }]}>Feature Access</Text>
          {renderFeatureAccess()}
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
    paddingVertical: 12,
    borderRadius: 14,
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
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)'
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
    backgroundColor: 'rgba(255,255,255,0.6)',
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
  subscriptionSection: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subscriptionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentMethodText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  manageButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  manageButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  featureLevel: {
    fontSize: 12,
    color: '#666',
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
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)'
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
  featureAccessSection: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  featureAccessTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});