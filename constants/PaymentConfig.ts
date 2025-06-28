import { Environments } from '@transak/react-native-sdk';
import { Platform } from 'react-native';

// Environment detection
export const IS_DEV = __DEV__;
export const IS_PROD = !__DEV__;

// RevenueCat Configuration
export const REVENUECAT_CONFIG = {
  ios: {
    apiKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || '',
    stripePlatformKey: process.env.EXPO_PUBLIC_STRIPE_PLATFORM_KEY || ''
  },
  android: {
    apiKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || '',
    stripePlatformKey: process.env.EXPO_PUBLIC_STRIPE_PLATFORM_KEY || ''
  },
  web: {
    stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    stripeSecretKey: process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY || '' // Backend only
  }
};

// Transak Crypto Payment Configuration
export const TRANSAK_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_TRANSAK_API_KEY || '',
  environment: IS_DEV ? Environments.STAGING : Environments.PRODUCTION,
  hostURL: IS_DEV ? 'https://staging-global.transak.com' : 'https://global.transak.com',
  widgetHeight: '650px',
  widgetWidth: '500px',
  // Avalanche network configuration
  defaultCryptoCurrency: 'AVAX',
  defaultNetwork: 'avalanche',
  supportedNetworks: ['avalanche', 'ethereum'],
  supportedCryptoCurrencies: ['AVAX', 'ETH', 'USDC', 'USDT'],
  // Payment methods
  defaultPaymentMethod: 'credit_debit_card',
  supportedPaymentMethods: ['credit_debit_card', 'bank_transfer', 'apple_pay', 'google_pay'],
  // KYC settings
  disableWalletAddressForm: false,
  hideMenu: true,
  hideExchangeScreen: false
};

// Avalanche Network Configuration
export const AVALANCHE_CONFIG = {
  mainnet: {
    chainId: 43114,
    name: 'Avalanche C-Chain',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    symbol: 'AVAX',
    decimals: 18,
    blockExplorerUrl: 'https://snowtrace.io'
  },
  testnet: {
    chainId: 43113,
    name: 'Avalanche Fuji Testnet',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    symbol: 'AVAX',
    decimals: 18,
    blockExplorerUrl: 'https://testnet.snowtrace.io'
  }
};

// Subscription Tiers and Pricing
export enum SubscriptionTier {
  BASIC = 'basic',
  PREMIUM = 'premium',
  VIP = 'vip'
}

export const SUBSCRIPTION_PLANS = {
  [SubscriptionTier.BASIC]: {
    name: 'Travel Explorer',
    description: 'Essential travel planning features',
    traditional: {
      monthly: { price: 9.99, productId: 'travel_basic_monthly' },
      yearly: { price: 99.99, productId: 'travel_basic_yearly' }
    },
    crypto: {
      monthly: { price: 0.5, currency: 'AVAX' }, // ~$10 worth
      yearly: { price: 5.0, currency: 'AVAX' }   // ~$100 worth
    },
    features: {
      flights: 'basic_search',
      hotels: 'basic_booking',
      experiences: false,
      concierge: false,
      priority_support: false,
      ai_agents: 'limited',
      voice_commands: false,
      offline_maps: false
    }
  },
  [SubscriptionTier.PREMIUM]: {
    name: 'Travel Professional',
    description: 'Enhanced travel planning with AI assistance',
    traditional: {
      monthly: { price: 24.99, productId: 'travel_premium_monthly' },
      yearly: { price: 249.99, productId: 'travel_premium_yearly' }
    },
    crypto: {
      monthly: { price: 1.25, currency: 'AVAX' }, // ~$25 worth
      yearly: { price: 12.5, currency: 'AVAX' }   // ~$250 worth
    },
    features: {
      flights: 'premium_search',
      hotels: 'premium_booking',
      experiences: 'basic_experiences',
      concierge: false,
      priority_support: true,
      ai_agents: 'full',
      voice_commands: true,
      offline_maps: true
    }
  },
  [SubscriptionTier.VIP]: {
    name: 'Travel Concierge',
    description: 'Ultimate travel experience with personal concierge',
    traditional: {
      monthly: { price: 49.99, productId: 'travel_vip_monthly' },
      yearly: { price: 499.99, productId: 'travel_vip_yearly' }
    },
    crypto: {
      monthly: { price: 2.5, currency: 'AVAX' }, // ~$50 worth
      yearly: { price: 25.0, currency: 'AVAX' }  // ~$500 worth
    },
    features: {
      flights: 'vip_search',
      hotels: 'vip_booking',
      experiences: 'premium_experiences',
      concierge: true,
      priority_support: true,
      ai_agents: 'unlimited',
      voice_commands: true,
      offline_maps: true
    }
  }
};

