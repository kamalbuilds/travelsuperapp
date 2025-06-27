# Hybrid Payment System - RevenueCat + Crypto Payments

This implementation follows **Option #2: RevenueCat + Your Backend Code** architecture, providing both traditional and cryptocurrency payment options for subscription management.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Travel Super App                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │ RevenueCat SDK  │    │  Crypto Payment System         │ │
│  │                 │    │  (Transak + Avalanche)         │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                 Unified Entitlement System                  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │ Traditional     │    │  Custom Backend                 │ │
│  │ Payments        │    │  (Crypto Validation)            │ │
│  │ (App Store,     │    │                                 │ │
│  │  Google Play,   │    │                                 │ │
│  │  Stripe Web)    │    │                                 │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Features

### ✅ Traditional Payments (RevenueCat)
- **iOS**: App Store In-App Purchases
- **Android**: Google Play Billing
- **Web**: Stripe Checkout
- **Subscription Management**: Automatic renewal, cancellation, upgrades
- **Receipt Validation**: Server-side validation via RevenueCat
- **Restore Purchases**: Cross-device subscription restoration

### ✅ Crypto Payments (Transak + Avalanche)
- **AVAX Payments**: Native Avalanche cryptocurrency
- **Fiat to Crypto**: Seamless conversion via Transak
- **Multiple Payment Methods**: Credit cards, bank transfers, Apple Pay, Google Pay
- **Low Fees**: Avalanche network's low transaction costs
- **Transparency**: Full blockchain transaction visibility

### ✅ Unified Entitlement System
- **Single Source of Truth**: Unified access control across payment methods
- **Feature Gating**: Granular feature access based on subscription tier
- **Real-time Sync**: Instant entitlement updates across devices
- **Hybrid Support**: Users can have both traditional and crypto subscriptions

## 📋 Subscription Tiers

### 🌟 Basic (Travel Explorer) - $9.99/month or 0.5 AVAX/month
- Basic flight search
- Basic hotel booking
- Limited AI agents
- No premium features

### ⭐ Premium (Travel Professional) - $24.99/month or 1.25 AVAX/month
- Premium flight search
- Premium hotel booking
- Basic experiences
- Full AI agents
- Voice commands
- Offline maps
- Priority support

### 👑 VIP (Travel Concierge) - $49.99/month or 2.5 AVAX/month
- VIP search and booking
- Premium experiences
- Unlimited AI agents
- Personal concierge
- All premium features

## 🛠️ Implementation Files

### Core Payment System
- `constants/PaymentConfig.ts` - Configuration and pricing
- `utils/HybridPaymentManager.ts` - Main payment logic
- `components/HybridPaymentScreen.tsx` - Payment UI component

### UI Integration
- `app/(tabs)/profile.tsx` - Subscription management
- `app/(tabs)/wallet.tsx` - Crypto wallet integration
- `app/_layout.tsx` - Payment system initialization

### Dependencies Added
```json
{
  "react-native-purchases": "^8.11.7",
  "react-native-purchases-ui": "^8.11.7",
  "ethers": "^6.7.1",
  "expo-secure-store": "~14.1.1",
  "crypto-js": "^4.1.1",
  "@transak/transak-sdk": "^2.0.0"
}
```

## ⚙️ Configuration Setup

### 1. RevenueCat Setup
1. Create account at https://app.revenuecat.com/
2. Configure iOS/Android apps
3. Set up subscription products
4. Configure entitlements:
   - `travel_basic` - Basic tier
   - `travel_premium` - Premium tier  
   - `travel_vip` - VIP tier

### 2. Transak Setup
1. Register at https://transak.com/
2. Get API keys for staging/production
3. Configure supported cryptocurrencies (AVAX)
4. Set up webhook endpoints

### 3. Environment Variables
```bash
# RevenueCat
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=your_ios_key
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=your_android_key

# Transak
EXPO_PUBLIC_TRANSAK_API_KEY=your_transak_key

# Backend
EXPO_PUBLIC_API_BASE_URL=https://api.travelsuperapp.com
```

## 🔄 Payment Flow

### Traditional Payment Flow
1. User selects subscription tier
2. RevenueCat displays payment options
3. User completes purchase (App Store/Google Play/Stripe)
4. RevenueCat validates receipt
5. Backend syncs purchase data
6. Entitlements updated instantly

