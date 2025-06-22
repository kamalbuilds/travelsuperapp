import PreferenceForm, { UserPreferences } from '@/components/PreferenceForm';
import { useApp } from '@/contexts/AppContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function OnboardingScreen() {
  const { dispatch } = useApp();
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
  });

  const handleUserInfoSubmit = () => {
    if (!userInfo.name.trim() || !userInfo.email.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setStep(2);
  };

  const handlePreferencesComplete = (preferences: UserPreferences) => {
    dispatch({ type: 'SET_PREFERENCES', payload: preferences });
    dispatch({ type: 'SET_USER', payload: userInfo });
    dispatch({ type: 'SET_ONBOARDED', payload: true });
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.container}>
      {step === 1 ? (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Welcome to WanderMate</Text>
          <Text style={styles.subtitle}>Let's get to know you better</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={userInfo.name}
              onChangeText={(text) => setUserInfo(prev => ({ ...prev, name: text }))}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={userInfo.email}
              onChangeText={(text) => setUserInfo(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.button} onPress={handleUserInfoSubmit}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <PreferenceForm onComplete={handlePreferencesComplete} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  stepContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#38A169',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 