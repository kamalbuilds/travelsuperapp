import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { getCurrentPlatformConfig } from '@/constants/PaymentConfig';
import { useColorScheme } from '@/hooks/useColorScheme';
import { paymentManager, UserEntitlements } from '@/utils/HybridPaymentManager';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
interface WalletData {
  avaxBalance: string;
  usdValue: string;
  walletAddress?: string;
  isConnected: boolean;
}

export default function WalletScreen() {
  const [walletData, setWalletData] = useState<WalletData>({
    avaxBalance: '0.00',
    usdValue: '0.00',
    isConnected: false
  });
  const [userEntitlements, setUserEntitlements] = useState<UserEntitlements | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [avaxPrice, setAvaxPrice] = useState(20); // Mock price for demo
  const colorScheme = useColorScheme();

  useEffect(() => {
    loadWalletData();
    loadUserEntitlements();

    // Set up payment event listeners
    paymentManager.onEntitlementsUpdated((entitlements) => {
      setUserEntitlements(entitlements);
    });
  }, []);

  const loadWalletData = async () => {
    try {
      setIsLoading(true);

      // For demo purposes, we'll simulate wallet data
      // In a real app, you would connect to a wallet or use stored wallet info
      const mockWalletData: WalletData = {
        avaxBalance: (Math.random() * 10).toFixed(2),
        usdValue: (Math.random() * 200).toFixed(2),
        walletAddress: '0x742d35A6b85123...cd45B9C1f4A2e',
        isConnected: false // Set to false for demo
      };

      setWalletData(mockWalletData);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserEntitlements = async () => {
    try {
      const entitlements = await paymentManager.checkSubscriptionStatus();
      setUserEntitlements(entitlements);
    } catch (error) {
      console.error('Failed to load user entitlements:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      loadWalletData(),
      loadUserEntitlements()
    ]);
    setIsRefreshing(false);
  };

  const handleConnectWallet = () => {
    Alert.alert(
      'Connect Wallet',
      'Choose your preferred wallet to connect',
      [
        {
          text: 'MetaMask',
          onPress: () => simulateWalletConnection('MetaMask')
        },
        {
          text: 'WalletConnect',
          onPress: () => simulateWalletConnection('WalletConnect')
        },
        {
          text: 'Core Wallet',
          onPress: () => simulateWalletConnection('Core Wallet')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const simulateWalletConnection = async (walletType: 'MetaMask' | 'WalletConnect' | 'Core Wallet') => {
    // Simulate wallet connection
    setTimeout(() => {
      setWalletData(prev => ({
        ...prev,
        isConnected: true,
        walletAddress: '0x742d35A6b85123...cd45B9C1f4A2e',
        avaxBalance: (Math.random() * 50 + 10).toFixed(2),
        usdValue: ((Math.random() * 50 + 10) * avaxPrice).toFixed(2)
      }));
      Alert.alert('Success', `${walletType} connected successfully!`);
    }, 1500);
  };

  const handleDisconnectWallet = () => {
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            setWalletData(prev => ({
              ...prev,
              isConnected: false,
              walletAddress: undefined,
              avaxBalance: '0.00',
              usdValue: '0.00'
            }));
          }
        }
      ]
    );
  };

  const handleBuyAVAX = () => {
    Alert.alert(
      'Buy AVAX',
      'You can buy AVAX through various exchanges or use our integrated Transak service',
      [
        {
          text: 'Use Transak',
          onPress: () => {
            // This would open the Transak widget
            Alert.alert('Transak', 'Opening Transak widget to buy AVAX...');
          }
        },
        {
          text: 'External Exchange',
          onPress: () => {
            Alert.alert('Info', 'You can buy AVAX on exchanges like Coinbase, Binance, or directly through Avalanche DeFi protocols');
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const renderWalletStatus = () => {
    if (!walletData.isConnected) {
      return (
        <ThemedView style={styles.walletCard}>
          <ThemedView style={styles.cardHeader}>
            <MaterialIcons name="account-balance-wallet" size={32} color="#FF9500" />
            <ThemedText style={styles.cardTitle}>Connect Your Wallet</ThemedText>
          </ThemedView>
          <ThemedText style={styles.cardDescription}>
            Connect your Avalanche wallet to pay for subscriptions with AVAX
          </ThemedText>
          <TouchableOpacity
            style={styles.connectButton}
            onPress={handleConnectWallet}
          >
            <MaterialIcons name="link" size={20} color="#fff" />
            <ThemedText style={styles.connectButtonText}>Connect Wallet</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      );
    }

    return (
      <ThemedView style={styles.walletCard}>
        <ThemedView style={styles.cardHeader}>
          <MaterialIcons name="account-balance-wallet" size={32} color="#4CAF50" />
          <ThemedView style={styles.walletInfo}>
            <ThemedText style={styles.cardTitle}>Wallet Connected</ThemedText>
            <ThemedText style={styles.walletAddress}>{walletData.walletAddress}</ThemedText>
          </ThemedView>
          <TouchableOpacity onPress={handleDisconnectWallet}>
            <MaterialIcons name="power-settings-new" size={20} color="#FF5722" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.balanceContainer}>
          <ThemedView style={styles.balanceItem}>
            <ThemedText style={styles.balanceLabel}>AVAX Balance</ThemedText>
            <ThemedText style={styles.balanceValue}>{walletData.avaxBalance} AVAX</ThemedText>
          </ThemedView>

          <ThemedView style={styles.balanceItem}>
            <ThemedText style={styles.balanceLabel}>USD Value</ThemedText>
            <ThemedText style={styles.balanceValue}>${walletData.usdValue}</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleBuyAVAX}
          >
            <MaterialIcons name="add" size={20} color="#007AFF" />
            <ThemedText style={styles.actionButtonText}>Buy AVAX</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert('Send', 'Send AVAX feature coming soon')}
          >
            <MaterialIcons name="send" size={20} color="#007AFF" />
            <ThemedText style={styles.actionButtonText}>Send</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  };

  const renderSubscriptionPayments = () => {
    if (!userEntitlements || userEntitlements.paymentMethod !== 'crypto') {
      return null;
    }

    return (
      <ThemedView style={styles.subscriptionCard}>
        <ThemedView style={styles.cardHeader}>
          <MaterialIcons name="payment" size={24} color="#4CAF50" />
          <ThemedText style={styles.cardTitle}>Crypto Subscription</ThemedText>
        </ThemedView>

        <ThemedText style={styles.cardDescription}>
          Your subscription is paid with cryptocurrency
        </ThemedText>

        <ThemedView style={styles.subscriptionDetails}>
          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Plan:</ThemedText>
            <ThemedText style={styles.detailValue}>{userEntitlements.tier.toUpperCase()}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Payment Method:</ThemedText>
            <ThemedText style={styles.detailValue}>AVAX Cryptocurrency</ThemedText>
          </ThemedView>

          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Last Updated:</ThemedText>
            <ThemedText style={styles.detailValue}>
              {userEntitlements.lastUpdated.toLocaleDateString()}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  };

  const renderNetworkInfo = () => {
    const network = getCurrentPlatformConfig().avalanche;

    if (!walletData.isConnected) return null;

    return (
      <ThemedView style={styles.networkCard}>
        <ThemedView style={styles.cardHeader}>
          <MaterialIcons name="network-check" size={24} color="#E74C3C" />
          <ThemedText style={styles.cardTitle}>Avalanche Network</ThemedText>
        </ThemedView>

        <ThemedView style={styles.networkDetails}>
          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Network:</ThemedText>
            <ThemedText style={styles.detailValue}>{network.name}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Chain ID:</ThemedText>
            <ThemedText style={styles.detailValue}>{network.chainId}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Currency:</ThemedText>
            <ThemedText style={styles.detailValue}>{network.symbol}</ThemedText>
          </ThemedView>
        </ThemedView>

        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => Alert.alert('Explorer', `Opening ${network.blockExplorerUrl}`)}
        >
          <MaterialIcons name="open-in-new" size={16} color="#007AFF" />
          <ThemedText style={styles.exploreButtonText}>View on Explorer</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Loading wallet...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <ThemedView style={styles.header}>
          <ThemedText style={styles.headerTitle}>Crypto Wallet</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Manage your AVAX and crypto subscriptions
          </ThemedText>
        </ThemedView>

        {/* Body section */}
        {renderWalletStatus()}
        {renderSubscriptionPayments()}
        {renderNetworkInfo()}

        <ThemedView style={styles.infoCard}>
          <ThemedView style={styles.cardHeader}>
            <MaterialIcons name="info" size={24} color="#2196F3" />
            <ThemedText style={styles.cardTitle}>About Crypto Payments</ThemedText>
          </ThemedView>

          <ThemedText style={styles.infoText}>
            • Pay for subscriptions with AVAX cryptocurrency{'\n'}
            • Lower transaction fees on Avalanche network{'\n'}
            • Decentralized and secure payments{'\n'}
            • Full transparency on blockchain{'\n'}
            • No chargebacks or payment disputes
          </ThemedText>
        </ThemedView>


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666'
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    textAlign: 'center'
  },
  bodySection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignSelf: 'stretch',
  },
  walletCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    flex: 1
  },
  walletInfo: {
    flex: 1,
    marginLeft: 12
  },
  walletAddress: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20
  },
  connectButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8
  },
  balanceContainer: {
    flexDirection: 'row',
    marginBottom: 16
  },
  balanceItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginHorizontal: 4
  },
  balanceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a'
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF'
  },
  actionButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8
  },
  subscriptionCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  subscriptionDetails: {
    marginTop: 12
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  detailLabel: {
    fontSize: 14,
    color: '#666'
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a'
  },
  networkCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  networkDetails: {
    marginTop: 12,
    marginBottom: 16
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF'
  },
  exploreButtonText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4
  },
  infoCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 12
  }
});