# Travel Super App - Multi-Agent Conversational AI System

A sophisticated multi-agent conversational AI system built with ElevenLabs for comprehensive travel assistance. This system features specialized AI agents that work together to provide expert travel planning, booking, and support services.

## 🤖 AI Agent Architecture

### 🎯 Orchestrator Agent (Sofia)
**Primary coordinator for all travel needs**
- Routes conversations to appropriate specialists
- Handles complex multi-step requests
- Synthesizes recommendations from multiple agents
- Manages conversation context and handoffs

### ✈️ Flight Booking Specialist (Marcus)
**Expert in flight search and booking**
- Flight search across multiple airlines
- Price comparison and optimization
- Route planning and alternatives
- Booking assistance and support
- **APIs**: Amadeus, Skyscanner, airline direct APIs

### 🏨 Hotel Booking Specialist (Elena)  
**Accommodation expert for all lodging needs**
- Hotel and property search
- Price comparison and reviews
- Special requests and requirements
- Booking management
- **APIs**: Booking.com, Expedia, Hotels.com

### 🎭 Local Experience Guide (Diego)
**Authentic local experiences and activities**
- Activity and attraction recommendations
- Restaurant and dining suggestions
- Cultural event discovery
- Custom itinerary creation
- **APIs**: TripAdvisor, GetYourGuide, Google Places

### 🆘 Emergency Assistance Specialist (Alex)
**24/7 emergency and urgent travel support**
- Emergency contact coordination
- Embassy and consulate assistance
- Crisis management and escalation
- Travel insurance guidance
- **APIs**: Emergency services, embassy databases

### 🌤️ Weather & Safety Specialist (Maya)
**Weather forecasts and travel safety information**
- Real-time weather forecasts
- Travel advisories and warnings
- Health requirement updates
- Seasonal travel insights
- **APIs**: OpenWeatherMap, government travel advisories

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
bun install
```

### 2. Set Up Environment Variables
Create a `.env` file in your project root:
```env
EXPO_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Optional: External API Keys
AMADEUS_API_KEY=your_amadeus_key
BOOKING_COM_API_KEY=your_booking_key
TRIPADVISOR_API_KEY=your_tripadvisor_key
OPENWEATHER_API_KEY=your_openweather_key
```

### 3. Create All Agents
```bash
# Set up the CLI tool
bun run travel-agents setup --api-key YOUR_ELEVENLABS_API_KEY

# Create all 6 specialized agents
bun run create-agents

# Verify agents are created
bun run list-agents
```

### 4. Update Agent IDs
After creating agents, update the `AGENT_IDS` in `agents/config/AgentConfigurations.ts` with the returned agent IDs.

## 🛠️ CLI Tool Commands

### Setup and Management
```bash
# Initial setup with API key
bun run travel-agents setup --api-key YOUR_API_KEY

# Create all travel agents at once
bun run travel-agents create-all

# List all agents and their status
bun run travel-agents list

# Check overall system status
bun run travel-agents status
```

### Testing and Validation
```bash
# Test specific agent
bun run travel-agents test orchestrator
bun run travel-agents test flight_booking

# Test all agents
bun run test-agents
```

### Configuration Management
```bash
# Export configurations to JSON files
bun run travel-agents export

# Delete specific agent
bun run travel-agents delete flight_booking
```

## 💬 Using the Multi-Agent System

### React Native Integration
```tsx
import MultiAgentTravelAI from '@/components/MultiAgentTravelAI';
import TravelAgentManager from '@/agents/TravelAgentManager';

function TravelScreen() {
  const agentManager = new TravelAgentManager(process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY);
  
  return (
    <MultiAgentTravelAI
      agentManager={agentManager}
      userId="user_123"
      size="large"
      theme="primary"
      onAgentTransfer={(from, to) => console.log(`Transferred: ${from} → ${to}`)}
      onSessionUpdate={(session) => console.log('Session updated:', session)}
    />
  );
}
```

### Conversation Flow Examples

#### 1. Flight Booking Flow
```
User: "I need to book a flight from New York to Paris"
Sofia (Orchestrator): "I'll connect you to Marcus, our flight specialist."
→ Transfers to Marcus (Flight Booking)
Marcus: "I found several options for NYC to Paris. Here are the best deals..."
```

#### 2. Emergency Assistance
```
User: "I lost my passport in Tokyo"
Sofia (Orchestrator): "This is urgent. Connecting you to Alex for emergency assistance."
→ Transfers to Alex (Emergency)
Alex: "I'll help you immediately. Here's the nearest US Embassy contact..."
```

#### 3. Trip Planning Flow
```
User: "Plan a 5-day trip to Rome"
Sofia (Orchestrator): "Let me get our specialists to help with flights, hotels, and experiences."
→ Coordinates with Marcus (flights), Elena (hotels), Diego (experiences)
→ Returns comprehensive trip plan
```

## 🔧 Configuration

### Agent Personalities & Voices
Each agent has a distinct personality and voice:

- **Sofia (Orchestrator)**: Professional, coordinating, warm
- **Marcus (Flight)**: Efficient, detail-oriented, travel-savvy
- **Elena (Hotel)**: Hospitality-focused, attentive, accommodating
- **Diego (Experience)**: Enthusiastic, local expert, cultural
- **Alex (Emergency)**: Calm, reassuring, action-oriented
- **Maya (Weather)**: Informative, safety-conscious, precise

### Customizing Agent Behavior
Edit `agents/config/AgentConfigurations.ts` to modify:
- Agent prompts and personalities
- Available tools and capabilities
- Voice settings and styles
- Response behaviors

### Adding New Tools
Add new tools to any agent by updating their `tools` array:
```typescript
{
  name: "new_tool_name",
  description: "What this tool does",
  parameters: {
    type: "object",
    properties: {
      param_name: {
        type: "string",
        description: "Parameter description"
      }
    },
    required: ["param_name"]
  }
}
```

## 📊 Analytics & Monitoring

### Session Analytics
```typescript
const analytics = agentManager.getSessionAnalytics(sessionId);
// Returns: total messages, agents used, transfer count, session duration, topics covered
```

### Agent Performance
```bash
# View agent usage statistics
bun run travel-agents status