// Entitlements mapping for RevenueCat
export const REVENUECAT_ENTITLEMENTS = {
  [SubscriptionTier.BASIC]: 'travel_basic',
  [SubscriptionTier.PREMIUM]: 'travel_premium',
  [SubscriptionTier.VIP]: 'travel_vip'
};

// Backend API Configuration
export const BACKEND_CONFIG = {
  baseUrl: IS_DEV ? 'http://localhost:3000' : 'https://api.travelsuperapp.com',
  endpoints: {
    // RevenueCat integration
    validatePurchase: '/api/payments/validate-revenuecat',
    syncSubscription: '/api/payments/sync-subscription',

    // Crypto payment integration
    initiateCryptoPayment: '/api/payments/crypto/initiate',
    validateCryptoPayment: '/api/payments/crypto/validate',
    processCryptoPayment: '/api/payments/crypto/process',

    // Entitlements
    getUserEntitlements: '/api/users/entitlements',
    updateEntitlements: '/api/users/entitlements/update',

    // Webhooks (for backend)
    revenuecatWebhook: '/api/webhooks/revenuecat',
    transakWebhook: '/api/webhooks/transak'
  },
  timeout: 30000
};

// Webhook Configuration (for backend)
export const WEBHOOK_CONFIG = {
  revenuecat: {
    secretKey: process.env.REVENUECAT_WEBHOOK_SECRET || '',
    verifySignature: true
  },
  transak: {
    secretKey: process.env.TRANSAK_WEBHOOK_SECRET || '',
    verifySignature: true
  }
};

// Security Configuration
export const SECURITY_CONFIG = {
  encryption: {
    algorithm: 'AES-256-GCM',
    keyLength: 32
  },
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: '7d'
  },
  webhook: {
    tolerance: 300 // 5 minutes
  }
};

// Feature Flags
export const FEATURE_FLAGS = {
  enableCryptoPayments: true,
  enableStripeWebPayments: true,
  enableTransakOffRamp: true,
  enableSubscriptionTransfer: false, // Transfer between payment methods
  enableTrialPeriods: true,
  enablePromotionalCodes: true
};

// Get current platform configuration
export const getCurrentPlatformConfig = () => {
  const platform = Platform.OS;

  return {
    revenuecat: {
      apiKey: platform === 'ios' ? REVENUECAT_CONFIG.ios.apiKey : REVENUECAT_CONFIG.android.apiKey,
      stripePlatformKey: platform === 'ios' ? REVENUECAT_CONFIG.ios.stripePlatformKey : REVENUECAT_CONFIG.android.stripePlatformKey
    },
    avalanche: IS_DEV ? AVALANCHE_CONFIG.testnet : AVALANCHE_CONFIG.mainnet,
    transak: TRANSAK_CONFIG
  };
};

// Validation helpers
export const validateConfig = () => {
  const platform = Platform.OS;
  const errors: string[] = [];

  // Check RevenueCat configuration
  const rcApiKey = platform === 'ios' ? REVENUECAT_CONFIG.ios.apiKey : REVENUECAT_CONFIG.android.apiKey;
  if (!rcApiKey) {
    errors.push(`RevenueCat API key missing for ${platform}`);
  }

  // Check Transak configuration
  if (!TRANSAK_CONFIG.apiKey) {
    errors.push('Transak API key missing');
  }

  // Check backend configuration
  if (!BACKEND_CONFIG.baseUrl) {
    errors.push('Backend URL missing');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  REVENUECAT_CONFIG,
  TRANSAK_CONFIG,
  AVALANCHE_CONFIG,
  SUBSCRIPTION_PLANS,
  BACKEND_CONFIG,
  getCurrentPlatformConfig,
  validateConfig
}; 