import { EventEmitter } from 'events';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  MakePurchaseResult,
  PurchasesOffering,
  PurchasesPackage
} from 'react-native-purchases';
// import { Transak, TransakConfig } from '@transak/transak-sdk'; // Will implement as WebView
import axios from 'axios';
import { ethers } from 'ethers';

import {
  BACKEND_CONFIG,
  FEATURE_FLAGS,
  REVENUECAT_ENTITLEMENTS,
  SUBSCRIPTION_PLANS,
  SubscriptionTier,
  getCurrentPlatformConfig,
  validateConfig
} from '../constants/PaymentConfig';

// Types and Interfaces
export interface PaymentResult {
  success: boolean;
  tier?: SubscriptionTier;
  transactionId?: string;
  error?: string;
  paymentMethod: 'traditional' | 'crypto';
}

export interface UserEntitlements {
  tier: SubscriptionTier;
  features: Record<string, any>;
  expirationDate?: Date;
  isActive: boolean;
  paymentMethod: 'traditional' | 'crypto';
  lastUpdated: Date;
}

export interface CryptoPaymentData {
  orderId: string;
  cryptoAmount: number;
  cryptoCurrency: string;
  walletAddress: string;
  transactionHash?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface TransakConfig {
  apiKey: string;
  environment: string;
  defaultCryptoCurrency: string;
  defaultNetwork: string;
  cryptoAmount: number;
  walletAddress: string;
  hideMenu: boolean;
  hideExchangeScreen: boolean;
  widgetHeight: string;
  widgetWidth: string;
}

// Event types for the payment system
export class PaymentEvents extends EventEmitter {
  static readonly PURCHASE_STARTED = 'purchase_started';
  static readonly PURCHASE_COMPLETED = 'purchase_completed';
  static readonly PURCHASE_FAILED = 'purchase_failed';
  static readonly SUBSCRIPTION_UPDATED = 'subscription_updated';
  static readonly ENTITLEMENTS_UPDATED = 'entitlements_updated';
  static readonly CRYPTO_PAYMENT_INITIATED = 'crypto_payment_initiated';
  static readonly CRYPTO_PAYMENT_COMPLETED = 'crypto_payment_completed';
}

export class HybridPaymentManager {
  private static instance: HybridPaymentManager;
  private events = new PaymentEvents();
  private isInitialized = false;
  private currentUserEntitlements: UserEntitlements | null = null;
  private transakInstance: any | null = null; // WebView implementation
  private avalancheProvider: ethers.JsonRpcProvider | null = null;

  // Singleton pattern
  public static getInstance(): HybridPaymentManager {
    if (!HybridPaymentManager.instance) {
      HybridPaymentManager.instance = new HybridPaymentManager();
    }
    return HybridPaymentManager.instance;
  }

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Initialize the hybrid payment system
   * This sets up both RevenueCat and crypto payment capabilities
   */
  public async initialize(userId?: string): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🚀 Initializing Hybrid Payment Manager...');

      // Validate configuration
      const configValidation = validateConfig();
      if (!configValidation.isValid) {
        throw new Error(`Configuration errors: ${configValidation.errors.join(', ')}`);
      }

      const config = getCurrentPlatformConfig();

      // Initialize RevenueCat
      await this.initializeRevenueCat(config.revenuecat.apiKey, userId);

      // Initialize Avalanche provider
      await this.initializeAvalancheProvider(config.avalanche.rpcUrl);

      // Initialize Transak
      await this.initializeTransak();

      // Load user entitlements
      await this.loadUserEntitlements();

