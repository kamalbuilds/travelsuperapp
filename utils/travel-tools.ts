import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

// Travel-specific tools for conversational AI
const get_current_location = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return 'Location permission denied. Please enable location services to get personalized travel recommendations.';
    }

    const location = await Location.getCurrentPositionAsync({});
    const address = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    const currentLocation = address[0];
    return `You are currently in ${currentLocation?.city || 'Unknown City'}, ${currentLocation?.country || 'Unknown Country'}. Latitude: ${location.coords.latitude.toFixed(4)}, Longitude: ${location.coords.longitude.toFixed(4)}`;
  } catch (error) {
    console.error('Location error:', error);
    return 'Unable to get current location. Please check your location settings.';
  }
};

const search_flights = async ({ origin, destination, departureDate, passengers = 1 }: {
  origin: string;
  destination: string;
  departureDate: string;
  passengers?: number;
}) => {
  try {
    // Simulate flight search (in real app, integrate with travel APIs)
    const flights = [
      {
        airline: 'Emirates',
        flight: 'EK123',
        departure: '10:30 AM',
        arrival: '6:45 PM',
        duration: '8h 15m',
        price: '$850',
        stops: 'Direct'
      },
      {
        airline: 'Qatar Airways',
        flight: 'QR456',
        departure: '2:15 PM',
        arrival: '11:30 PM',
        duration: '9h 15m',
        price: '$720',
        stops: '1 Stop in Doha'
      },
      {
        airline: 'Lufthansa',
        flight: 'LH789',
        departure: '8:00 AM',
        arrival: '4:20 PM',
        duration: '8h 20m',
        price: '$980',
        stops: 'Direct'
      }
    ];

    return `Found ${flights.length} flights from ${origin} to ${destination} on ${departureDate} for ${passengers} passenger(s):

${flights.map((flight, index) => 
  `${index + 1}. ${flight.airline} ${flight.flight}
   Departure: ${flight.departure} → Arrival: ${flight.arrival}
   Duration: ${flight.duration} (${flight.stops})
   Price: ${flight.price} per person`
).join('\n\n')}

Would you like me to help you book any of these flights?`;
  } catch (error) {
    console.error('Flight search error:', error);
    return 'Sorry, I encountered an error while searching for flights. Please try again.';
  }
};

const get_weather = async ({ destination }: { destination: string }) => {
  try {
    // Simulate weather API call (in real app, integrate with weather service)
    const weatherData = {
      'Tokyo': { temp: '22°C', condition: 'Sunny', humidity: '65%', wind: '8 km/h' },
      'Paris': { temp: '18°C', condition: 'Partly Cloudy', humidity: '70%', wind: '12 km/h' },
      'New York': { temp: '25°C', condition: 'Clear', humidity: '60%', wind: '10 km/h' },
      'London': { temp: '16°C', condition: 'Rainy', humidity: '80%', wind: '15 km/h' },
      'Dubai': { temp: '35°C', condition: 'Sunny', humidity: '45%', wind: '5 km/h' }
    };

    const weather = weatherData[destination as keyof typeof weatherData] || {
      temp: '20°C',
      condition: 'Partly Cloudy',
      humidity: '65%',
      wind: '10 km/h'
    };

    return `Current weather in ${destination}:
Temperature: ${weather.temp}
Conditions: ${weather.condition}
Humidity: ${weather.humidity}
Wind Speed: ${weather.wind}

Perfect for outdoor activities! Would you like recommendations for things to do in ${destination}?`;
  } catch (error) {
    console.error('Weather error:', error);
    return `Unable to get weather information for ${destination}. Please try again.`;
  }
};

const save_trip_preferences = async ({ destination, budget, travelStyle, interests }: {
  destination: string;
  budget: string;
  travelStyle: string;
  interests: string[];
}) => {
  try {
    const preferences = {
      destination,
      budget,
      travelStyle,
      interests,
      savedAt: new Date().toISOString()
    };

    await AsyncStorage.setItem('travel_preferences', JSON.stringify(preferences));
    
    return `I've saved your travel preferences:
• Destination: ${destination}
• Budget: ${budget}
• Travel Style: ${travelStyle}
• Interests: ${interests.join(', ')}

I'll use these preferences to provide personalized recommendations for your trip!`;
  } catch (error) {
    console.error('Save preferences error:', error);
    return 'Sorry, I had trouble saving your preferences. Please try again.';
  }
};

const get_travel_recommendations = async ({ destination, interests }: {
  destination: string;
  interests: string[];
}) => {
  try {
    // Simulate recommendation engine (in real app, use AI/ML recommendations)
    const recommendations = {
      'Tokyo': {
        attractions: ['Tokyo Skytree', 'Senso-ji Temple', 'Shibuya Crossing', 'Meiji Shrine'],
        restaurants: ['Sukiyabashi Jiro', 'Ramen Nagi', 'Tsukiji Outer Market'],
        experiences: ['Robot Restaurant', 'Tsukiji Fish Market Tour', 'Traditional Tea Ceremony']
      },
      'Paris': {
        attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Arc de Triomphe'],
        restaurants: ['Le Comptoir du Relais', 'L\'As du Fallafel', 'Pierre Hermé'],
        experiences: ['Seine River Cruise', 'Cooking Class', 'Wine Tasting in Montmartre']
      }
    };

    const recs = recommendations[destination as keyof typeof recommendations] || {
      attractions: ['Historic Downtown', 'Local Museum', 'City Park', 'Cultural District'],
      restaurants: ['Local Cuisine Restaurant', 'Street Food Market', 'Rooftop Dining'],
      experiences: ['Walking Tour', 'Local Cooking Class', 'Cultural Performance']
    };

    return `Here are my top recommendations for ${destination}:

🏛️ Must-See Attractions:
${recs.attractions.map(item => `• ${item}`).join('\n')}

🍽️ Recommended Restaurants:
${recs.restaurants.map(item => `• ${item}`).join('\n')}

🎯 Unique Experiences:
${recs.experiences.map(item => `• ${item}`).join('\n')}

Would you like me to help you book any of these experiences or get more details about specific attractions?`;
  } catch (error) {
    console.error('Recommendations error:', error);
    return `Sorry, I had trouble getting recommendations for ${destination}. Please try again.`;
  }
};

const emergency_assistance = async ({ location, emergencyType }: {
  location?: string;
  emergencyType: 'medical' | 'police' | 'embassy' | 'general';
}) => {
  try {
    const emergencyNumbers = {
      medical: '911 (US), 999 (UK), 112 (EU)',
      police: '911 (US), 999 (UK), 112 (EU)',
      embassy: 'Contact your country\'s embassy',
      general: '911 (US), 999 (UK), 112 (EU)'
    };

    return `🚨 EMERGENCY ASSISTANCE 🚨

Emergency Type: ${emergencyType.toUpperCase()}
${location ? `Location: ${location}` : ''}

Emergency Numbers: ${emergencyNumbers[emergencyType]}

📞 If this is a life-threatening emergency, call local emergency services immediately!

I can also help you:
• Find the nearest hospital
• Contact your embassy
• Locate police stations
• Get travel insurance assistance

Stay safe and call for help if needed!`;
  } catch (error) {
    console.error('Emergency assistance error:', error);
    return 'Emergency assistance is available. Please call local emergency services if this is urgent.';
  }
};

const travel_tools = {
  get_current_location,
  search_flights,
  get_weather,
  save_trip_preferences,
  get_travel_recommendations,
  emergency_assistance,
};

export default travel_tools; 