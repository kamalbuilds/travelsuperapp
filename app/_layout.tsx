import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated/lib/reanimated2/js-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { paymentManager } from '@/utils/HybridPaymentManager';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // Initialize payment system on app startup
    const initializePaymentSystem = async () => {
      try {
        await paymentManager.initialize();
        console.log('✅ Payment system initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize payment system:', error);
      }
    };

    initializePaymentSystem();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen 
          name="booking" 
          options={{ 
            title: 'Book Your Trip',
            headerShown: true 
          }} 
        />
        <Stack.Screen 
          name="onboarding" 
          options={{ 
            title: 'Welcome',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="trip-planning" 
          options={{ 
            title: 'Plan Your Trip',
            headerShown: true 
          }} 
        />
        <Stack.Screen 
          name="emergency" 
          options={{ 
            title: 'Emergency Assistance',
            headerShown: true 
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}