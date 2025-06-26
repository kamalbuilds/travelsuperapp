import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Plus,
  Calendar,
  MapPin,
  Clock,
  Plane,
  Hotel,
  Camera,
  Share,
  MoreHorizontal,
} from 'lucide-react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width } = Dimensions.get('window');

const trips = [
  {
    id: 1,
    destination: 'Tokyo, Japan',
    dates: 'Mar 15 - Mar 22, 2024',
    status: 'upcoming',
    image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
    daysLeft: 12,
    activities: 5,
    bookings: 3,
  },
  {
    id: 2,
    destination: 'Paris, France',
    dates: 'Feb 10 - Feb 17, 2024',
    status: 'completed',
    image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
    activities: 8,
    bookings: 4,
  },
  {
    id: 3,
    destination: 'Bali, Indonesia',
    dates: 'Jan 5 - Jan 12, 2024',
    status: 'completed',
    image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800',
    activities: 6,
    bookings: 2,
  },
];

const upcomingTrips = trips.filter(trip => trip.status === 'upcoming');
const pastTrips = trips.filter(trip => trip.status === 'completed');

export default function TripsScreen() {
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const renderTripCard = (trip: any, isUpcoming: boolean = false) => (
    <View key={trip.id} style={[styles.tripCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <Image source={{ uri: trip.image }} style={styles.tripImage} />
      <View style={styles.tripContent}>
        <View style={styles.tripHeader}>
          <View style={styles.tripInfo}>
            <Text style={[styles.tripDestination, { color: Colors[colorScheme ?? 'light'].text }]}>
              {trip.destination}
            </Text>
            <View style={styles.tripDateContainer}>
              <Calendar size={14} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
              <Text style={[styles.tripDates, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                {trip.dates}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreHorizontal size={20} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
          </TouchableOpacity>
        </View>

        {isUpcoming && trip.daysLeft && (
          <View style={styles.countdownContainer}>
            <Clock size={16} color="#667eea" />
            <Text style={styles.countdownText}>{trip.daysLeft} days to go</Text>
          </View>
        )}

        <View style={styles.tripStats}>
          <View style={styles.statItem}>
            <MapPin size={16} color={Colors[colorScheme ?? 'light'].tint} />
            <Text style={[styles.statText, { color: Colors[colorScheme ?? 'light'].text }]}>
              {trip.activities} activities
            </Text>
          </View>
          <View style={styles.statItem}>
            <Hotel size={16} color={Colors[colorScheme ?? 'light'].tint} />
            <Text style={[styles.statText, { color: Colors[colorScheme ?? 'light'].text }]}>
              {trip.bookings} bookings
            </Text>
          </View>
        </View>

        <View style={styles.tripActions}>
          {isUpcoming ? (
            <>
              <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
                <Text style={styles.primaryButtonText}>View Itinerary</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                <Share size={16} color={Colors[colorScheme ?? 'light'].tint} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                <Camera size={16} color={Colors[colorScheme ?? 'light'].tint} />
                <Text style={[styles.secondaryButtonText, { color: Colors[colorScheme ?? 'light'].tint }]}>
                  Photos
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                <Share size={16} color={Colors[colorScheme ?? 'light'].tint} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          My Trips
        </Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'upcoming' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText,
            ]}
          >
            Upcoming ({upcomingTrips.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'past' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('past')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'past' && styles.activeTabText,
            ]}
          >
            Past ({pastTrips.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {activeTab === 'upcoming' ? (
          <>
            {upcomingTrips.length > 0 ? (
              upcomingTrips.map(trip => renderTripCard(trip, true))
            ) : (
              <View style={styles.emptyState}>
                <Plane size={48} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
                <Text style={[styles.emptyTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  No upcoming trips
                </Text>
                <Text style={[styles.emptyDescription, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                  Start planning your next adventure with our AI assistant
                </Text>
                <TouchableOpacity style={styles.planTripButton}>
                  <Text style={styles.planTripButtonText}>Plan New Trip</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <>
            {pastTrips.map(trip => renderTripCard(trip, false))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#667eea',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#667eea',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tripCard: {
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  tripImage: {
    width: '100%',
    height: 160,
  },
  tripContent: {
    padding: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tripInfo: {
    flex: 1,
  },
  tripDestination: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tripDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tripDates: {
    fontSize: 14,
  },
  moreButton: {
    padding: 4,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  countdownText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#667eea',
  },
  tripStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
  },
  tripActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  primaryButton: {
    backgroundColor: '#667eea',
    flex: 1,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  planTripButton: {
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  planTripButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});