### Crypto Payment Flow
1. User selects subscription tier + crypto payment
2. Backend initiates payment session
3. Transak widget opens for crypto purchase
4. User buys AVAX with fiat currency
5. Transaction validated on Avalanche network
6. Backend processes crypto payment
7. Entitlements updated instantly

## 🔐 Security Features

### Receipt Validation
- Server-side validation for all traditional purchases
- RevenueCat webhook verification
- JWT-based authentication

### Crypto Security
- Blockchain transaction verification
- Wallet signature validation
- Secure key storage with Expo SecureStore
- Webhook signature verification

### Entitlement Protection
- Server-side entitlement validation
- Encrypted local storage
- Real-time sync with secure backend

## 🎯 Usage Examples

### Initialize Payment System
```typescript
import { paymentManager } from '@/utils/HybridPaymentManager';

// Initialize on app startup
await paymentManager.initialize(userId);
```

### Traditional Purchase
```typescript
const result = await paymentManager.purchaseWithTraditionalPayment(
  'travel_premium_monthly',
  SubscriptionTier.PREMIUM
);
```

### Crypto Purchase
```typescript
const result = await paymentManager.purchaseWithCrypto(
  SubscriptionTier.PREMIUM,
  'monthly',
  walletAddress
);
```

### Check Entitlements
```typescript
const entitlements = await paymentManager.checkSubscriptionStatus();
const hasFeature = paymentManager.hasFeatureAccess('voice_commands');
```

## 🚀 Backend Requirements

### Required Endpoints
```
POST /api/payments/validate-revenuecat
POST /api/payments/crypto/initiate
POST /api/payments/crypto/validate
GET  /api/users/entitlements
POST /api/webhooks/revenuecat
POST /api/webhooks/transak
```

### Database Schema
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  tier VARCHAR(50) NOT NULL,
  payment_method VARCHAR(20) NOT NULL, -- 'traditional' or 'crypto'
  status VARCHAR(20) NOT NULL,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crypto payments table
CREATE TABLE crypto_payments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  order_id VARCHAR(255) UNIQUE,
  transaction_hash VARCHAR(255),
  amount DECIMAL(18,8),
  currency VARCHAR(10),
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testing

### Traditional Payments
- Use RevenueCat sandbox environment
- Test with sandbox App Store/Google Play accounts
- Verify webhook delivery and processing

### Crypto Payments  
- Use Transak staging environment
- Test with Avalanche testnet (Fuji)
- Verify transaction validation and entitlement updates

### Integration Testing
- Test subscription tier changes
- Verify entitlement synchronization
- Test restore purchases functionality
- Validate webhook processing

## 🚀 Deployment Checklist

### Production Setup
- [ ] Configure production RevenueCat keys
- [ ] Set up production Transak API keys
- [ ] Deploy backend with proper SSL certificates
- [ ] Configure webhook endpoints with proper security
- [ ] Set up monitoring and alerting
- [ ] Test end-to-end payment flows
- [ ] Verify subscription management works correctly

### Monitoring
- RevenueCat dashboard for traditional payments
- Blockchain explorers for crypto transactions  
- Backend logs for webhook processing
- User entitlement status monitoring

## 📚 Additional Resources

- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [Transak Integration Guide](https://docs.transak.com/)
- [Avalanche Developer Docs](https://docs.avax.network/)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)

## 🎉 Benefits of This Architecture

### For Users
- **Flexibility**: Choose between traditional or crypto payments
- **Transparency**: Blockchain transactions are fully visible
- **Lower Fees**: Crypto payments have lower processing fees
- **Global Access**: Crypto payments work worldwide

### For Business
- **Revenue Optimization**: Multiple payment channels
- **Reduced Chargebacks**: Crypto payments are irreversible
- **Global Reach**: Access to crypto-native users
- **Future-Proof**: Ready for Web3 adoption

### For Developers
- **Clean Architecture**: Separation of concerns
- **Extensible**: Easy to add new payment methods
- **Reliable**: Built on proven infrastructure
- **Maintainable**: Well-documented and tested

This implementation provides a production-ready, scalable foundation for hybrid payment systems in modern mobile applications. 