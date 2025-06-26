
export interface TravelAgent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  agentId: string;
}

export interface TravelContext {
  userId: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  tripContext?: {
    destination?: string;
    departureDate?: string;
    returnDate?: string;
    travelers?: number;
    budget?: {
      min: number;
      max: number;
      currency: string;
    };
    preferences?: string[];
  };
  conversationHistory: Array<{
    timestamp: Date;
    agentId: string;
    message: string;
    intent: string;
  }>;
}

export class TravelOrchestrator {
  private agents: Map<string, TravelAgent> = new Map();
  private activeConversations: Map<string, string> = new Map(); // userId -> agentId
  
  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    const travelAgents: TravelAgent[] = [
      {
        id: 'flight-booking',
        name: 'Flight Booking Specialist',
        description: 'Expert in finding and booking flights with best prices and routes',
        capabilities: [
          'search_flights',
          'compare_airline_prices',
          'book_flights',
          'check_flight_status',
          'manage_reservations',
          'suggest_alternative_routes',
          'handle_flight_changes'
        ],
        agentId: process.env.EXPO_PUBLIC_FLIGHT_AGENT_ID || 'YOUR_FLIGHT_AGENT_ID'
      },
      {
        id: 'hotel-accommodation',
        name: 'Hotel & Accommodation Expert',
        description: 'Specialized in finding and booking hotels, Airbnb, and unique stays',
        capabilities: [
          'search_hotels',
          'compare_accommodation_prices',
          'book_accommodations',
          'find_unique_stays',
          'check_availability',
          'manage_hotel_reservations',
          'suggest_neighborhoods'
        ],
        agentId: process.env.EXPO_PUBLIC_HOTEL_AGENT_ID || 'YOUR_HOTEL_AGENT_ID'
      },
      {
        id: 'local-experience',
        name: 'Local Experience Curator',
        description: 'Creates personalized itineraries and discovers local experiences',
        capabilities: [
          'create_itineraries',
          'find_attractions',
          'discover_local_experiences',
          'restaurant_recommendations',
          'cultural_activities',
          'outdoor_adventures',
          'hidden_gems',
          'local_events'
        ],
        agentId: process.env.EXPO_PUBLIC_EXPERIENCE_AGENT_ID || 'YOUR_EXPERIENCE_AGENT_ID'
      },
      {
        id: 'travel-assistant',
        name: 'General Travel Assistant',
        description: 'Handles general travel queries, weather, documents, and logistics',
        capabilities: [
          'weather_information',
          'travel_documents',
          'currency_exchange',
          'travel_insurance',
          'packing_suggestions',
          'travel_tips',
          'visa_requirements',
          'vaccination_info'
        ],
        agentId: process.env.EXPO_PUBLIC_TRAVEL_AGENT_ID || 'YOUR_TRAVEL_AGENT_ID'
      },
      {
        id: 'emergency-support',
        name: 'Emergency Travel Support',
        description: 'Provides immediate assistance for travel emergencies and urgent support',
        capabilities: [
          'emergency_assistance',
          'medical_support',
          'embassy_contacts',
          'lost_documents',
          'travel_disruptions',
          'urgent_rebooking',
          'safety_alerts',
          'emergency_contacts'
        ],
        agentId: process.env.EXPO_PUBLIC_EMERGENCY_AGENT_ID || 'YOUR_EMERGENCY_AGENT_ID'
      }
    ];