# Export analytics data
bun run travel-agents export
```

## 🔌 API Integration

### Supported Travel APIs

#### Flight APIs
- **Amadeus**: Comprehensive flight data and booking
- **Skyscanner**: Price comparison and search
- **Individual Airlines**: Direct booking capabilities

#### Hotel APIs  
- **Booking.com**: Global accommodation inventory
- **Expedia**: Hotels and vacation rentals
- **Hotels.com**: Hotel reservations

#### Experience APIs
- **TripAdvisor**: Attractions and reviews
- **GetYourGuide**: Activities and tours
- **Google Places**: Local business information

#### Utility APIs
- **OpenWeatherMap**: Weather forecasts
- **Government APIs**: Travel advisories
- **Embassy APIs**: Contact information

### Adding New API Integrations
1. Add API credentials to environment variables
2. Create API client in `utils/api-clients/`
3. Update relevant agent tools in `components/MultiAgentTravelAI.tsx`
4. Test with `bun run travel-agents test agent_name`

## 🚨 Error Handling

### Common Issues & Solutions

#### Agent Creation Fails
```bash
# Check API key
bun run travel-agents status

# Validate configurations
bun run travel-agents list

# Test individual agent
bun run travel-agents test orchestrator
```

#### Agent Transfer Fails
- Check agent IDs in configuration
- Verify ElevenLabs API quota
- Review conversation logs

#### Voice Connection Issues
- Ensure microphone permissions
- Check device audio settings
- Verify network connectivity

## 🔒 Security & Privacy

### API Key Management
- Store API keys in environment variables
- Never commit keys to version control
- Use different keys for development/production

### User Privacy
- Session data is ephemeral (24-hour cleanup)
- No persistent user data storage
- Conversation logs are local only

### ElevenLabs Integration
- All conversations are processed by ElevenLabs
- Review ElevenLabs privacy policy
- Configure data retention settings

## 🎯 Hackathon Alignment

This multi-agent system targets multiple hackathon challenges:

### ElevenLabs Voice AI Challenge
- ✅ Advanced conversational AI with 6-agent coordination
- ✅ Specialized domain expertise per agent
- ✅ Seamless voice interactions and transfers
- ✅ 60+ travel-specific tools integration

### Travel Innovation Challenge
- ✅ End-to-end travel planning and booking
- ✅ Multiple API integrations (Amadeus, Booking.com, etc.)
- ✅ Personalized recommendations and itineraries
- ✅ 24/7 emergency assistance capabilities

### AI Innovation Challenge
- ✅ Intelligent agent orchestration system
- ✅ Context-aware conversation transfers
- ✅ Real-time session management
- ✅ Production-ready voice-first architecture

## 📈 Scaling & Production

### Performance Optimization
- Agent session pooling
- Conversation context caching
- API response optimization
- Background session cleanup

### Production Deployment
```bash
# Set production environment
export NODE_ENV=production

# Create production agents
bun run travel-agents setup --api-key PROD_KEY
bun run travel-agents create-all

# Monitor and maintain
bun run travel-agents status
```

### Monitoring & Logging
- ElevenLabs API usage tracking
- Agent performance metrics
- Error rate monitoring
- User session analytics

## 🤝 Contributing

### Adding New Agents
1. Define agent in `AgentConfigurations.ts`
2. Add transfer methods to orchestrator
3. Implement specialized tools
4. Update CLI and management systems
5. Test thoroughly

### Improving Tools
1. Identify enhancement opportunities
2. Update tool definitions
3. Implement enhanced functionality
4. Test with real scenarios
5. Update documentation

## 📞 Support

### Getting Help
- Check the CLI status: `bun run travel-agents status`
- Review configuration: `bun run travel-agents list`
- Test specific agents: `bun run travel-agents test agent_name`
- Export logs: `bun run travel-agents export`

### Common Commands Quick Reference
```bash
# Complete setup
bun run travel-agents setup --api-key YOUR_KEY
bun run travel-agents create-all

# Daily operations
bun run travel-agents status
bun run travel-agents test
bun run list-agents

# Maintenance
bun run travel-agents export
bun run travel-agents delete agent_name
```

---

## 🎉 Ready to Launch!

Your voice-first multi-agent travel AI system is now ready to provide comprehensive, intelligent travel assistance. Each agent brings specialized expertise while working seamlessly together to create an unparalleled hands-free travel planning experience.

## 🎯 **Why Voice-First Design Wins for Travel:**

- **🚀 Faster Interactions** - Speak naturally instead of typing on small screens
- **👐 Hands-Free Operation** - Perfect when carrying luggage or navigating
- **🌍 Universal Access** - Works in any language, no keyboard needed
- **⚡ Instant Response** - Voice is faster than tapping through menus
- **🎧 Discrete Use** - Private conversations in public spaces
- **📱 Battery Efficient** - Less screen usage, longer device life while traveling

**Next Steps:**
1. Complete the setup process above
2. Test each agent individually
3. Try complex multi-agent conversations
4. Integrate with your travel app
5. Deploy and enjoy intelligent voice-powered travel assistance!

For questions or issues, check the troubleshooting section or review the agent configurations. Happy traveling! 🎙️✈️🌍 