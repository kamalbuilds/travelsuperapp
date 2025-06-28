import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, Globe, Wallet, Shield } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const onboardingSteps = [
  {
    id: 1,
    title: 'Welcome to TravelVoice AI',
    subtitle: 'Your intelligent travel companion powered by AI',
    description: 'Plan trips, book flights, and explore the world with voice-first technology',
    icon: Globe,
    gradient: ['#667eea', '#764ba2'],
  },
  {
    id: 2,
    title: 'Voice-First Experience',
    subtitle: 'Talk to your AI travel assistant',
    description: 'Simply speak to plan your perfect trip. Our AI understands natural conversation',
    icon: Mic,
    gradient: ['#f093fb', '#f5576c'],
  },
  {
    id: 3,
    title: 'Blockchain Travel Wallet',
    subtitle: 'Secure payments worldwide',
    description: 'Pay for travel expenses with cryptocurrency. Fast, secure, and borderless',
    icon: Wallet,
    gradient: ['#4facfe', '#00f2fe'],
  },
  {
    id: 4,
    title: 'Premium AI Features',
    subtitle: '24/7 travel concierge service',
    description: 'Upgrade for unlimited AI conversations and priority support',
    icon: Shield,
    gradient: ['#43e97b', '#38f9d7'],
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const step = onboardingSteps[currentStep];
  const IconComponent = step.icon;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={step.gradient}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <IconComponent size={60} color="#fff" strokeWidth={1.5} />
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.subtitle}>{step.subtitle}</Text>
            <Text style={styles.description}>{step.description}</Text>
          </View>

          <View style={styles.pagination}>
            {onboardingSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentStep && styles.activeDot,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 40,
  },
  skipButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '500',
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 24,
  },
  nextButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});