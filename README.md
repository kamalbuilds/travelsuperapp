# WanderMate - Personalized Travel Planner

WanderMate is a comprehensive React Native travel planning application that collects user journey history and preferences to recommend and manage future trips. The app includes Reclaim Protocol integration for secure verification.

## Features

### 🏠 Home Screen
- Personalized trip recommendations based on user preferences
- Quick access to Reclaim verification
- Explore more destinations with rating system
- View upcoming trips

### 📋 Onboarding & Preferences
- User registration with name and email
- Comprehensive preference collection:
  - Preferred airlines
  - Hotel types (budget/luxury/boutique)
  - Food choices (veg/non-veg, local/continental)
  - Destination types (beach/mountains/culture)
  - Activities (sightseeing/adventure/relaxation)

### 🎯 Trip Planning
- AI-powered trip suggestions
- Customizable hotel, flight, food, and activity options
- Real-time pricing
- Trip summary and confirmation

### 💳 Payment Integration
- UPI payment support
- Crypto wallet integration (Metamask/WalletConnect)
- Secure payment processing

### ✈️ My Trips
- View upcoming and completed trips
- Rate completed trips
- Share travel experiences
- Trip status tracking

### 👤 Profile Management
- Edit travel preferences
- Manage payment methods
- App settings (notifications, dark mode)
- Account management

### 🔐 Reclaim Protocol Integration
- Secure identity verification
- Proof generation and validation
- Modal-based integration accessible from home screen

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: React Context API
- **Styling**: React Native StyleSheet
- **UI Components**: Custom components with modern design
- **Verification**: Reclaim Protocol SDK
- **Payments**: Mock UPI and Crypto integration

## Project Structure

```
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Home screen
│   │   ├── my-trips.tsx       # My trips screen
│   │   ├── profile.tsx        # Profile screen
│   │   └── _layout.tsx        # Tab navigation
│   ├── onboarding.tsx         # Onboarding flow
│   ├── plan-trip.tsx          # Trip planning screen
│   └── _layout.tsx            # Root layout
├── components/
│   ├── TripCard.tsx           # Trip display component
│   ├── PreferenceForm.tsx     # User preferences form
│   ├── PaymentModal.tsx       # Payment interface
│   ├── RecommendationCarousel.tsx # Trip recommendations
│   └── reclaim/
│       └── ReclaimModal.tsx   # Reclaim integration
├── contexts/
│   └── AppContext.tsx         # Global state management
└── constants/                 # App constants and colors
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd travelsuperapp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your preferred platform:
```bash
# iOS
npx expo run:ios

# Android
npx expo run:android

# Web
npx expo start --web
```

## Key Components

### TripCard
Reusable component for displaying trip information with:
- Destination image and details
- Airline and hotel information
- Pricing and duration
- Recommended badge support

### PreferenceForm
Multi-step form for collecting user preferences with:
- Interactive selection interface
- Category-based organization
- Real-time updates

### PaymentModal
Secure payment interface supporting:
- UPI payment processing
- Crypto wallet integration
- Payment confirmation

### ReclaimModal
Integration with Reclaim Protocol for:
- Identity verification
- Proof generation
- Secure data validation

## State Management

The app uses React Context API for global state management:

- **User Preferences**: Travel preferences and settings
- **Trip Data**: Upcoming and completed trips
- **Authentication**: User login status and information
- **Onboarding**: App setup completion status

## Styling

The app features a modern, clean design with:
- Warm color scheme (#F7FAFC background, #2D3748 text)
- Rounded corners and soft shadows
- Consistent spacing and typography
- Responsive layout design

## Future Enhancements

- Real API integration for trip data
- Advanced AI recommendations
- Social features and trip sharing
- Offline support
- Push notifications
- Advanced payment processing
- Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
