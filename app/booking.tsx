import { router } from 'expo-router';
import {
  ArrowLeft,
  Car,
  Clock,
  Filter,
  Hotel,
  MapPin,
  Plane,
  Search,
  Star
} from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export default function BookingScreen() {
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState('flights');
  const [searchQuery, setSearchQuery] = useState('');

  // Hotel search state
  const [hotelStartDate, setHotelStartDate] = useState('2024-06-20');
  const [hotelEndDate, setHotelEndDate] = useState('2024-06-21');
  const [hotelAdults, setHotelAdults] = useState(2);
  const [hotelRooms, setHotelRooms] = useState(1);
  const [hotelLoading, setHotelLoading] = useState(false);
  const [hotelError, setHotelError] = useState('');
  const [hotelResults, setHotelResults] = useState<any[]>([]);

  // Default hotel IDs for demo
  const defaultHotelIds = [5568, 12341234];

  // Fetch hotels from API (for now, use hardcoded sample data)
  const fetchHotels = async () => {
    setHotelLoading(true);
    setHotelError('');
    setHotelResults([]);
    try {
      // Hardcoded sample response
      const sampleData = {
        "root": {
          "api_version": 4,
          "currency": "GBP",
          "start_date": "2018-04-28",
          "end_date": "2018-04-29",
          "lang": "en_GB",
          "rate_model": "AI",
          "room_adults_1":2,
          "num_rooms": 1,
          "hotel_ids": [5568,12341234],
          "hotels": [
            {
              "hotel_id": 5568,
              "room_types": [
                [
                  {
                    "Executive Doubleroom ": {
                      "booking_fee": 0,
                      "breakfast_included": "true",
                      "currency": "GBP",
                      "final_rate": 202.5,
                      "free_cancellation": "true",
                      "hotel_fee": 0,
                      "local_tax": 2.5,
                      "meal_code": "BB",
                      "net_rate": 160,
                      "payment_type": "prepaid",
                      "resort_fee": 0,
                      "room_code": "DOUBLE",
                      "service_charge": 0,
                      "url": "https://advertiser-site.com/hoteladlon/Executive_Double?start_date=2018-04-28&end_date=2018-04-29&num_adults=2",
                      "mobileURL": "https://advertiser-mobilesite.com/hoteladlon/Executive_Double?start_date=2018-04-28&end_date=2018-04-29&num_adults=2",
                      "vat": 40,
                      "rate_type": "DEFAULT"
                    }
                  }
                ],
                [
                  {
                    "Executive Doubleroom Mobile Offer": {
                      "booking_fee": 0,
                      "breakfast_included": "true",
                      "currency": "GBP",
                      "final_rate": 202.5,
                      "free_cancellation": "true",
                      "hotel_fee": 0,
                      "local_tax": 2.5,
                      "meal_code": "BB",
                      "net_rate": 160,
                      "payment_type": "prepaid",
                      "resort_fee": 0,
                      "room_code": "DOUBLE MBL",
                      "service_charge": 0,
                      "url": "",
                      "mobileURL": "https://advertiser-mobilesite.com/hoteladlon/Executive_Double?start_date=2018-04-28&end_date=2018-04-29&num_adults=2",
                      "vat": 40,
                      "rate_type": "MOBILE"
                    }
                  }
                ],
                [
                  {
                    "Freaky Double Mobile Offer": {
                      "booking_fee": 0,
                      "breakfast_included": "true",
                      "currency": "GBP",
                      "discounts": [
                        {
                          "booking_fee": 0,
                          "final_rate": 10,
                          "hotel_fee": 0,
                          "local_tax": 0.0,
                          "marketing_text": "5% off mobile special",
                          "net_rate": 8,
                          "resort_fee": 0,
                          "service_charge": 0,
                          "vat": 2
                        }
                      ],
                      "final_rate": 202.5,
                      "free_cancellation": "true",
                      "hotel_fee": 0,
                      "local_tax": 2.5,
                      "meal_code": "RO",
                      "net_rate": 160,
                      "payment_type": "prepaid",
                      "resort_fee": 0,
                      "room_code": "DOUBLE MBL",
                      "service_charge": 0,
                      "url": "",
                      "mobileURL": "https://advertiser-mobilesite.com/hoteladlon/Freaky_Double?start_date=2018-04-28&end_date=2018-04-29&num_adults=2",
                      "vat": 40,
                      "rate_type": "MOBILE"
                    }
                  }
                ]
              ]
            },
            {
              "hotel_id": 12341234,
              "room_types": [
                [
                  {
                    "Luxury Double": {
                      "booking_fee": 0,
                      "breakfast_included": "true",
                      "currency": "GBP",
                      "final_rate": 74.5,
                      "free_cancellation": "true",
                      "hotel_fee": 0,
                      "local_tax": 2.5,
                      "meal_code": "RO",
                      "net_rate": 60.00,
                      "payment_type": "prepaid",
                      "resort_fee": 0,
                      "room_code": "DOUBLE",
                      "service_charge": 0,
                      "url": "https://advertiser-site.com/hotelmagnum/Luxury_Double?start_date=2018-04-28&end_date=2018-04-29&num_adults=2",
                      "mobileURL": "",
                      "vat": 12,
                      "rate_type": "REWARD"
                    }
                  }
                ]
              ]
            }
          ]
        }
      };
      setTimeout(() => {
        setHotelResults(sampleData.root.hotels);
        setHotelLoading(false);
      }, 500); // simulate network delay
    } catch (err: any) {
      setHotelError('Error loading hotels');
      setHotelLoading(false);
    }
  };

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

  const renderHotelCard = (hotel: any) => {
    // hotel.room_types is an array of arrays of objects
    const firstRoom = hotel.room_types?.[0]?.[0];
    const roomName = firstRoom ? Object.keys(firstRoom)[0] : '';
    const room = firstRoom ? firstRoom[roomName] : null;
    return (
      <View key={hotel.hotel_id} style={[styles.resultCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>        
        <View style={styles.hotelContent}>
          <View style={styles.hotelHeader}>
            <Text style={[styles.hotelName, { color: Colors[colorScheme ?? 'light'].text }]}>Hotel ID: {hotel.hotel_id}</Text>
            {room && (
              <View style={styles.ratingContainer}>
                <Star size={14} color="#FFD700" fill="#FFD700" />
                <Text style={[styles.ratingText, { color: Colors[colorScheme ?? 'light'].text }]}>-</Text>
              </View>
            )}
          </View>
          <View style={styles.locationContainer}>
            <MapPin size={14} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
            <Text style={[styles.locationText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>-</Text>
          </View>
          {room && (
            <View style={styles.amenitiesContainer}>
              <View style={styles.amenityTag}><Text style={styles.amenityText}>{room.breakfast_included === 'true' ? 'Breakfast' : 'Room Only'}</Text></View>
              <View style={styles.amenityTag}><Text style={styles.amenityText}>{room.free_cancellation === 'true' ? 'Free Cancellation' : 'No Cancellation'}</Text></View>
            </View>
          )}
          <View style={styles.hotelFooter}>
            <View style={styles.priceContainer}>
              <Text style={[styles.priceLabel, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>From</Text>
              <Text style={[styles.hotelPrice, { color: Colors[colorScheme ?? 'light'].tint }]}>
                £{room ? room.final_rate : '-'} /night
              </Text>
            </View>
            {room && (
              <TouchableOpacity style={styles.bookButton} onPress={() => {
                if (room.url) router.push(room.url);
              }}>
                <Text style={styles.bookButtonText}>Book</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

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
            <Text style={[styles.resultsTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Flight Results</Text>
            {flightResults.map(renderFlightCard)}
          </View>
        )}
        {activeTab === 'hotels' && (
          <View style={styles.resultsSection}>
            <Text style={[styles.resultsTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Hotel Results</Text>
            {/* Hotel Search Form */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: Colors[colorScheme ?? 'light'].tabIconDefault }}>Start Date</Text>
                <TextInput value={hotelStartDate} onChangeText={setHotelStartDate} style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 6, padding: 6, color: Colors[colorScheme ?? 'light'].text }} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: Colors[colorScheme ?? 'light'].tabIconDefault }}>End Date</Text>
                <TextInput value={hotelEndDate} onChangeText={setHotelEndDate} style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 6, padding: 6, color: Colors[colorScheme ?? 'light'].text }} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: Colors[colorScheme ?? 'light'].tabIconDefault }}>Adults</Text>
                <TextInput value={hotelAdults.toString()} onChangeText={v => setHotelAdults(Number(v))} keyboardType="numeric" style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 6, padding: 6, color: Colors[colorScheme ?? 'light'].text }} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: Colors[colorScheme ?? 'light'].tabIconDefault }}>Rooms</Text>
                <TextInput value={hotelRooms.toString()} onChangeText={v => setHotelRooms(Number(v))} keyboardType="numeric" style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 6, padding: 6, color: Colors[colorScheme ?? 'light'].text }} />
              </View>
            </View>
            <TouchableOpacity style={[styles.bookButton, { marginBottom: 16 }]} onPress={fetchHotels}>
              <Text style={styles.bookButtonText}>Search Hotels</Text>
            </TouchableOpacity>
            {hotelLoading && <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} style={{ marginVertical: 20 }} />}
            {hotelError ? <Text style={{ color: 'red', marginBottom: 12 }}>{hotelError}</Text> : null}
            {hotelResults.length === 0 && !hotelLoading && !hotelError && (
              <Text style={{ color: Colors[colorScheme ?? 'light'].tabIconDefault, marginBottom: 12 }}>No hotels found. Please search.</Text>
            )}
            {hotelResults.map(renderHotelCard)}
          </View>
        )}
        {activeTab === 'cars' && (
          <View style={styles.emptyState}>
            <Car size={48} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
            <Text style={[styles.emptyTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Car Rentals Coming Soon</Text>
            <Text style={[styles.emptyDescription, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>We're working on adding car rental options to make your trip complete</Text>
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
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }
    }),
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
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }
    }),
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