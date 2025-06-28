import axios from 'axios';
import { Platform } from 'react-native';
import Purchases, { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';

// Payment types
export enum PaymentMethod {
  TRADITIONAL = 'traditional',
  CRYPTO = 'crypto'
}

export enum SubscriptionTier {
  BASIC = 'basic',
  PREMIUM = 'premium', 
  VIP = 'vip'
}

// Entitlements configuration
export const ENTITLEMENTS = {
  [SubscriptionTier.BASIC]: {
    flights: 'basic_search',
    hotels: 'basic_booking',
    experiences: false,
    concierge: false,
    priority_support: false
  },
  [SubscriptionTier.PREMIUM]: {
    flights: 'premium_search',
    hotels: 'premium_booking', 
    experiences: 'basic_experiences',
    concierge: false,
    priority_support: true
  },
  [SubscriptionTier.VIP]: {
    flights: 'vip_search',
    hotels: 'vip_booking',
    experiences: 'premium_experiences', 
    concierge: true,
    priority_support: true
  }
};

// RevenueCat Configuration
const REVENUECAT_CONFIG = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || '',
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || ''
};

// Transak Configuration  
const TRANSAK_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_TRANSAK_API_KEY || '',
  environment: __DEV__ ? 'STAGING' : 'PRODUCTION',
  cryptoCurrency: 'AVAX',
  network: 'avalanche',
  walletAddress: '' // Will be set dynamically
};

export interface PaymentProvider {
  initialize(): Promise<void>;
  getOfferings(): Promise<any[]>;
  purchasePackage(packageId: string, tier: SubscriptionTier): Promise<boolean>;
  checkSubscriptionStatus(): Promise<SubscriptionTier>;
  restorePurchases(): Promise<boolean>;
}

export class RevenueCatProvider implements PaymentProvider {
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Enable debug logs in development
      if (__DEV__) {
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      }

      // Configure RevenueCat
      const apiKey = Platform.OS === 'ios' ? REVENUECAT_CONFIG.ios : REVENUECAT_CONFIG.android;
      
      if (!apiKey) {
        throw new Error('RevenueCat API key not found');
      }

      await Purchases.configure({ apiKey });
      this.isInitialized = true;
      
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  async getOfferings(): Promise<PurchasesOffering[]> {
    await this.initialize();
    
    try {
      const offerings = await Purchases.getOfferings();
      return Object.values(offerings.all);
    } catch (error) {
      console.error('Failed to get RevenueCat offerings:', error);
      return [];
    }
  }

  async purchasePackage(packageId: string, tier: SubscriptionTier): Promise<boolean> {
    try {
      const offerings = await this.getOfferings();
      
      for (const offering of offerings) {
        const targetPackage = offering.availablePackages.find(
          (pkg: PurchasesPackage) => pkg.identifier === packageId
        );
        
        if (targetPackage) {
          const purchaseResult = await Purchases.purchasePackage(targetPackage);
          
          // Verify entitlement
          const hasEntitlement = purchaseResult.customerInfo.entitlements.active[tier] !== undefined;
          return hasEntitlement;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Purchase failed:', error);
      return false;
    }
  }

  async checkSubscriptionStatus(): Promise<SubscriptionTier> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const activeEntitlements = customerInfo.entitlements.active;
      
      if (activeEntitlements[SubscriptionTier.VIP]) {
        return SubscriptionTier.VIP;
      } else if (activeEntitlements[SubscriptionTier.PREMIUM]) {
        return SubscriptionTier.PREMIUM;
      } else {
        return SubscriptionTier.BASIC;
      }
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      return SubscriptionTier.BASIC;
    }
  }

  async restorePurchases(): Promise<boolean> {
    try {
      await Purchases.restorePurchases();
      return true;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      return false;
    }
  }
}

