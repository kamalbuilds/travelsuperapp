import { useConversation } from '@11labs/react';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TravelAgentManager, { AgentSession } from '../agents/TravelAgentManager';
import { AGENT_IDS } from '../agents/config/AgentConfigurations';

// Tool parameter interfaces
interface ToolParams {
  [key: string]: any;
}

interface MultiAgentTravelAIProps {
  size?: 'small' | 'medium' | 'large';
  theme?: 'primary' | 'secondary' | 'emergency';
  agentManager: TravelAgentManager;
  userId: string;
  onAgentTransfer?: (fromAgent: string, toAgent: string) => void;
  onSessionUpdate?: (session: AgentSession) => void;
}

export default function MultiAgentTravelAI({
  size = 'medium',
  theme = 'primary',
  agentManager,
  userId,
  onAgentTransfer,
  onSessionUpdate
}: MultiAgentTravelAIProps) {
  const [session, setSession] = useState<AgentSession | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentAgentName, setCurrentAgentName] = useState('Travel Orchestrator');
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [lastTransfer, setLastTransfer] = useState<string | null>(null);

  // Animation for active conversation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    if (conversation.status === 'connected') {
      pulse.start();
    } else {
      pulse.stop();
      pulseAnim.setValue(1);
    }

    return () => pulse.stop();
  }, [pulseAnim]);

  // Get current agent ID based on session
  const getCurrentAgentId = useCallback(() => {
    if (!session) return AGENT_IDS.orchestrator;
    return agentManager.getCurrentAgentId(session.sessionId) || AGENT_IDS.orchestrator;
  }, [session, agentManager]);

  // Set up conversation with dynamic agent ID
  const conversation = useConversation({
    agentId: getCurrentAgentId(),
    onConnect: () => {
      console.log('🎙️ Connected to agent:', currentAgentName);
    },
    onDisconnect: () => {
      console.log('🔇 Disconnected from agent:', currentAgentName);
    },
    onError: (error: any) => {
      console.error('❌ Conversation error:', error);
      Alert.alert('Connection Error', 'Failed to connect to travel assistant. Please try again.');
    },
    onMessage: (message: any) => {
      if (session) {
        agentManager.addMessage(session.sessionId, message.message, 'agent');
        onSessionUpdate?.(agentManager.getSession(session.sessionId)!);
      }
    },
    clientTools: {
      // Orchestrator transfer tools
      transfer_to_flight_agent: async ({ context, user_request }: any) => {
        await handleAgentTransfer('flight_booking', { userContext: context, transferReason: user_request });
        return `Connecting you to Marcus, our flight booking specialist. ${context}`;
      },
      transfer_to_hotel_agent: async ({ context, user_request }: any) => {
        await handleAgentTransfer('hotel_booking', { userContext: context, transferReason: user_request });
        return `Connecting you to Elena, our accommodation specialist. ${context}`;
      },
      transfer_to_experience_agent: async ({ context, destination }: any) => {
        await handleAgentTransfer('local_experience', { userContext: context, transferReason: `Experience recommendations for ${destination}` });
        return `Connecting you to Diego, your local experience guide for ${destination}. ${context}`;
      },
      transfer_to_emergency_agent: async ({ emergency_type, location }: any) => {
        await handleAgentTransfer('emergency_assistance', { userContext: location || 'Unknown location', transferReason: emergency_type });
        return `Immediately connecting you to Alex, our emergency assistance specialist for ${emergency_type}.`;
      },
      transfer_to_weather_agent: async ({ destination, travel_dates }: any) => {
        await handleAgentTransfer('weather_safety', { userContext: `${destination} - ${travel_dates || 'Dates TBD'}`, transferReason: 'Weather and safety information' });
        return `Connecting you to Maya, our weather and safety specialist for ${destination}.`;
      },

      // Flight booking tools
      search_flights: async ({ origin, destination, departure_date, return_date, passengers, class: bookingClass }: any) => {
        // Update session context
        if (session) {
          agentManager.updateContext(session.sessionId, {
            destination,
            travelDates: { departure: departure_date, return: return_date },
            travelers: passengers
          });
        }
        
        // Mock flight search - replace with real API
        return `Found flights from ${origin} to ${destination} on ${departure_date}. Best options: Direct flight $299, Connecting flight $199. Premium options available.`;
      },
      check_flight_prices: async ({ flight_id, booking_class }: ToolParams) => {
        return `Current price for flight ${flight_id} in ${booking_class}: $299. Price includes taxes and fees.`;
      },
      initiate_flight_booking: async ({ flight_details, total_price }: ToolParams) => {
        // Navigate to booking flow in app
        return `Initiating booking for ${flight_details} at $${total_price}. Redirecting to secure booking page...`;
      },

      // Hotel booking tools
      search_hotels: async ({ destination, check_in_date, check_out_date, guests, rooms, min_price, max_price, property_type }: ToolParams) => {
        if (session) {
          agentManager.updateContext(session.sessionId, {
            destination,
            travelDates: { departure: check_in_date, return: check_out_date },
            travelers: guests
          });
        }
        
        return `Found ${property_type || 'hotels'} in ${destination} for ${check_in_date} to ${check_out_date}. Top options: Luxury Hotel $450/night, Boutique Hotel $299/night, Budget Hotel $99/night.`;
      },
      get_hotel_details: async ({ hotel_id, check_in_date, check_out_date }) => {
        return `Hotel details for ${hotel_id}: 4-star property, pool, gym, free WiFi. Available for ${check_in_date} to ${check_out_date}.`;
      },
      initiate_hotel_booking: async ({ hotel_details, total_price, special_requests }) => {
        return `Initiating booking for ${hotel_details} at $${total_price}. Special requests: ${special_requests}. Redirecting to booking page...`;
      },

      // Experience tools
      search_activities: async ({ destination, categories, date_range, budget_level, group_size }) => {
        if (session) {
          agentManager.updateContext(session.sessionId, {
            destination,
            preferences: categories,
            travelers: group_size
          });
        }
        
        return `Found amazing ${budget_level} activities in ${destination}: ${categories?.join(', ')}. Top picks: City walking tour, Local cooking class, Museum visits, Scenic viewpoints.`;
      },
      search_restaurants: async ({ destination, cuisine_type, price_range, dining_style, dietary_restrictions }) => {
        return `Best ${cuisine_type} restaurants in ${destination} (${price_range}): Authentic local spots, Fine dining establishments, Street food favorites. All accommodate ${dietary_restrictions?.join(', ')}.`;
      },
      get_local_events: async ({ destination, start_date, end_date, event_types }) => {
        return `Events in ${destination} from ${start_date} to ${end_date}: ${event_types?.join(', ')} - Festival, Concert, Market, Cultural celebration.`;
      },
      create_itinerary: async ({ activities, duration, preferences }) => {
        return `Created ${duration}-day itinerary with ${activities.length} activities: ${activities.slice(0, 3).join(', ')}... Optimized for ${preferences}.`;
      },

      // Emergency tools
      get_emergency_contacts: async ({ location, emergency_type }) => {
        return `Emergency contacts for ${location}: ${emergency_type === 'medical' ? 'Hospital: +1-xxx-xxx, Ambulance: 911' : emergency_type === 'police' ? 'Police: 911, Local station: +1-xxx-xxx' : 'General emergency: 911'}`;
      },
      find_nearest_embassy: async ({ location, nationality }) => {
        return `Nearest ${nationality} embassy/consulate to ${location}: Address: 123 Embassy St, Phone: +1-xxx-xxx-xxxx, Emergency line: +1-xxx-xxx-xxxx`;
      },
      check_travel_insurance: async ({ incident_type, insurance_provider }) => {
        return `Travel insurance guidance for ${incident_type}: Contact ${insurance_provider || 'your provider'} at xxx-xxx-xxxx. Claim reference needed. Coverage typically includes medical, trip cancellation.`;
      },
      escalate_to_human_emergency: async ({ emergency_summary, urgency_level }) => {
        return `ESCALATING ${urgency_level} emergency: ${emergency_summary}. Human operator will contact you within 2 minutes. Stay on the line.`;
      },

      // Weather/Safety tools
      get_weather_forecast: async ({ destination, start_date, end_date }) => {
        return `Weather forecast for ${destination} (${start_date} to ${end_date || 'TBD'}): Sunny 75°F, light rain possible. Pack layers and light rain jacket.`;
      },
      get_travel_advisories: async ({ destination_country, traveler_nationality }) => {
        return `Travel advisory for ${destination_country}: Level 1 - Exercise normal precautions. No special restrictions for ${traveler_nationality} travelers.`;
      },
      check_health_requirements: async ({ destination_country, origin_country, travel_date }) => {
        return `Health requirements for ${destination_country} from ${origin_country}: No vaccinations required. COVID-19 policies: Check current guidelines.`;
      },
      get_seasonal_information: async ({ destination, month }) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${destination} in ${months[month - 1]}: Peak/off-season info, weather patterns, local events, best activities for the season.`;
      }
    }
  });

  // Handle agent transfers
  const handleAgentTransfer = async (targetAgent: string, transferContext: any) => {
    if (!session) return;

    try {
      await agentManager.transferToAgent(session.sessionId, targetAgent, transferContext);
      
      // Update UI
      const agentNames = {
        orchestrator: 'Sofia (Orchestrator)',
        flight_booking: 'Marcus (Flight Specialist)',
        hotel_booking: 'Elena (Hotel Specialist)', 
        local_experience: 'Diego (Experience Guide)',
        emergency_assistance: 'Alex (Emergency Specialist)',
        weather_safety: 'Maya (Weather & Safety)'
      };
      
      setCurrentAgentName(agentNames[targetAgent as keyof typeof agentNames] || 'Travel Specialist');
      setLastTransfer(targetAgent);
      
      // Disconnect and reconnect to new agent
      if (conversation.status === 'connected') {
        conversation.endSession();
      }
      
      // Small delay before reconnecting
      setTimeout(() => {
        conversation.startSession({
          agentId: agentManager.getCurrentAgentId(session.sessionId) || AGENT_IDS.orchestrator
        });
      }, 1000);

      onAgentTransfer?.(session.currentAgent, targetAgent);
      onSessionUpdate?.(agentManager.getSession(session.sessionId)!);
      
    } catch (error) {
      console.error('Failed to transfer agent:', error);
      Alert.alert('Transfer Error', 'Failed to connect to specialist. Please try again.');
    }
  };

  // Start new session
  const startSession = async () => {
    try {
      setIsConnecting(true);
      const newSession = await agentManager.startSession(userId);
      setSession(newSession);
      setCurrentAgentName('Sofia (Orchestrator)');
      
      // Start conversation with orchestrator
      conversation.startSession({
        agentId: AGENT_IDS.orchestrator
      });
      
      onSessionUpdate?.(newSession);
    } catch (error) {
      console.error('Failed to start session:', error);
      Alert.alert('Connection Error', 'Failed to start travel session. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // End session
  const endSession = () => {
    if (session) {
      agentManager.endSession(session.sessionId);
      setSession(null);
      setCurrentAgentName('Travel Orchestrator');
      setLastTransfer(null);
    }
    
    if (conversation.status === 'connected') {
      conversation.endSession();
    }
  };

  // Get button styles based on size and theme
  const getButtonStyle = () => {
    const sizeStyles = {
      small: { width: 50, height: 50 },
      medium: { width: 70, height: 70 },
      large: { width: 90, height: 90 }
    };

    const themeStyles = {
      primary: { backgroundColor: '#3B82F6' },
      secondary: { backgroundColor: '#8B5CF6' },
      emergency: { backgroundColor: '#DC2626' }
    };

    return [
      styles.button,
      sizeStyles[size],
      themeStyles[theme],
      conversation.status === 'connected' && styles.activeButton
    ];
  };

  const getIconSize = () => {
    const iconSizes = { small: 24, medium: 32, large: 40 };
    return iconSizes[size];
  };

  const handlePress = () => {
    if (conversation.status === 'connected') {
      endSession();
    } else if (session) {
      // Reconnect to current agent
      conversation.startSession({
        agentId: getCurrentAgentId()
      });
    } else {
      startSession();
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[{ transform: [{ scale: pulseAnim }] }]}>
        <TouchableOpacity
          style={getButtonStyle()}
          onPress={handlePress}
          disabled={isConnecting}
        >
          <MaterialIcons
            name={
              isConnecting 
                ? "hourglass-empty"
                : conversation.status === 'connected'
                ? "mic"
                : "travel-explore"
            }
            size={getIconSize()}
            color="white"
          />
        </TouchableOpacity>
      </Animated.View>
      
      {session && (
        <View style={styles.agentInfo}>
          <Text style={styles.agentName}>{currentAgentName}</Text>
          {lastTransfer && (
            <Text style={styles.transferInfo}>
              Recently transferred to {lastTransfer.replace('_', ' ')} specialist
            </Text>
          )}
          <Text style={styles.statusText}>
            {conversation.status === 'connected' ? 'Listening...' : 'Tap to talk'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  button: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  activeButton: {
    shadowColor: '#3B82F6',
    shadowOpacity: 0.6,
  },
  agentInfo: {
    alignItems: 'center',
    maxWidth: 200,
  },
  agentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  transferInfo: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 2,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
}); 