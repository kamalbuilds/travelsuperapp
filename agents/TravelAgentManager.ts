import { AGENT_IDS, ElevenLabsAgentConfig, TRAVEL_AGENTS_CONFIG } from './config/AgentConfigurations';

export interface AgentTransferContext {
  fromAgent: string;
  toAgent: string;
  userContext: string;
  transferReason: string;
  timestamp: Date;
  conversationHistory?: string[];
}

export interface AgentSession {
  sessionId: string;
  currentAgent: string;
  userId: string;
  conversationHistory: Array<{
    agentId: string;
    message: string;
    timestamp: Date;
    type: 'user' | 'agent';
  }>;
  context: {
    destination?: string;
    travelDates?: {
      departure?: string;
      return?: string;
    };
    travelers?: number;
    budget?: {
      min?: number;
      max?: number;
      currency?: string;
    };
    preferences?: string[];
    specialRequests?: string[];
  };
  activeTools: string[];
  transferHistory: AgentTransferContext[];
}

export class TravelAgentManager {
  private sessions: Map<string, AgentSession> = new Map();
  private agentConfigs: Record<string, ElevenLabsAgentConfig>;
  private agentIds: Record<string, string>;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.agentConfigs = TRAVEL_AGENTS_CONFIG;
    this.agentIds = AGENT_IDS;
  }

  /**
   * Create all travel agents in ElevenLabs using the API
   */
  async createAllAgents(): Promise<Record<string, string>> {
    const createdAgents: Record<string, string> = {};
    
    for (const [agentKey, config] of Object.entries(this.agentConfigs)) {
      try {
        console.log(`Creating ${config.name}...`);
        const agentId = await this.createAgent(config);
        createdAgents[agentKey] = agentId;
        console.log(`✅ Created ${config.name} with ID: ${agentId}`);
      } catch (error) {
        console.error(`❌ Failed to create ${config.name}:`, error);
        throw error;
      }
    }
    
    return createdAgents;
  }

  /**
   * Create a single agent using ElevenLabs API
   */
  private async createAgent(config: ElevenLabsAgentConfig): Promise<string> {
    const response = await fetch('https://api.elevenlabs.io/v1/convai/agents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey
      },
      body: JSON.stringify(config)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`ElevenLabs API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.agent_id;
  }

  /**
   * Start a new conversation session with the orchestrator
   */
  async startSession(userId: string): Promise<AgentSession> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: AgentSession = {
      sessionId,
      currentAgent: 'orchestrator',
      userId,
      conversationHistory: [],
      context: {},
      activeTools: [],
      transferHistory: []
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Transfer conversation to a specialist agent
   */
  async transferToAgent(
    sessionId: string, 
    targetAgent: string, 
    transferContext: Partial<AgentTransferContext>
  ): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const transferRecord: AgentTransferContext = {
      fromAgent: session.currentAgent,
      toAgent: targetAgent,
      userContext: transferContext.userContext || '',
      transferReason: transferContext.transferReason || 'User request',
      timestamp: new Date(),
      conversationHistory: session.conversationHistory.slice(-5).map(h => h.message)
    };

    // Update session
    session.currentAgent = targetAgent;
    session.transferHistory.push(transferRecord);

    // Add transfer message to conversation history
    session.conversationHistory.push({
      agentId: 'system',
      message: `Transferring to ${this.agentConfigs[targetAgent].name}`,
      timestamp: new Date(),
      type: 'agent'
    });

    this.sessions.set(sessionId, session);
    return true;
  }

  /**
   * Get the current agent ID for a session
   */
  getCurrentAgentId(sessionId: string): string | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    
    return this.agentIds[session.currentAgent] || null;
  }

  /**
   * Add message to conversation history
   */
  addMessage(
    sessionId: string, 
    message: string, 
    type: 'user' | 'agent', 
    agentId?: string
  ): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.conversationHistory.push({
      agentId: agentId || session.currentAgent,
      message,
      timestamp: new Date(),
      type
    });

    this.sessions.set(sessionId, session);
  }

  /**
   * Update session context with travel information
   */
  updateContext(sessionId: string, contextUpdate: Partial<AgentSession['context']>): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.context = { ...session.context, ...contextUpdate };
    this.sessions.set(sessionId, session);
  }

  /**
   * Get session information
   */
  getSession(sessionId: string): AgentSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Get available agents and their capabilities
   */
  getAvailableAgents(): Record<string, { name: string; description: string; capabilities: string[] }> {
    return {
      orchestrator: {
        name: "Travel Orchestrator",
        description: "Main coordinator for all travel needs",
        capabilities: ["Route to specialists", "Coordinate complex requests", "Synthesize recommendations"]
      },
      flight_booking: {
        name: "Flight Booking Specialist", 
        description: "Expert in flight search and booking",
        capabilities: ["Flight search", "Price comparison", "Booking assistance", "Route optimization"]
      },
      hotel_booking: {
        name: "Hotel Booking Specialist",
        description: "Accommodation expert for all lodging needs", 
        capabilities: ["Hotel search", "Property comparison", "Booking assistance", "Special requests"]
      },
      local_experience: {
        name: "Local Experience Guide",
        description: "Authentic local experiences and activities",
        capabilities: ["Activity recommendations", "Restaurant suggestions", "Itinerary creation", "Cultural insights"]
      },
      emergency_assistance: {
        name: "Emergency Assistance Specialist",
        description: "24/7 emergency and urgent travel support",
        capabilities: ["Emergency response", "Embassy contacts", "Crisis management", "Insurance guidance"]
      },
      weather_safety: {
        name: "Weather & Safety Specialist", 
        description: "Weather forecasts and travel safety information",
        capabilities: ["Weather forecasts", "Safety advisories", "Health requirements", "Risk assessment"]
      }
    };
  }

  /**
   * End a conversation session
   */
  endSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * Get conversation analytics for a session
   */
  getSessionAnalytics(sessionId: string): {
    totalMessages: number;
    agentsUsed: string[];
    transferCount: number;
    sessionDuration: number;
    topicsCovered: string[];
  } | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const agentsUsed = [...new Set([
      session.currentAgent,
      ...session.transferHistory.map(t => t.fromAgent),
      ...session.transferHistory.map(t => t.toAgent)
    ])];

    const sessionStart = session.conversationHistory[0]?.timestamp || new Date();
    const sessionEnd = session.conversationHistory[session.conversationHistory.length - 1]?.timestamp || new Date();
    const sessionDuration = sessionEnd.getTime() - sessionStart.getTime();

    // Extract topics from context
    const topicsCovered = [];
    if (session.context.destination) topicsCovered.push(`Destination: ${session.context.destination}`);
    if (session.context.travelDates) topicsCovered.push('Travel Dates');
    if (session.context.budget) topicsCovered.push('Budget Planning');
    if (session.context.preferences?.length) topicsCovered.push('Preferences');

    return {
      totalMessages: session.conversationHistory.length,
      agentsUsed,
      transferCount: session.transferHistory.length,
      sessionDuration,
      topicsCovered
    };
  }

  /**
   * Clean up old sessions (call periodically)
   */
  cleanupOldSessions(maxAgeHours: number = 24): number {
    const cutoffTime = Date.now() - (maxAgeHours * 60 * 60 * 1000);
    let cleanedCount = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      const lastActivity = session.conversationHistory[session.conversationHistory.length - 1]?.timestamp?.getTime() || 0;
      
      if (lastActivity < cutoffTime) {
        this.sessions.delete(sessionId);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  /**
   * Export agent configurations for CLI tool usage
   */
  exportAgentConfigs(): Record<string, any> {
    const configs: Record<string, any> = {};
    
    for (const [key, config] of Object.entries(this.agentConfigs)) {
      configs[key] = {
        name: config.name,
        config_file: `agent_configs/prod/${key.replace(/_/g, '-')}.json`,
        conversation_config: config.conversation_config,
        platform_settings: config.platform_settings,
        privacy_settings: config.privacy_settings,
        analysis_config: config.analysis_config,
        tools: config.tools
      };
    }
    
    return configs;
  }

  /**
   * Update agent IDs after creation
   */
  updateAgentIds(newAgentIds: Record<string, string>): void {
    for (const [key, id] of Object.entries(newAgentIds)) {
      if (this.agentIds[key]) {
        this.agentIds[key] = id;
      }
    }
  }

  /**
   * Get agent configuration by key
   */
  getAgentConfig(agentKey: string): ElevenLabsAgentConfig | null {
    return this.agentConfigs[agentKey] || null;
  }

  /**
   * Validate all agent configurations
   */
  validateConfigurations(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [key, config] of Object.entries(this.agentConfigs)) {
      // Check required fields
      if (!config.name) errors.push(`${key}: Missing name`);
      if (!config.conversation_config?.agent?.prompt?.prompt) errors.push(`${key}: Missing prompt`);
      if (!config.conversation_config?.agent?.first_message) errors.push(`${key}: Missing first_message`);
      if (!config.conversation_config?.tts?.voice_id) errors.push(`${key}: Missing voice_id`);
      
      // Validate tools
      if (config.tools) {
        for (const tool of config.tools) {
          if (!tool.name || !tool.description) {
            errors.push(`${key}: Tool missing name or description`);
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export default TravelAgentManager; 