import TripCard from '@/components/TripCard';
import { useApp } from '@/contexts/AppContext';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MyTripsScreen() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

  const upcomingTrips = state.trips.filter(trip => trip.status === 'upcoming');
  const completedTrips = state.trips.filter(trip => trip.status === 'completed');

  const handleTripPress = (trip: any) => {
    // Navigate to trip details
    Alert.alert('Trip Details', `Viewing details for ${trip.destination}`);
  };

  const handleRateTrip = (trip: any) => {
    Alert.alert(
      'Rate This Trip',
      'How would you rate your experience?',
      [
        { text: '⭐', onPress: () => console.log('1 star') },
        { text: '⭐⭐', onPress: () => console.log('2 stars') },
        { text: '⭐⭐⭐', onPress: () => console.log('3 stars') },
        { text: '⭐⭐⭐⭐', onPress: () => console.log('4 stars') },
        { text: '⭐⭐⭐⭐⭐', onPress: () => console.log('5 stars') },
      ]
    );
  };

  const handleShareExperience = (trip: any) => {
    Alert.alert('Share Experience', `Sharing experience for ${trip.destination}`);
  };

  const renderTripCard = (trip: any) => (
    <View key={trip.id} style={styles.tripCardContainer}>
      <TripCard
        destination={trip.destination}
        airline={trip.airline}
        hotel={trip.hotel}
        price={trip.price}
        duration={trip.duration}
        image={trip.image}
        onPress={() => handleTripPress(trip)}
      />
      {trip.status === 'completed' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleRateTrip(trip)}
          >
            <Text style={styles.actionButtonText}>Rate This Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleShareExperience(trip)}
          >
            <Text style={styles.actionButtonText}>Share Experience</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming ({upcomingTrips.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed ({completedTrips.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'upcoming' ? (
          upcomingTrips.length > 0 ? (
            upcomingTrips.map(renderTripCard)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No upcoming trips</Text>
              <Text style={styles.emptyStateSubtext}>
                Start planning your next adventure from the home screen!
              </Text>
            </View>
          )
        ) : (
          completedTrips.length > 0 ? (
            completedTrips.map(renderTripCard)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No completed trips</Text>
              <Text style={styles.emptyStateSubtext}>
                Your completed trips will appear here after you travel.
              </Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#4299E1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#718096',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  tripCardContainer: {
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#4A5568',
    fontWeight: '500',
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
    lineHeight: 20,
  },
}); 