import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import { Events, EventTypes, Order, TransakConfig, TransakWebView } from '@transak/react-native-sdk';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getCurrentPlatformConfig,
  SUBSCRIPTION_PLANS,
  SubscriptionTier
} from '../constants/PaymentConfig';
import {
  paymentManager,
  PaymentResult,
  UserEntitlements
} from '../utils/HybridPaymentManager';

const { width, height } = Dimensions.get('window');

interface HybridPaymentScreenProps {
  onSuccess?: (result: PaymentResult) => void;
  onError?: (error: string) => void;
  initialTier?: SubscriptionTier;
  onClose?: () => void;
}

export const HybridPaymentScreen: React.FC<HybridPaymentScreenProps> = ({
  onSuccess,
  onError,
  initialTier = SubscriptionTier.PREMIUM,
  onClose
}) => {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(initialTier);
  const [selectedDuration, setSelectedDuration] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'traditional' | 'crypto' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [offerings, setOfferings] = useState<any[]>([]);
  const [currentEntitlements, setCurrentEntitlements] = useState<UserEntitlements | null>(null);
  const [showTransakModal, setShowTransakModal] = useState(false);
  const [transakUrl, setTransakUrl] = useState<string>('');
  const colorScheme = useColorScheme();

  useEffect(() => {
    initializePaymentManager();
    loadOfferings();
    checkCurrentSubscription();
  }, []);

  const initializePaymentManager = async () => {
    try {
      await paymentManager.initialize();

      // Set up event listeners
      paymentManager.onPurchaseCompleted((result) => {
        setIsLoading(false);
        onSuccess?.(result);
        Alert.alert('Success!', `${paymentMethod === 'traditional' ? 'Traditional' : 'Crypto'} payment completed successfully.`);
      });

      paymentManager.onPurchaseFailed((result) => {
        setIsLoading(false);
        const errorMsg = result.error || 'Payment failed';
        onError?.(errorMsg);
        Alert.alert('Payment Failed', errorMsg);
      });

      paymentManager.onEntitlementsUpdated((entitlements) => {
        setCurrentEntitlements(entitlements);
      });

    } catch (error) {
      console.error('Failed to initialize payment manager:', error);
      // Alert.alert('Error', 'Failed to initialize payment system');
    }
  };

  const loadOfferings = async () => {
    try {
      const traditionalOfferings = await paymentManager.getTraditionalOfferings();
      const cryptoOfferings = paymentManager.getCryptoOfferings();

      setOfferings([...traditionalOfferings, ...cryptoOfferings]);
    } catch (error) {
      console.error('Failed to load offerings:', error);
    }
  };

  const checkCurrentSubscription = async () => {
    try {
      const entitlements = await paymentManager.checkSubscriptionStatus();
      setCurrentEntitlements(entitlements);
    } catch (error) {
      console.error('Failed to check subscription:', error);
    }
  };

  const handleTraditionalPurchase = async () => {
    setIsLoading(true);
    try {
      const plan = SUBSCRIPTION_PLANS[selectedTier];
      const productId = plan.traditional[selectedDuration].productId;

      await paymentManager.purchaseWithTraditionalPayment(productId, selectedTier);
    } catch (error) {
      setIsLoading(false);
      console.error('Traditional purchase failed:', error);
      Alert.alert('Purchase Failed', 'Unable to complete traditional payment');
    }
  };

  const handleCryptoPurchase = async () => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll show a mock Transak URL
      const config = getCurrentPlatformConfig();
      const plan = SUBSCRIPTION_PLANS[selectedTier];
      const cryptoPrice = plan.crypto[selectedDuration];

      // Generate mock Transak URL
      const mockTransakUrl = `${config.transak.hostURL}?` +
        `apiKey=${config.transak.apiKey}&` +
        `defaultCryptoCurrency=${cryptoPrice.currency}&` +
        `cryptoAmount=${cryptoPrice.price}&` +
        `defaultNetwork=avalanche&` +
        `hideMenu=true`;

      setTransakUrl(mockTransakUrl);
      setShowTransakModal(true);

      // Start the crypto purchase process
      await paymentManager.purchaseWithCrypto(selectedTier, selectedDuration);
    } catch (error) {
      setIsLoading(false);
      console.log("transak api key", process.env.EXPO_PUBLIC_TRANSAK_API_KEY);
      console.error('Crypto purchase failed:', error);
      Alert.alert('Purchase Failed', 'Unable to complete crypto payment');
    }
  };

  const handleRestorePurchases = async () => {
    setIsLoading(true);
    try {
      const success = await paymentManager.restorePurchases();
      if (success) {
        Alert.alert('Success', 'Purchases restored successfully');
        await checkCurrentSubscription();
      } else {
        Alert.alert('Error', 'Failed to restore purchases');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFeatureItem = (feature: string, value: any) => {
    if (value === false) return null;

    return (
      <View key={feature} style={styles.featureItem}>
        <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
        <Text style={[styles.featureText, { color: Colors[colorScheme ?? 'light'].icon }]}>
          {feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: {typeof value === 'string' ? value : 'Included'}
        </Text>
      </View>
    );
  };

  const renderSubscriptionPlan = (tier: SubscriptionTier) => {
    const plan = SUBSCRIPTION_PLANS[tier];
    const isSelected = selectedTier === tier;
    const isCurrentTier = currentEntitlements?.tier === tier;

    const traditionalPrice = plan.traditional[selectedDuration].price;
    const cryptoPrice = plan.crypto[selectedDuration];

    return (
      <TouchableOpacity
        key={tier}
        style={[
          styles.planCard,
          isSelected && styles.selectedPlan,
          isCurrentTier && styles.currentPlan
        ]}
        onPress={() => setSelectedTier(tier)}
      >
        <View style={styles.planHeader}>
          <Text style={[styles.planName, { color: Colors[colorScheme ?? 'light'].text }]}>{plan.name}</Text>
          {isCurrentTier && (
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>CURRENT</Text>
            </View>
          )}
        </View>

        <Text style={styles.planDescription}>{plan.description}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Traditional Payment:</Text>
          <Text style={styles.priceText}>${traditionalPrice}/{selectedDuration === 'monthly' ? 'month' : 'year'}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Crypto Payment:</Text>
          <Text style={styles.priceText}>{cryptoPrice.price} {cryptoPrice.currency}/{selectedDuration === 'monthly' ? 'month' : 'year'}</Text>
        </View>

        <View style={styles.featuresContainer}>
          {Object.entries(plan.features).map(([feature, value]) =>
            renderFeatureItem(feature, value)
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderWebViewModal = () => {
    const config = getCurrentPlatformConfig();

    const plan = SUBSCRIPTION_PLANS[selectedTier];
    const traditionalPrice = plan.traditional[selectedDuration];
    const cryptoPrice = plan.crypto[selectedDuration];

    console.log("crypto price", cryptoPrice, plan);

    const transakConfig: TransakConfig = {
      apiKey: process.env.EXPO_PUBLIC_TRANSAK_API_KEY!,
      environment: config.transak.environment,
      paymentMethod: "credit_debit_card",
      partnerOrderId: `order_${Date.now()}`,
      hideMenu: true,
      hideExchangeScreen: false,
      defaultFiatAmount: traditionalPrice.price,
      defaultFiatCurrency: 'USD',
      countryCode: 'US',
      defaultCryptoCurrency: 'AVAX',
      defaultNetwork: 'avaxcchain',
    };

    const handleEvent = (event: EventTypes, data: Order) => {
      switch (event) {
        case Events.ORDER_CREATED:
          console.log(event, data);
          break;

        case Events.ORDER_PROCESSING:
          console.log(event, data);
          break;

        case Events.ORDER_COMPLETED:
          console.log(event, data);
          break;

        default:
          console.log(event, data);
      }
    };
    return (
      <Modal
        visible={showTransakModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Complete Crypto Payment</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowTransakModal(false);
                setIsLoading(false);
              }}
            >
              <MaterialIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <TransakWebView
            transakConfig={transakConfig}
            onTransakEvent={handleEvent}
            mediaPlaybackRequiresUserAction={false}
            style={styles.webview}
          />

          {/* {transakUrl ? (
            <WebView
              source={{ uri: transakUrl }}
              style={styles.webview}
              onNavigationStateChange={(navState) => {
                // Handle navigation changes to detect completion
                if (navState.url.includes('success')) {
                  setShowTransakModal(false);
                  setIsLoading(false);
                  Alert.alert('Success', 'Crypto payment completed!');
                }
              }}
            />
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text>Loading payment interface...</Text>
            </View>
          )} */}
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>Choose Your Travel Plan</Text>
          <Text style={styles.subtitle}>
            Pay with traditional methods or cryptocurrency
          </Text>

          {currentEntitlements && (
            <View style={styles.currentSubscription}>
              <Text style={styles.currentSubscriptionText}>
                Current Plan: {SUBSCRIPTION_PLANS[currentEntitlements.tier].name}
                ({currentEntitlements.paymentMethod === 'traditional' ? 'Traditional' : 'Crypto'})
              </Text>
            </View>
          )}
        </View>

        {/* Duration Selection */}
        <View style={[styles.durationSelector, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <TouchableOpacity
            style={[
              styles.durationButton,
              selectedDuration === 'monthly' && styles.selectedDuration,
            ]}
            onPress={() => setSelectedDuration('monthly')}
          >
            <Text style={[
              styles.durationText,
              selectedDuration === 'monthly' && styles.selectedDurationText,
              { color: Colors[colorScheme ?? 'light'].text }
            ]}>
              Monthly
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.durationButton,
              selectedDuration === 'yearly' && styles.selectedDuration
            ]}
            onPress={() => setSelectedDuration('yearly')}
          >
            <Text style={[
              styles.durationText,
              selectedDuration === 'yearly' && styles.selectedDurationText,
              { color: Colors[colorScheme ?? 'light'].text }
            ]}>
              Yearly (Save 20%)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>
          {Object.keys(SUBSCRIPTION_PLANS).map((tier) =>
            renderSubscriptionPlan(tier as SubscriptionTier)
          )}
        </View>

        {/* Payment Method Selection */}
        <View style={styles.paymentMethodContainer}>
          <Text style={styles.sectionTitle}>Choose Payment Method</Text>

          <TouchableOpacity
            style={[
              styles.paymentMethodButton,
              paymentMethod === 'traditional' && styles.selectedPaymentMethod
            ]}
            onPress={() => setPaymentMethod('traditional')}
          >
            <MaterialIcons name="credit-card" size={24} color="#007AFF" />
            <Text style={styles.paymentMethodText}>Traditional Payment</Text>
            <Text style={styles.paymentMethodSubtext}>Credit Card, Apple Pay, Google Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentMethodButton,
              paymentMethod === 'crypto' && styles.selectedPaymentMethod
            ]}
            onPress={() => {
              setPaymentMethod('crypto');
              // router.push('/transak');
            }}
          >
            <MaterialIcons name="account-balance-wallet" size={24} color="#FF9500" />
            <Text style={styles.paymentMethodText}>Crypto Payment</Text>
            <Text style={styles.paymentMethodSubtext}>AVAX on Avalanche Network</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.purchaseButton, isLoading && styles.disabledButton]}
            onPress={paymentMethod === 'traditional' ? handleTraditionalPurchase : handleCryptoPurchase}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.purchaseButtonText}>
                {paymentMethod === 'traditional' ? 'Subscribe Now' : 'Pay with Crypto'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loadingButton]}
            onPress={onClose}
          >
            <Text style={[styles.loadingButtonText, { color: Colors[colorScheme ?? 'light'].text, backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestorePurchases}
            disabled={isLoading}
          >
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          </TouchableOpacity>
        </View>

        {/* WebView Modal for Transak */}
        {renderWebViewModal()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  },
  currentSubscription: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginTop: 16
  },
  currentSubscriptionText: {
    color: '#1976d2',
    fontWeight: '600',
    textAlign: 'center'
  },
  durationSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    padding: 4
  },
  durationButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6
  },
  selectedDuration: {
    backgroundColor: '#007AFF'
  },
  durationText: {
    fontSize: 16,
    fontWeight: '600',

  },
  selectedDurationText: {
    color: '#fff'
  },
  plansContainer: {
    paddingHorizontal: 20,
    marginBottom: 20
  },
  planCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0'
  },
  selectedPlan: {
    borderColor: '#007AFF'
  },
  currentPlan: {
    borderColor: '#4CAF50',
    backgroundColor: '#f8fff8'
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  planName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  currentBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  currentBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  planDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  priceLabel: {
    fontSize: 14,
    color: '#666'
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF'
  },
  featuresContainer: {
    marginTop: 16
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1
  },
  paymentMethodContainer: {
    paddingHorizontal: 20,
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16
  },
  paymentMethodButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectedPaymentMethod: {
    borderColor: '#007AFF'
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 12,
    flex: 1
  },
  paymentMethodSubtext: {
    fontSize: 12,
    color: '#666',
    marginLeft: 12,
    flex: 1
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40
  },
  purchaseButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16
  },
  loadingButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  loadingButtonText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  disabledButton: {
    opacity: 0.6
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 12
  },
  restoreButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  closeButton: {
    padding: 8
  },
  webview: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default HybridPaymentScreen; 