export class CryptoPaymentProvider implements PaymentProvider {
  private walletAddress: string = '';
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Initialize crypto wallet connection here
      // This would integrate with your wallet solution
      this.isInitialized = true;
      console.log('Crypto payment provider initialized');
    } catch (error) {
      console.error('Failed to initialize crypto provider:', error);
      throw error;
    }
  }

  async getOfferings(): Promise<any[]> {
    // Return crypto-based offerings
    return [
      {
        id: 'crypto_premium_monthly',
        tier: SubscriptionTier.PREMIUM,
        price: '10 AVAX',
        duration: '1 month',
        features: ENTITLEMENTS[SubscriptionTier.PREMIUM]
      },
      {
        id: 'crypto_vip_monthly', 
        tier: SubscriptionTier.VIP,
        price: '25 AVAX',
        duration: '1 month',
        features: ENTITLEMENTS[SubscriptionTier.VIP]
      }
    ];
  }

  async purchasePackage(packageId: string, tier: SubscriptionTier): Promise<boolean> {
    try {
      // Launch Transak widget for crypto purchase
      const transakUrl = this.buildTransakUrl(packageId, tier);
      
      // Open Transak in WebView or external browser
      // After successful payment, verify on your backend
      const paymentResult = await this.processTransakPayment(transakUrl);
      
      if (paymentResult.success) {
        // Update entitlements in your backend
        await this.updateCryptoEntitlements(tier, paymentResult.transactionHash);
        return true;
      }
      
      return false;
    } catch (error) {
      console.log("transak api key payment system payment provider", process.env.EXPO_PUBLIC_TRANSAK_API_KEY);
      console.error('Crypto purchase failed:', error);
      return false;
    }
  }

  async checkSubscriptionStatus(): Promise<SubscriptionTier> {
    try {
      // Check subscription status from your backend
      const response = await axios.get('/api/user/subscription-status', {
        params: { walletAddress: this.walletAddress }
      });
      
      return response.data.tier || SubscriptionTier.BASIC;
    } catch (error) {
      console.error('Failed to check crypto subscription status:', error);
      return SubscriptionTier.BASIC;
    }
  }

  async restorePurchases(): Promise<boolean> {
    try {
      // Restore crypto purchases by checking blockchain transactions
      const response = await axios.post('/api/user/restore-crypto-purchases', {
        walletAddress: this.walletAddress
      });
      
      return response.data.success;
    } catch (error) {
      console.error('Failed to restore crypto purchases:', error);
      return false;
    }
  }

  private buildTransakUrl(packageId: string, tier: SubscriptionTier): string {
    const amount = this.getPackageAmount(packageId);
    
    const params = new URLSearchParams({
      apiKey: TRANSAK_CONFIG.apiKey,
      environment: TRANSAK_CONFIG.environment,
      productsAvailed: 'BUY',
      cryptoCurrencyCode: TRANSAK_CONFIG.cryptoCurrency,
      network: TRANSAK_CONFIG.network,
      walletAddress: this.walletAddress,
      defaultCryptoAmount: amount.toString(),
      hideMenu: 'true',
      themeColor: '#2563eb' // Your brand color
    });

    return `https://global.transak.com/?${params.toString()}`;
  }

  private getPackageAmount(packageId: string): number {
    const packagePrices = {
      'crypto_premium_monthly': 10,
      'crypto_vip_monthly': 25
    };
    
    return packagePrices[packageId] || 10;
  }

  private async processTransakPayment(transakUrl: string): Promise<any> {
    // Implementation would depend on how you handle the Transak flow
    // This could be a WebView modal or external browser
    return { success: false, transactionHash: '' };
  }

  private async updateCryptoEntitlements(tier: SubscriptionTier, transactionHash: string): Promise<void> {
    try {
      await axios.post('/api/user/update-entitlements', {
        walletAddress: this.walletAddress,
        tier,
        transactionHash,
        paymentMethod: PaymentMethod.CRYPTO
      });
    } catch (error) {
      console.error('Failed to update crypto entitlements:', error);
      throw error;
    }
  }

  setWalletAddress(address: string): void {
    this.walletAddress = address;
  }
}

// Unified Payment Manager
export class PaymentManager {
  private revenueCatProvider: RevenueCatProvider;
  private cryptoProvider: CryptoPaymentProvider;
  private currentTier: SubscriptionTier = SubscriptionTier.BASIC;

  constructor() {
    this.revenueCatProvider = new RevenueCatProvider();
    this.cryptoProvider = new CryptoPaymentProvider();
  }

  async initialize(): Promise<void> {
    await Promise.all([
      this.revenueCatProvider.initialize(),
      this.cryptoProvider.initialize()
    ]);
    
    // Check current subscription status from both providers
    await this.refreshSubscriptionStatus();
  }

  async getTraditionalOfferings(): Promise<PurchasesOffering[]> {
    return this.revenueCatProvider.getOfferings();
  }

  async getCryptoOfferings(): Promise<any[]> {
    return this.cryptoProvider.getOfferings();
  }

  async purchaseWithTraditionalPayment(packageId: string, tier: SubscriptionTier): Promise<boolean> {
    const success = await this.revenueCatProvider.purchasePackage(packageId, tier);
    if (success) {
      this.currentTier = tier;
    }
    return success;
  }

  async purchaseWithCrypto(packageId: string, tier: SubscriptionTier, walletAddress: string): Promise<boolean> {
    this.cryptoProvider.setWalletAddress(walletAddress);
    const success = await this.cryptoProvider.purchasePackage(packageId, tier);
    if (success) {
      this.currentTier = tier;
    }
    return success;
  }

  async refreshSubscriptionStatus(): Promise<SubscriptionTier> {
    // Check both traditional and crypto subscriptions
    const [traditionalTier, cryptoTier] = await Promise.all([
      this.revenueCatProvider.checkSubscriptionStatus(),
      this.cryptoProvider.checkSubscriptionStatus()
    ]);

    // Return the higher tier between the two
    const tierPriority = {
      [SubscriptionTier.BASIC]: 0,
      [SubscriptionTier.PREMIUM]: 1,
      [SubscriptionTier.VIP]: 2
    };

    const highestTier = tierPriority[traditionalTier] > tierPriority[cryptoTier] 
      ? traditionalTier 
      : cryptoTier;

    this.currentTier = highestTier;
    return highestTier;
  }

  getCurrentTier(): SubscriptionTier {
    return this.currentTier;
  }

  hasAccess(feature: string): boolean {
    const currentEntitlements = ENTITLEMENTS[this.currentTier];
    return currentEntitlements[feature] !== false;
  }

  async restoreAllPurchases(): Promise<boolean> {
    const [traditionalRestored, cryptoRestored] = await Promise.all([
      this.revenueCatProvider.restorePurchases(),
      this.cryptoProvider.restorePurchases()
    ]);

    if (traditionalRestored || cryptoRestored) {
      await this.refreshSubscriptionStatus();
      return true;
    }

    return false;
  }
}

// Singleton instance
export const paymentManager = new PaymentManager(); 