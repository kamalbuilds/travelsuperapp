import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PreferenceFormProps {
  onComplete: (preferences: UserPreferences) => void;
}

export interface UserPreferences {
  airlines: string[];
  hotelTypes: string[];
  foodChoices: string[];
  destinations: string[];
  activities: string[];
}

const PREFERENCE_OPTIONS = {
  airlines: ['Emirates', 'Qatar Airways', 'Singapore Airlines', 'Lufthansa', 'British Airways', 'Air India'],
  hotelTypes: ['Budget', 'Mid-range', 'Luxury', 'Boutique', 'Resort', 'Hostel'],
  foodChoices: ['Vegetarian', 'Non-vegetarian', 'Local cuisine', 'Continental', 'Street food', 'Fine dining'],
  destinations: ['Beach', 'Mountains', 'Cities', 'Cultural sites', 'Adventure', 'Relaxation'],
  activities: ['Sightseeing', 'Adventure sports', 'Relaxation', 'Cultural tours', 'Food tours', 'Shopping'],
};

export default function PreferenceForm({ onComplete }: PreferenceFormProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    airlines: [],
    hotelTypes: [],
    foodChoices: [],
    destinations: [],
    activities: [],
  });

  const togglePreference = (category: keyof UserPreferences, item: string) => {
    setPreferences(prev => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter(p => p !== item)
        : [...prev[category], item],
    }));
  };

  const isSelected = (category: keyof UserPreferences, item: string) => {
    return preferences[category].includes(item);
  };

  const renderPreferenceSection = (title: string, category: keyof UserPreferences, options: string[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              isSelected(category, option) && styles.selectedOption,
            ]}
            onPress={() => togglePreference(category, option)}
          >
            <Text style={[
              styles.optionText,
              isSelected(category, option) && styles.selectedOptionText,
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tell us about your preferences</Text>
      <Text style={styles.subtitle}>This helps us recommend the perfect trips for you</Text>

      {renderPreferenceSection('Preferred Airlines', 'airlines', PREFERENCE_OPTIONS.airlines)}
      {renderPreferenceSection('Hotel Types', 'hotelTypes', PREFERENCE_OPTIONS.hotelTypes)}
      {renderPreferenceSection('Food Preferences', 'foodChoices', PREFERENCE_OPTIONS.foodChoices)}
      {renderPreferenceSection('Destination Types', 'destinations', PREFERENCE_OPTIONS.destinations)}
      {renderPreferenceSection('Activities', 'activities', PREFERENCE_OPTIONS.activities)}

      <TouchableOpacity
        style={styles.completeButton}
        onPress={() => onComplete(preferences)}
      >
        <Text style={styles.completeButtonText}>Complete Setup</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedOption: {
    backgroundColor: '#4299E1',
    borderColor: '#4299E1',
  },
  optionText: {
    fontSize: 14,
    color: '#4A5568',
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: '500',
  },
  completeButton: {
    backgroundColor: '#38A169',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 