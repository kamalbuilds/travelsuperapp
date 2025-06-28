/**
 * ElevenLabs Conversational AI Configuration
 * 
 * This file contains the configuration for ElevenLabs AI agents
 * used throughout the TravelSuperApp.
 */

// Agent IDs from .travel-agents-config.json
export const AGENT_IDS = {
  // Sofia - Main Travel Orchestrator
  SOFIA: "agent_01jyp6rh49e86acqze2qm2yxne",
  
  // Specialized Travel Agents
  FLIGHT_BOOKING: "agent_01jyp6xhe7exhreyhrdkhwe3pk",
  HOTEL_BOOKING: "agent_01jyp8zjc3e5wseq5wk6h14sbg", 
  LOCAL_EXPERIENCE: "agent_01jyp820vyfbybe5xvzq2z0vxh",
  EMERGENCY_ASSISTANCE: "agent_01jyp8r3egehhagn74jz3k3t9z",
  WEATHER_SAFETY: "agent_01jyp8vzyee82rmgrf0akgrt96"
} as const;

// Agent Profiles with voice characteristics and specializations
export const AGENT_PROFILES = {
  [AGENT_IDS.SOFIA]: {
    name: "Sofia",
    role: "Travel Orchestrator",
    description: "Your main AI travel coordinator who manages all other agents",
    personality: "Professional, warm, and highly organized",
    voice: "Confident and reassuring with a slight international accent",
    specialties: [
      "Trip coordination",
      "Agent management", 
      "Travel planning overview",
      "User preference understanding"
    ],
    avatar: "S",
    color: "#667eea"
  },
  
  [AGENT_IDS.FLIGHT_BOOKING]: {
    name: "Captain Miles",
    role: "Flight Specialist", 
    description: "Expert in finding the best flights and airline deals",
    personality: "Detail-oriented, efficient, and travel-savvy",
    voice: "Clear and professional with aviation terminology",
    specialties: [
      "Flight search and booking",
      "Airline comparisons",
      "Route optimization", 
      "Travel class recommendations"
    ],
    avatar: "✈️",
    color: "#3B82F6"
  },
  
  [AGENT_IDS.HOTEL_BOOKING]: {
    name: "Isabella",
    role: "Accommodation Expert",
    description: "Specialist in hotels, resorts, and unique stays",
    personality: "Hospitality-focused, luxury-aware, and comfort-oriented",
    voice: "Warm and welcoming with hospitality expertise",
    specialties: [
      "Hotel and resort booking",
      "Accommodation comparisons",
      "Amenity matching",
      "Location recommendations"
    ],
    avatar: "🏨",
    color: "#EC4899"
  },
  
  [AGENT_IDS.LOCAL_EXPERIENCE]: {
    name: "Marco",
    role: "Local Experience Guide",
    description: "Your guide to authentic local experiences and hidden gems",
    personality: "Adventurous, culturally knowledgeable, and enthusiastic",
    voice: "Energetic and passionate about local culture",
    specialties: [
      "Local attractions and activities",
      "Cultural experiences",
      "Restaurant recommendations",
      "Hidden gems and off-the-beaten-path"
    ],
    avatar: "🗺️",
    color: "#10B981"
  },
  
  [AGENT_IDS.EMERGENCY_ASSISTANCE]: {
    name: "Dr. Sarah",
    role: "Emergency & Safety Specialist",
    description: "24/7 emergency support and safety guidance",
    personality: "Calm, reliable, and safety-focused",
    voice: "Reassuring and authoritative in crisis situations",
    specialties: [
      "Emergency assistance",
      "Travel insurance guidance",
      "Medical support",
      "Safety protocols"
    ],
    avatar: "🚨",
    color: "#EF4444"
  },
  
  [AGENT_IDS.WEATHER_SAFETY]: {
    name: "Storm",
    role: "Weather & Safety Analyst",
    description: "Real-time weather updates and travel safety alerts",
    personality: "Analytical, precise, and safety-conscious",
    voice: "Clear and informative like a weather reporter",
    specialties: [
      "Weather forecasting",
      "Travel safety alerts",
      "Climate recommendations",
      "Seasonal travel advice"
    ],
    avatar: "🌤️",
    color: "#F59E0B"
  }
} as const;

// Voice Settings
export const VOICE_SETTINGS = {
  DEFAULT_VOLUME: 0.8,
  MIN_VOLUME: 0.0,
  MAX_VOLUME: 1.0,
  VOLUME_STEP: 0.1
} as const;

// Connection Settings
export const CONNECTION_SETTINGS = {
  RECONNECT_ATTEMPTS: 3,
  RECONNECT_DELAY: 2000, // 2 seconds
  TIMEOUT_DURATION: 30000, // 30 seconds
} as const;

