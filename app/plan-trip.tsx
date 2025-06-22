import PaymentModal from '@/components/PaymentModal';
import { useApp } from '@/contexts/AppContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PlanTripScreen() {
  const { dispatch } = useApp();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    hotel: 'Bali Resort & Spa',
    airline: 'Singapore Airlines',
    food: 'Local cuisine',
    activities: ['Sightseeing', 'Beach relaxation'],
  });

  const tripDetails = {
    destination: 'Bali, Indonesia',
    duration: '7 days',
    basePrice: '45000',
    hotel: selectedOptions.hotel,
    airline: selectedOptions.airline,
    food: selectedOptions.food,
    activities: selectedOptions.activities,
  };

  const handleProceedToPayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = (method: string) => {
    const newTrip = {
      id: Date.now().toString(),
      destination: tripDetails.destination,
      airline: tripDetails.airline,
      hotel: tripDetails.hotel,
      price: `₹${tripDetails.basePrice}`,
      duration: tripDetails.duration,
      image: 'https://example.com/bali.jpg',
      status: 'upcoming' as const,
      date: '2024-03-15',
      paymentMethod: method,
    };

    dispatch({ type: 'ADD_TRIP', payload: newTrip });
    Alert.alert(
      'Trip Booked!',
      'Your trip has been successfully booked. Check your trips for details.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Plan Your Trip</Text>
      </View>

      <View style={styles.tripSummary}>
        <Text style={styles.summaryTitle}>Trip Summary</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Destination:</Text>
          <Text style={styles.summaryValue}>{tripDetails.destination}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Duration:</Text>
          <Text style={styles.summaryValue}>{tripDetails.duration}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Airline:</Text>
          <Text style={styles.summaryValue}>{tripDetails.airline}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Hotel:</Text>
          <Text style={styles.summaryValue}>{tripDetails.hotel}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Food:</Text>
          <Text style={styles.summaryValue}>{tripDetails.food}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Activities:</Text>
          <Text style={styles.summaryValue}>{tripDetails.activities.join(', ')}</Text>
        </View>
      </View>

      <View style={styles.customizationSection}>
        <Text style={styles.sectionTitle}>Customize Your Trip</Text>
        
        <View style={styles.optionGroup}>
          <Text style={styles.optionLabel}>Hotel Options</Text>
          <View style={styles.optionsContainer}>
            {['Bali Resort & Spa', 'Boutique Hotel', 'Luxury Villa'].map((hotel) => (
              <TouchableOpacity
                key={hotel}
                style={[
                  styles.optionButton,
                  selectedOptions.hotel === hotel && styles.selectedOption,
                ]}
                onPress={() => setSelectedOptions(prev => ({ ...prev, hotel }))}
              >
                <Text style={[
                  styles.optionText,
                  selectedOptions.hotel === hotel && styles.selectedOptionText,
                ]}>
                  {hotel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.optionGroup}>
          <Text style={styles.optionLabel}>Food Preferences</Text>
          <View style={styles.optionsContainer}>
            {['Local cuisine', 'Continental', 'Vegetarian', 'Fine dining'].map((food) => (
              <TouchableOpacity
                key={food}
                style={[
                  styles.optionButton,
                  selectedOptions.food === food && styles.selectedOption,
                ]}
                onPress={() => setSelectedOptions(prev => ({ ...prev, food }))}
              >
                <Text style={[
                  styles.optionText,
                  selectedOptions.food === food && styles.selectedOptionText,
                ]}>
                  {food}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.priceSection}>
        <Text style={styles.priceTitle}>Total Price</Text>
        <Text style={styles.price}>₹{tripDetails.basePrice}</Text>
      </View>

      <TouchableOpacity style={styles.proceedButton} onPress={handleProceedToPayment}>
        <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
      </TouchableOpacity>

      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={tripDetails.basePrice}
        onPaymentComplete={handlePaymentComplete}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4299E1',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  tripSummary: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#718096',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
  },
  customizationSection: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
  },
  optionGroup: {
    marginBottom: 24,
  },
  optionLabel: {
    fontSize: 16,
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
  priceSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  priceTitle: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#38A169',
  },
  proceedButton: {
    backgroundColor: '#38A169',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 