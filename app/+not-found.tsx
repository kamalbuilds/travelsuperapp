import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, ArrowLeft } from 'lucide-react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function NotFoundScreen() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Home size={64} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
          </View>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            Page Not Found
          </Text>
          <Text style={[styles.description, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            The page you're looking for doesn't exist or has been moved.
          </Text>
          <Link href="/" style={styles.link}>
            <View style={styles.linkButton}>
              <ArrowLeft size={20} color="#fff" />
              <Text style={styles.linkText}>Go to Home</Text>
            </View>
          </Link>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  link: {
    marginTop: 15,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});