      this.isInitialized = true;
      console.log('✅ Hybrid Payment Manager initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize payment manager:', error);
      throw error;
    }
  }

  /**
   * Initialize RevenueCat SDK
   */
  private async initializeRevenueCat(apiKey: string, userId?: string): Promise<void> {
    try {
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      // Configure RevenueCat - note: userId should be set after configuration
      await Purchases.configure({ apiKey });
      
      if (userId) {
        await Purchases.logIn(userId);
      }

      // Set up RevenueCat event listeners
      Purchases.addCustomerInfoUpdateListener((customerInfo: CustomerInfo) => {
        this.handleRevenueCatUpdate(customerInfo);
      });

      console.log('✅ RevenueCat initialized');
    } catch (error) {
      console.error('❌ RevenueCat initialization failed:', error);
      throw error;
    }
  }

  /**
   * Initialize Avalanche provider for crypto operations
   */
  private async initializeAvalancheProvider(rpcUrl: string): Promise<void> {
    try {
      this.avalancheProvider = new ethers.JsonRpcProvider(rpcUrl);
      await this.avalancheProvider.getNetwork(); // Test connection
      console.log('✅ Avalanche provider initialized');
    } catch (error) {
      console.error('❌ Avalanche provider initialization failed:', error);
      throw error;
    }
  }

  /**
   * Initialize Transak SDK
   */
  private async initializeTransak(): Promise<void> {
    try {
      if (!FEATURE_FLAGS.enableCryptoPayments) {
        console.log('🚫 Crypto payments disabled by feature flag');
        return;
      }

      // Transak will be initialized on-demand when needed
      console.log('✅ Transak ready for initialization');
    } catch (error) {
      console.error('❌ Transak initialization failed:', error);
      throw error;
    }
  }

  /**
   * Get available subscription offerings from RevenueCat
   */
  public async getTraditionalOfferings(): Promise<PurchasesOffering[]> {
    try {
      const offerings = await Purchases.getOfferings();
      return Object.values(offerings.all);
    } catch (error) {
      console.error('❌ Failed to get RevenueCat offerings:', error);
      return [];
    }
  }

  /**
   * Get available crypto payment options
   */
  public getCryptoOfferings() {
    return Object.values(SUBSCRIPTION_PLANS).map(plan => ({
      tier: Object.keys(SUBSCRIPTION_PLANS).find(key => SUBSCRIPTION_PLANS[key as SubscriptionTier] === plan),
      name: plan.name,
      description: plan.description,
      crypto: plan.crypto,
      features: plan.features
    }));
  }

  /**
   * Purchase subscription using traditional payment methods (RevenueCat)
   */
  public async purchaseWithTraditionalPayment(
    packageId: string, 
    tier: SubscriptionTier
  ): Promise<PaymentResult> {
    try {
      this.events.emit(PaymentEvents.PURCHASE_STARTED, { method: 'traditional', tier });

      // Get offerings
      const offerings = await this.getTraditionalOfferings();
      let targetPackage: PurchasesPackage | null = null;

      // Find the package
      for (const offering of offerings) {
        targetPackage = offering.availablePackages.find(
          (pkg: PurchasesPackage) => pkg.identifier === packageId
        ) || null;
        if (targetPackage) break;
      }

      if (!targetPackage) {
        throw new Error(`Package ${packageId} not found`);
      }

      // Make the purchase
      const purchaseResult: MakePurchaseResult = await Purchases.purchasePackage(targetPackage);
      
      // Verify entitlement
      const entitlementId = REVENUECAT_ENTITLEMENTS[tier];
      const hasEntitlement = purchaseResult.customerInfo.entitlements.active[entitlementId] !== undefined;

      if (hasEntitlement) {
        // Sync with backend
        await this.syncTraditionalPurchaseWithBackend(purchaseResult, tier);
        
        // Update local entitlements
        await this.updateUserEntitlements(tier, 'traditional');

        const result: PaymentResult = {
          success: true,
          tier,
          transactionId: purchaseResult.transaction?.transactionIdentifier || 'unknown',
          paymentMethod: 'traditional'
        };

        this.events.emit(PaymentEvents.PURCHASE_COMPLETED, result);
        return result;
      } else {
        throw new Error('Purchase completed but entitlement not found');
      }

    } catch (error) {
      console.error('❌ Traditional purchase failed:', error);
      const result: PaymentResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Purchase failed',
        paymentMethod: 'traditional'
      };

      this.events.emit(PaymentEvents.PURCHASE_FAILED, result);
      return result;
    }
  }

  /**
   * Purchase subscription using crypto payments (Transak)
   */
  public async purchaseWithCrypto(
    tier: SubscriptionTier,
    duration: 'monthly' | 'yearly',
    walletAddress?: string
  ): Promise<PaymentResult> {
    try {
      if (!FEATURE_FLAGS.enableCryptoPayments) {
        throw new Error('Crypto payments are not enabled');
      }

      this.events.emit(PaymentEvents.PURCHASE_STARTED, { method: 'crypto', tier });

      const plan = SUBSCRIPTION_PLANS[tier];
      const cryptoPrice = plan.crypto[duration];

      // Initiate crypto payment with backend
      const paymentInitiation = await this.initiateCryptoPaymentWithBackend(
        tier,
        duration,
        cryptoPrice,
        walletAddress
      );

      // Launch Transak widget
      const transakResult = await this.launchTransakWidget({
        cryptoAmount: cryptoPrice.price,
        cryptoCurrency: cryptoPrice.currency,
        walletAddress: paymentInitiation.walletAddress,
        orderId: paymentInitiation.orderId,
        status: 'pending'
      });

      if (transakResult.success) {
        // Update local entitlements
        await this.updateUserEntitlements(tier, 'crypto');

        const result: PaymentResult = {
          success: true,
          tier,
          transactionId: transakResult.transactionHash,
          paymentMethod: 'crypto'
        };

        this.events.emit(PaymentEvents.PURCHASE_COMPLETED, result);
        return result;
      } else {
        throw new Error(transakResult.error || 'Crypto payment failed');
      }

    } catch (error) {
      console.error('❌ Crypto purchase failed:', error);
      const result: PaymentResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Crypto purchase failed',
        paymentMethod: 'crypto'
      };

      this.events.emit(PaymentEvents.PURCHASE_FAILED, result);
      return result;
    }
  }

  /**
   * Launch Transak widget for crypto payment
   */
  private async launchTransakWidget(paymentData: CryptoPaymentData): Promise<any> {
    return new Promise((resolve) => {
      const config = getCurrentPlatformConfig();
      
      const transakConfig: TransakConfig = {
        apiKey: config.transak.apiKey,
        environment: config.transak.environment,
        defaultCryptoCurrency: paymentData.cryptoCurrency,
        defaultNetwork: 'avalanche',
        cryptoAmount: paymentData.cryptoAmount,
        walletAddress: paymentData.walletAddress,
        hideMenu: true,
        hideExchangeScreen: false,
        widgetHeight: '600px',
        widgetWidth: '400px'
      };

      // For now, we'll use a WebView-based implementation
      // In a real implementation, you would use the Transak SDK or WebView
      
      // Simulate event listeners for demo
      setTimeout(() => {
        const orderData = {
          transactionHash: '0x' + Math.random().toString(16).substr(2, 8),
          status: 'successful'
        };
        
        console.log('✅ Transak order successful:', orderData);
        
        // Validate the crypto payment with backend
        this.validateCryptoPaymentWithBackend(
          paymentData.orderId,
          orderData.transactionHash
        ).then((validation) => {
          resolve({
            success: validation.success,
            transactionHash: orderData.transactionHash,
            error: validation.error
          });
        });
      }, 2000); // Simulate 2 second payment process
    });
  }

  /**
   * Check current subscription status from both sources
   */
  public async checkSubscriptionStatus(): Promise<UserEntitlements | null> {
    try {
      // Check RevenueCat first
      const customerInfo = await Purchases.getCustomerInfo();
      const traditionalTier = this.getTraditionalTierFromCustomerInfo(customerInfo);

      // Check crypto subscriptions from backend
      const cryptoEntitlements = await this.getCryptoEntitlementsFromBackend();

      // Determine the highest tier
      const highestTier = this.getHighestTier(traditionalTier, cryptoEntitlements.tier);

      if (highestTier !== SubscriptionTier.BASIC) {
        const entitlements: UserEntitlements = {
          tier: highestTier,
          features: SUBSCRIPTION_PLANS[highestTier].features,
          isActive: true,
          paymentMethod: traditionalTier === highestTier ? 'traditional' : 'crypto',
          lastUpdated: new Date()
        };

        this.currentUserEntitlements = entitlements;
        return entitlements;
      }

      return null;
    } catch (error) {
      console.error('❌ Failed to check subscription status:', error);
      return null;
    }
  }

  /**
   * Restore purchases from RevenueCat
   */
  public async restorePurchases(): Promise<boolean> {
    try {
      await Purchases.restorePurchases();
      await this.loadUserEntitlements();
      return true;
    } catch (error) {
      console.error('❌ Failed to restore purchases:', error);
      return false;
    }
  }

  /**
   * Get user's current entitlements
   */
  public getCurrentEntitlements(): UserEntitlements | null {
    return this.currentUserEntitlements;
  }

  /**
   * Check if user has access to a specific feature
   */
  public hasFeatureAccess(feature: string): boolean {
    if (!this.currentUserEntitlements?.isActive) return false;
    
    const features = this.currentUserEntitlements.features;
    return features[feature] !== false && features[feature] !== undefined;
  }

  /**
   * Event listener methods
   */
  public onPurchaseCompleted(callback: (result: PaymentResult) => void) {
    this.events.on(PaymentEvents.PURCHASE_COMPLETED, callback);
  }

  public onPurchaseFailed(callback: (result: PaymentResult) => void) {
    this.events.on(PaymentEvents.PURCHASE_FAILED, callback);
  }

  public onEntitlementsUpdated(callback: (entitlements: UserEntitlements) => void) {
    this.events.on(PaymentEvents.ENTITLEMENTS_UPDATED, callback);
  }

  // Private helper methods

  private async syncTraditionalPurchaseWithBackend(purchaseResult: MakePurchaseResult, tier: SubscriptionTier): Promise<void> {
    try {
      await axios.post(`${BACKEND_CONFIG.baseUrl}${BACKEND_CONFIG.endpoints.validatePurchase}`, {
        receipt: purchaseResult.transaction?.transactionIdentifier,
        tier,
        platform: Platform.OS,
        customerInfo: purchaseResult.customerInfo
      }, {
        timeout: BACKEND_CONFIG.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.warn('⚠️ Failed to sync traditional purchase with backend:', error);
      // Continue anyway - RevenueCat is the source of truth for traditional payments
    }
  }

  private async initiateCryptoPaymentWithBackend(
    tier: SubscriptionTier,
    duration: 'monthly' | 'yearly',
    cryptoPrice: any,
    walletAddress?: string
  ): Promise<any> {
    const response = await axios.post(`${BACKEND_CONFIG.baseUrl}${BACKEND_CONFIG.endpoints.initiateCryptoPayment}`, {
      tier,
      duration,
      cryptoPrice,
      walletAddress
    }, {
      timeout: BACKEND_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  }

  private async validateCryptoPaymentWithBackend(orderId: string, transactionHash?: string): Promise<any> {
    const response = await axios.post(`${BACKEND_CONFIG.baseUrl}${BACKEND_CONFIG.endpoints.validateCryptoPayment}`, {
      orderId,
      transactionHash
    }, {
      timeout: BACKEND_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  }

  private async getCryptoEntitlementsFromBackend(): Promise<any> {
    try {
      const response = await axios.get(`${BACKEND_CONFIG.baseUrl}${BACKEND_CONFIG.endpoints.getUserEntitlements}`, {
        timeout: BACKEND_CONFIG.timeout
      });
      return response.data;
    } catch (error) {
      console.warn('⚠️ Failed to get crypto entitlements from backend:', error);
      return { tier: SubscriptionTier.BASIC };
    }
  }

  private getTraditionalTierFromCustomerInfo(customerInfo: CustomerInfo): SubscriptionTier {
    const activeEntitlements = customerInfo.entitlements.active;
    
    if (activeEntitlements[REVENUECAT_ENTITLEMENTS[SubscriptionTier.VIP]]) {
      return SubscriptionTier.VIP;
    } else if (activeEntitlements[REVENUECAT_ENTITLEMENTS[SubscriptionTier.PREMIUM]]) {
      return SubscriptionTier.PREMIUM;
    }
    
    return SubscriptionTier.BASIC;
  }

  private getHighestTier(tier1: SubscriptionTier, tier2: SubscriptionTier): SubscriptionTier {
    const tierOrder = [SubscriptionTier.BASIC, SubscriptionTier.PREMIUM, SubscriptionTier.VIP];
    const index1 = tierOrder.indexOf(tier1);
    const index2 = tierOrder.indexOf(tier2);
    return tierOrder[Math.max(index1, index2)];
  }

  private async handleRevenueCatUpdate(customerInfo: CustomerInfo): Promise<void> {
    console.log('📱 RevenueCat customer info updated');
    const tier = this.getTraditionalTierFromCustomerInfo(customerInfo);
    await this.updateUserEntitlements(tier, 'traditional');
  }

  private async updateUserEntitlements(tier: SubscriptionTier, paymentMethod: 'traditional' | 'crypto'): Promise<void> {
    const entitlements: UserEntitlements = {
      tier,
      features: SUBSCRIPTION_PLANS[tier].features,
      isActive: tier !== SubscriptionTier.BASIC,
      paymentMethod,
      lastUpdated: new Date()
    };

    this.currentUserEntitlements = entitlements;
    
    // Store in secure storage
    await SecureStore.setItemAsync('user_entitlements', JSON.stringify(entitlements));
    
    this.events.emit(PaymentEvents.ENTITLEMENTS_UPDATED, entitlements);
  }

  private async loadUserEntitlements(): Promise<void> {
    try {
      const stored = await SecureStore.getItemAsync('user_entitlements');
      if (stored) {
        this.currentUserEntitlements = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('⚠️ Failed to load stored entitlements:', error);
    }

    // Always refresh from live sources
    await this.checkSubscriptionStatus();
  }
}

// Export singleton instance
export const paymentManager = HybridPaymentManager.getInstance();

