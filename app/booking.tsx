import { router } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Plane,
  Hotel,
  Car,
  MapPin,
  Calendar,
  Users,
  Search,
  Filter,
  Star,
  Clock,
  Wifi,
  Coffee,
  Utensils,
} from 'lucide-react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width } = Dimensions.get('window');

const bookingTabs = [
  { id: 'flights', title: 'Flights', icon: Plane },
  { id: 'hotels', title: 'Hotels', icon: Hotel },
  { id: 'cars', title: 'Cars', icon: Car },
];

const flightResults = [
  {
    id: 1,
    airline: 'Japan Airlines',
    logo: 'https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg?auto=compress&cs=tinysrgb&w=100',
    departure: { time: '08:30', airport: 'JFK' },
    arrival: { time: '14:45+1', airport: 'NRT' },
    duration: '14h 15m',
    stops: 'Direct',
    price: 750,
    class: 'Economy',
  },
  {
    id: 2,
    airline: 'United Airlines',
    logo: 'https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg?auto=compress&cs=tinysrgb&w=100',
    departure: { time: '11:20', airport: 'JFK' },
    arrival: { time: '18:35+1', airport: 'NRT' },
    duration: '15h 15m',
    stops: '1 Stop',
    price: 680,
    class: 'Economy',
  },
];

const hotelResults = [
  {
    id: 1,
    name: 'Tokyo Grand Hotel',
    image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviews: 1250,
    location: 'Shibuya, Tokyo',
    price: 180,
    amenities: ['Wifi', 'Pool', 'Gym', 'Restaurant'],
  },
  {
    id: 2,
    name: 'Sakura Boutique Hotel',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    reviews: 890,
    location: 'Asakusa, Tokyo',
    price: 120,
    amenities: ['Wifi', 'Breakfast', 'Spa'],
  },
];

export default function BookingScreen() {
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState('flights');
  const [searchQuery, setSearchQuery] = useState('');

  const renderFlightCard = (flight: any) => (
    <View key={flight.id} style={[styles.resultCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.flightHeader}>
        <View style={styles.airlineInfo}>
          <Image source={{ uri: flight.logo }} style={styles.airlineLogo} />
          <Text style={[styles.airlineName, { color: Colors[colorScheme ?? 'light'].text }]}>
            {flight.airline}
          </Text>
        </View>
        <Text style={[styles.flightClass, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
          {flight.class}
        </Text>
      </View>

      <View style={styles.flightDetails}>
        <View style={styles.flightTime}>
          <Text style={[styles.timeText, { color: Colors[colorScheme ?? 'light'].text }]}>
            {flight.departure.time}
          </Text>
          <Text style={[styles.airportText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            {flight.departure.airport}
          </Text>
        </View>

        <View style={styles.flightPath}>
          <View style={styles.flightLine} />
          <Plane size={16} color={Colors[colorScheme ?? 'light'].tint} />
          <View style={styles.flightLine} />
        </View>

        <View style={styles.flightTime}>
          <Text style={[styles.timeText, { color: Colors[colorScheme ?? 'light'].text }]}>
            {flight.arrival.time}
          </Text>
          <Text style={[styles.airportText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            {flight.arrival.airport}
          </Text>
        </View>
      </View>

      <View style={styles.flightInfo}>
        <View style={styles.flightMeta}>
          <View style={styles.metaItem}>
            <Clock size={14} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
            <Text style={[styles.metaText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              {flight.duration}
            </Text>
          </View>
          <Text style={[styles.stopsText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            {flight.stops}
          </Text>
        </View>
        <View style={styles.priceSection}>
          <Text style={[styles.priceText, { color: Colors[colorScheme ?? 'light'].tint }]}>
            ${flight.price}
          </Text>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderHotelCard = (hotel: any) => (
    <View key={hotel.id} style={[styles.resultCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
      <View style={styles.hotelContent}>
        <View style={styles.hotelHeader}>
          <Text style={[styles.hotelName, { color: Colors[colorScheme ?? 'light'].text }]}>
            {hotel.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <Text style={[styles.ratingText, { color: Colors[colorScheme ?? 'light'].text }]}>
              {hotel.rating}
            </Text>
            <Text style={[styles.reviewsText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              ({hotel.reviews})
            </Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <MapPin size={14} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
          <Text style={[styles.locationText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            {hotel.location}
          </Text>
        </View>

        <View style={styles.amenitiesContainer}>
          {hotel.amenities.slice(0, 3).map((amenity: string, index: number) => (
            <View key={index} style={styles.amenityTag}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>

        <View style={styles.hotelFooter}>
          <View style={styles.priceContainer}>
            <Text style={[styles.priceLabel, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              From
            </Text>
            <Text style={[styles.hotelPrice, { color: Colors[colorScheme ?? 'light'].tint }]}>
              ${hotel.price}/night
            </Text>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Book Your Trip
        </Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={24} color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {bookingTabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <tab.icon
              size={20}
              color={activeTab === tab.id ? '#fff' : Colors[colorScheme ?? 'light'].tabIconDefault}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === tab.id ? '#fff' : Colors[colorScheme ?? 'light'].tabIconDefault
                }
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <Search size={20} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
          <TextInput
            style={[styles.searchInput, { color: Colors[colorScheme ?? 'light'].text }]}
            placeholder={`Search ${activeTab}...`}
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Quick Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtersList}>
            {activeTab === 'flights' ? (
              <>
                <TouchableOpacity style={styles.filterChip}>
                  <Text style={styles.filterChipText}>Direct</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}>
                  <Text style={styles.filterChipText}>Economy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}>
                  <Text style={styles.filterChipText}>Morning</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.filterChip}>
                  <Text style={styles.filterChipText}>4+ Stars</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}>
                  <Text style={styles.filterChipText}>Free WiFi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}>
                  <Text style={styles.filterChipText}>Pool</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Results */}
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {activeTab === 'flights' && (
          <View style={styles.resultsSection}>
            <Text style={[styles.resultsTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Flight Results
            </Text>
            {flightResults.map(renderFlightCard)}
          </View>
        )}

        {activeTab === 'hotels' && (
          <View style={styles.resultsSection}>
            <Text style={[styles.resultsTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Hotel Results
            </Text>
            {hotelResults.map(renderHotelCard)}
          </View>
        )}

        {activeTab === 'cars' && (
          <View style={styles.emptyState}>
            <Car size={48} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
            <Text style={[styles.emptyTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Car Rentals Coming Soon
            </Text>
            <Text style={[styles.emptyDescription, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              We're working on adding car rental options to make your trip complete
            </Text>
          </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  filterButton: {
    padding: 4,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#667eea',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filtersList: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  filterChip: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '500',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsSection: {
    paddingHorizontal: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  resultCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Flight Card Styles
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  airlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  airlineLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  airlineName: {
    fontSize: 16,
    fontWeight: '500',
  },
  flightClass: {
    fontSize: 14,
  },
  flightDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  flightTime: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  airportText: {
    fontSize: 14,
  },
  flightPath: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  flightLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#667eea',
  },
  flightInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flightMeta: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
  },
  stopsText: {
    fontSize: 14,
  },
  priceSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Hotel Card Styles
  hotelImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  hotelContent: {
    gap: 8,
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewsText: {
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  amenityTag: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    padding: 4,
    borderRadius: 6,
  },
  amenityText: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '500',
  },
  hotelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceLabel: {
    fontSize: 14,
  },
  hotelPrice: {
    fontSize: 18,
    fontWeight: 'bold',
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
  },
});