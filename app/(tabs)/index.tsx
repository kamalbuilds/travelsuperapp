import RecommendationCarousel from '@/components/RecommendationCarousel';
import TripCard from '@/components/TripCard';
import ReclaimModal from '@/components/reclaim/ReclaimModal';
import { useApp } from '@/contexts/AppContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Mock data for recommendations
const mockRecommendations = [
  {
    id: '1',
    title: 'Bali Paradise',
    description: 'Experience the perfect blend of culture and relaxation',
    price: '₹45,000',
    image: 'https://example.com/bali.jpg',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Swiss Alps Adventure',
    description: 'Mountain adventures and scenic beauty',
    price: '₹75,000',
    image: 'https://example.com/swiss.jpg',
    rating: 4.9,
  },
  {
    id: '3',
    title: 'Tokyo Explorer',
    description: 'Modern city life with traditional culture',
    price: '₹65,000',
    image: 'https://example.com/tokyo.jpg',
    rating: 4.7,
  },
];

const mockTrips = [
  {
    id: '1',
    destination: 'Bali, Indonesia',
    airline: 'Singapore Airlines',
    hotel: 'Bali Resort & Spa',
    price: '₹45,000',
    duration: '7 days',
    image: 'https://example.com/bali.jpg',
    status: 'upcoming' as const,
    date: '2024-03-15',
  },
  {
    id: '2',
    destination: 'Swiss Alps',
    airline: 'Lufthansa',
    hotel: 'Mountain View Lodge',
    price: '₹75,000',
    duration: '10 days',
    image: 'https://example.com/swiss.jpg',
    status: 'upcoming' as const,
    date: '2024-04-20',
  },
];

export default function HomeScreen() {
  const { state, dispatch } = useApp();
  const [showReclaimModal, setShowReclaimModal] = useState(false);

  const handlePlanTrip = () => {
    router.push('/plan-trip');
  };

  const handleTripPress = (trip: any) => {
    router.push(`/trip-details/${trip.id}`);
  };

  const handleRecommendationPress = (recommendation: any) => {
    // Navigate to plan trip with pre-filled data
    router.push('/plan-trip');
  };

  const handleReclaimVerification = () => {
    setShowReclaimModal(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {state.currentUser?.name || 'Traveler'}! 👋
        </Text>
        <Text style={styles.subtitle}>Ready for your next adventure?</Text>
      </View>

      {/* Reclaim Verification Button */}
      <TouchableOpacity style={styles.reclaimButton} onPress={handleReclaimVerification}>
        <Text style={styles.reclaimButtonText}>🔐 Verify with Reclaim</Text>
      </TouchableOpacity>

      {/* Recommended Trip */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended for You</Text>
        <TripCard
          destination="Bali, Indonesia"
          airline="Singapore Airlines"
          hotel="Bali Resort & Spa"
          price="₹45,000"
          duration="7 days"
          image="https://example.com/bali.jpg"
          onPress={handlePlanTrip}
          isRecommended={true}
        />
        <TouchableOpacity style={styles.planButton} onPress={handlePlanTrip}>
          <Text style={styles.planButtonText}>Plan My Trip</Text>
        </TouchableOpacity>
      </View>

      {/* More Recommendations */}
      <RecommendationCarousel
        title="Explore More Destinations"
        recommendations={mockRecommendations}
        onItemPress={handleRecommendationPress}
      />

      {/* Upcoming Trips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Upcoming Trips</Text>
        {state.trips.filter(trip => trip.status === 'upcoming').length > 0 ? (
          state.trips
            .filter(trip => trip.status === 'upcoming')
            .map(trip => (
              <TripCard
                key={trip.id}
                destination={trip.destination}
                airline={trip.airline}
                hotel={trip.hotel}
                price={trip.price}
                duration={trip.duration}
                image={trip.image}
                onPress={() => handleTripPress(trip)}
              />
            ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No upcoming trips</Text>
            <Text style={styles.emptyStateSubtext}>Start planning your next adventure!</Text>
          </View>
        )}
      </View>

      <ReclaimModal
        visible={showReclaimModal}
        onClose={() => setShowReclaimModal(false)}
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
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
  },
  reclaimButton: {
    backgroundColor: '#4299E1',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  reclaimButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  planButton: {
    backgroundColor: '#38A169',
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  planButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
});