    travelAgents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });
  }

  public analyzeIntent(message: string, context: TravelContext): {
    primaryAgent: string;
    confidence: number;
    intent: string;
    entities: Record<string, any>;
  } {
    const lowercaseMessage = message.toLowerCase();
    
    // Emergency keywords detection
    const emergencyKeywords = ['emergency', 'urgent', 'help', 'lost', 'stolen', 'accident', 'medical', 'police', 'embassy'];
    if (emergencyKeywords.some(keyword => lowercaseMessage.includes(keyword))) {
      return {
        primaryAgent: 'emergency-support',
        confidence: 0.9,
        intent: 'emergency_assistance',
        entities: { urgency: 'high' }
      };
    }

    // Flight-related keywords
    const flightKeywords = ['flight', 'plane', 'airline', 'airport', 'departure', 'arrival', 'ticket', 'booking', 'fly'];
    if (flightKeywords.some(keyword => lowercaseMessage.includes(keyword))) {
      return {
        primaryAgent: 'flight-booking',
        confidence: 0.8,
        intent: 'flight_search',
        entities: this.extractFlightEntities(message)
      };
    }

    // Hotel/accommodation keywords
    const hotelKeywords = ['hotel', 'accommodation', 'stay', 'room', 'booking.com', 'airbnb', 'resort', 'lodge'];
    if (hotelKeywords.some(keyword => lowercaseMessage.includes(keyword))) {
      return {
        primaryAgent: 'hotel-accommodation',
        confidence: 0.8,
        intent: 'accommodation_search',
        entities: this.extractAccommodationEntities(message)
      };
    }

    // Experience/activity keywords
    const experienceKeywords = ['activities', 'attractions', 'things to do', 'restaurant', 'food', 'tour', 'museum', 'beach', 'hiking'];
    if (experienceKeywords.some(keyword => lowercaseMessage.includes(keyword))) {
      return {
        primaryAgent: 'local-experience',
        confidence: 0.8,
        intent: 'experience_discovery',
        entities: this.extractExperienceEntities(message)
      };
    }

    // Weather/general travel keywords
    const generalKeywords = ['weather', 'climate', 'temperature', 'currency', 'visa', 'documents', 'packing', 'tips'];
    if (generalKeywords.some(keyword => lowercaseMessage.includes(keyword))) {
      return {
        primaryAgent: 'travel-assistant',
        confidence: 0.7,
        intent: 'general_inquiry',
        entities: this.extractGeneralEntities(message)
      };
    }

    // Default to travel assistant for general queries
    return {
      primaryAgent: 'travel-assistant',
      confidence: 0.5,
      intent: 'general_inquiry',
      entities: {}
    };
  }

  private extractFlightEntities(message: string): Record<string, any> {
    const entities: Record<string, any> = {};
    
    // Extract dates (simplified regex)
    const dateRegex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{1,2}\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{2,4})/gi;
    const dates = message.match(dateRegex);
    if (dates) entities.dates = dates;

    // Extract city names (simplified - would use NER in production)
    const cityRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
    const cities = message.match(cityRegex);
    if (cities) entities.locations = cities;

    return entities;
  }

  private extractAccommodationEntities(message: string): Record<string, any> {
    const entities: Record<string, any> = {};
    
    // Extract number of guests
    const guestRegex = /(\d+)\s+(guest|person|people|adult)/gi;
    const guests = message.match(guestRegex);
    if (guests) entities.guests = guests;

    // Extract accommodation type
    const typeRegex = /(hotel|motel|resort|apartment|villa|hostel|guesthouse)/gi;
    const types = message.match(typeRegex);
    if (types) entities.accommodationType = types;

    return entities;
  }

  private extractExperienceEntities(message: string): Record<string, any> {
    const entities: Record<string, any> = {};
    
    // Extract activity types
    const activityRegex = /(restaurant|museum|beach|hiking|shopping|nightlife|cultural|adventure|outdoor)/gi;
    const activities = message.match(activityRegex);
    if (activities) entities.activityTypes = activities;

    return entities;
  }

  private extractGeneralEntities(message: string): Record<string, any> {
    const entities: Record<string, any> = {};
    
    // Extract countries/destinations
    const countryRegex = /\b(USA|UK|France|Germany|Japan|Australia|Canada|Italy|Spain|Thailand|India|China)\b/gi;
    const countries = message.match(countryRegex);
    if (countries) entities.countries = countries;

    return entities;
  }

  public routeToAgent(
    agentId: string, 
    message: string, 
    context: TravelContext
  ): {
    agent: TravelAgent;
    conversationConfig: ConversationConfig;
    enhancedMessage: string;
  } {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    // Update active conversation
    this.activeConversations.set(context.userId, agentId);

    // Create enhanced message with context
    const enhancedMessage = this.createEnhancedMessage(message, context, agent);

    // Create conversation config specific to the agent
    const conversationConfig: ConversationConfig = {
      agent_id: agent.agentId,
    };

    return {
      agent,
      conversationConfig,
      enhancedMessage
    };
  }

  private createEnhancedMessage(
    message: string, 
    context: TravelContext, 
    agent: TravelAgent
  ): string {
    let enhancedMessage = message;

    // Add context information for the agent
    const contextInfo = [];

    if (context.currentLocation) {
      contextInfo.push(`User location: ${context.currentLocation.address || `${context.currentLocation.latitude}, ${context.currentLocation.longitude}`}`);
    }

    if (context.tripContext) {
      if (context.tripContext.destination) {
        contextInfo.push(`Destination: ${context.tripContext.destination}`);
      }
      if (context.tripContext.departureDate) {
        contextInfo.push(`Departure: ${context.tripContext.departureDate}`);
      }
      if (context.tripContext.returnDate) {
        contextInfo.push(`Return: ${context.tripContext.returnDate}`);
      }
      if (context.tripContext.travelers) {
        contextInfo.push(`Travelers: ${context.tripContext.travelers}`);
      }
      if (context.tripContext.budget) {
        contextInfo.push(`Budget: ${context.tripContext.budget.min}-${context.tripContext.budget.max} ${context.tripContext.budget.currency}`);
      }
    }

    // Add recent conversation history
    const recentHistory = context.conversationHistory
      .slice(-3)
      .map(h => `${h.agentId}: ${h.message}`)
      .join('\n');

    if (recentHistory) {
      contextInfo.push(`Recent conversation:\n${recentHistory}`);
    }

    if (contextInfo.length > 0) {
      enhancedMessage = `Context: ${contextInfo.join(', ')}\n\nUser message: ${message}`;
    }

    return enhancedMessage;
  }

  public updateTravelContext(
    userId: string,
    updates: Partial<TravelContext>
  ): TravelContext {
    // In a real implementation, this would update a database
    // For now, we'll return the merged context
    return {
      userId,
      ...updates
    } as TravelContext;
  }

  public getAgentCapabilities(agentId: string): string[] {
    const agent = this.agents.get(agentId);
    return agent ? agent.capabilities : [];
  }

  public getAllAgents(): TravelAgent[] {
    return Array.from(this.agents.values());
  }

  public getCurrentAgent(userId: string): TravelAgent | null {
    const agentId = this.activeConversations.get(userId);
    return agentId ? this.agents.get(agentId) || null : null;
  }

  public switchAgent(userId: string, newAgentId: string): boolean {
    if (this.agents.has(newAgentId)) {
      this.activeConversations.set(userId, newAgentId);
      return true;
    }
    return false;
  }

  public suggestAgent(message: string, context: TravelContext): {
    suggestion: TravelAgent;
    reason: string;
    confidence: number;
  } {
    const analysis = this.analyzeIntent(message, context);
    const agent = this.agents.get(analysis.primaryAgent)!;
    
    return {
      suggestion: agent,
      reason: `Based on your message about "${analysis.intent}", I recommend speaking with our ${agent.name}`,
      confidence: analysis.confidence
    };
  }
} 