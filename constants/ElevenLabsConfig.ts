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