// Message Types
export const MESSAGE_TYPES = {
  USER_TRANSCRIPT: 'user_transcript',
  AGENT_RESPONSE: 'agent_response', 
  SYSTEM: 'system',
  ERROR: 'error'
} as const;

// Status Types
export const STATUS_TYPES = {
  CONNECTED: 'connected',
  CONNECTING: 'connecting', 
  DISCONNECTED: 'disconnected'
} as const;

// Mode Types  
export const MODE_TYPES = {
  LISTENING: 'listening',
  SPEAKING: 'speaking',
  THINKING: 'thinking'
} as const;

export type AgentId = keyof typeof AGENT_PROFILES;
export type MessageType = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];
export type StatusType = typeof STATUS_TYPES[keyof typeof STATUS_TYPES]; 
export type ModeType = typeof MODE_TYPES[keyof typeof MODE_TYPES]; 

// ElevenLabs Configuration for Travel Super App

export const ELEVENLABS_CONFIG = {
  // Your ElevenLabs API Key (add to .env file)
  API_KEY: process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY || '',
  
  // Travel Agent ID (replace with your agent ID from ElevenLabs dashboard)
  TRAVEL_AGENT_ID: process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID || 'your-travel-agent-id-here',
  
  // Agent Configuration for Travel Planning
  AGENT_CONFIG: {
    name: 'Travel Assistant',
    voice: 'Sofia', // You can change to other ElevenLabs voices
    
    // First message shown when connected
    firstMessage: 'Hi there! I\'m your AI travel assistant. I can help you plan amazing trips, find destinations, book accommodations, and answer all your travel questions. What adventure are you planning?',
    
    // System prompt for the travel agent
    systemPrompt: `You are a professional travel assistant AI. You help users plan trips, find destinations, suggest activities, and provide travel advice. 

Key capabilities:
- Trip planning and itinerary creation
- Destination recommendations based on preferences
- Budget planning and cost estimation  
- Travel booking assistance
- Local culture and customs information
- Weather and best time to visit advice
- Transportation options and routing
- Accommodation suggestions
- Activity and attraction recommendations
- Travel safety and health tips

Always be helpful, enthusiastic, and provide practical, actionable advice. Ask clarifying questions to better understand the user's preferences, budget, and travel style.`,

    // Dynamic variables that can be used in prompts
    variables: {
      platform: 'mobile', // Will be set based on Platform.OS (ios/android/web)
      userPreferences: '',
      currentLocation: '',
      travelDates: '',
      budget: '',
      travelers: ''
    }
  },

  // Voice settings
  VOICE_SETTINGS: {
    stability: 0.5,
    similarityBoost: 0.75,
    volume: 0.8
  },

  // Conversation settings
  CONVERSATION_SETTINGS: {
    autoStart: false,
    showTranscript: true,
    enableVolumeControl: true,
    maxSessionDuration: 30 * 60 * 1000, // 30 minutes
  }
};

// Helper function to get platform-specific agent ID
export const getTravelAgentId = (): string => {
  return ELEVENLABS_CONFIG.TRAVEL_AGENT_ID;
};

// Helper function to check if ElevenLabs is properly configured
export const isElevenLabsConfigured = (): boolean => {
  return !!( ELEVENLABS_CONFIG.TRAVEL_AGENT_ID && ELEVENLABS_CONFIG.TRAVEL_AGENT_ID !== 'your-travel-agent-id-here');
};

// Environment setup instructions
export const SETUP_INSTRUCTIONS = {
  steps: [
    '1. Create an ElevenLabs account at https://elevenlabs.io',
    '2. Get your API key from the ElevenLabs dashboard',
    '3. Create a new Conversational AI agent for travel assistance',
    '4. Copy your agent ID from the agent settings',
    '5. Add these environment variables to your .env file:',
    '   EXPO_PUBLIC_ELEVENLABS_API_KEY=your_api_key_here',
    '   EXPO_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id_here',
    '6. Configure your agent with travel-specific prompts and tools',
    '7. Test the integration on mobile platforms (iOS/Android) or web'
  ],
  
  agentSetup: {
    systemPrompt: ELEVENLABS_CONFIG.AGENT_CONFIG.systemPrompt,
    firstMessage: ELEVENLABS_CONFIG.AGENT_CONFIG.firstMessage,
    voice: ELEVENLABS_CONFIG.AGENT_CONFIG.voice,
    tools: [
      'get_weather - Get weather information for destinations',
      'find_flights - Search for flight options',
      'hotel_search - Find accommodation options',
      'activity_search - Discover local activities and attractions',
      'currency_convert - Convert currencies for budget planning',
      'travel_safety - Get safety information for destinations'
    ]
  }
};

export default ELEVENLABS_CONFIG; 