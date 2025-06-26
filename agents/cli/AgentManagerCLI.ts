#!/usr/bin/env bun

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { TravelAgentManager } from '../TravelAgentManager';
import { TRAVEL_AGENTS_CONFIG } from '../config/AgentConfigurations';

// Environment setup
const API_KEY = process.env.ELE_LABS;
if (!API_KEY) {
  console.error('❌ Missing ELE_LABS environment variable');
  process.exit(1);
}

const configPath = join(process.cwd(), '.travel-agents-config.json');

class AgentManagerCLI {
  private manager: TravelAgentManager;

  constructor() {
    this.manager = new TravelAgentManager(API_KEY);
  }

  async createAllAgents(): Promise<void> {
    console.log('🚀 Setting up Travel Agent System...\n');

    // Validate configurations first
    const validation = this.manager.validateConfigurations();
    if (!validation.valid) {
      console.error('❌ Configuration validation failed:');
      validation.errors.forEach(error => console.error(`  - ${error}`));
      return;
    }
    console.log('✅ Configurations validated\n');

    console.log('📋 ElevenLabs agents must be created through their dashboard.');
    console.log('   Follow these steps to create your travel agents:\n');

    console.log('1. 🌐 Go to https://elevenlabs.io/app/conversational-ai');
    console.log('2. 🔑 Sign in with your ElevenLabs account');
    console.log('3. ➕ Click "Create new agent" for each of the following:\n');

    const agentKeys = Object.keys(TRAVEL_AGENTS_CONFIG);

    agentKeys.forEach((key, index) => {
      const config = TRAVEL_AGENTS_CONFIG[key];
      console.log(`   📝 Agent ${index + 1}: ${config.name}`);
      console.log(`      Description: ${config.conversation_config.agent.prompt.prompt.split('.')[0]}...`);
      console.log(`      Voice: ${this.getVoiceName(config.conversation_config.tts.voice_id)}`);
      console.log('');
    });

    console.log('4. 📋 For each agent, configure:');
    console.log('   • Copy the system prompt from agents/config/AgentConfigurations.ts');
    console.log('   • Set the first message');
    console.log('   • Select the recommended voice');
    console.log('   • Add tools if needed');
    console.log('   • Enable authentication if desired\n');

    console.log('5. 📝 After creating all agents, update .travel-agents-config.json with their IDs:');
    console.log('   {');
    console.log('     "agentIds": {');
    agentKeys.forEach((key, index) => {
      const comma = index < agentKeys.length - 1 ? ',' : '';
      console.log(`       "${key}": "your_${key}_agent_id_here"${comma}`);
    });
    console.log('     }');
    console.log('   }');
    console.log('');

    // Create a template config file
    const templateConfig = {
      agentIds: agentKeys.reduce((acc, key) => {
        acc[key] = `your_${key}_agent_id_here`;
        return acc;
      }, {} as Record<string, string>),
      created: new Date().toISOString(),
      instructions: 'Replace agent IDs with actual IDs from ElevenLabs dashboard'
    };

    writeFileSync(configPath, JSON.stringify(templateConfig, null, 2));
    console.log(`📄 Template configuration saved to: ${configPath}`);
    console.log('');
    console.log('🚀 After setup, run: bun run test-agents');
  }

  async testAgents(): Promise<void> {
    console.log('🧪 Testing Travel Agent System...\n');

    // Check if config file exists
    try {
      const configData = readFileSync(configPath, 'utf8');
      const config = JSON.parse(configData);
      
      if (!config.agentIds) {
        console.error('❌ No agent IDs found in configuration file');
        console.log('   Run: bun run create-agents first');
        return;
      }

      // Check if any IDs are still templates
      const templateIds = Object.entries(config.agentIds).filter(
        ([, id]) => typeof id === 'string' && id.includes('your_') && id.includes('_here')
      );

      if (templateIds.length > 0) {
        console.error('❌ Found template agent IDs that need to be replaced:');
        templateIds.forEach(([key, id]) => {
          console.error(`   ${key}: ${id}`);
        });
        console.log('\n   Please update .travel-agents-config.json with real agent IDs from ElevenLabs dashboard');
        return;
      }

      // Update manager with agent IDs
      this.manager.updateAgentIds(config.agentIds);

      console.log('✅ Configuration loaded successfully');
      console.log(`📊 Found ${Object.keys(config.agentIds).length} agent configurations\n`);

      // Test each agent configuration
      let allPassed = true;
      for (const [agentKey, agentId] of Object.entries(config.agentIds)) {
        console.log(`🔍 Testing ${agentKey} (${agentId})...`);
        
        const agentConfig = this.manager.getAgentConfig(agentKey);
        if (!agentConfig) {
          console.log(`   ❌ No configuration found for ${agentKey}`);
          allPassed = false;
          continue;
        }

        // Test if agent ID format looks valid
        if (typeof agentId !== 'string' || agentId.length < 10) {
          console.log(`   ❌ Invalid agent ID format: ${agentId}`);
          allPassed = false;
          continue;
        }

        console.log(`   ✅ Configuration valid`);
        console.log(`   🎯 Voice: ${this.getVoiceName(agentConfig.conversation_config.tts.voice_id)}`);
        console.log(`   🔧 Tools: ${agentConfig.tools?.length || 0} configured`);
      }

      if (allPassed) {
        console.log('\n🎉 All agent tests passed!');
        console.log('   Your travel agent system is ready to use.');
        console.log('   Available agents:');
        
        const availableAgents = this.manager.getAvailableAgents();
        Object.entries(availableAgents).forEach(([key, info]) => {
          console.log(`   • ${info.name}: ${info.description}`);
        });
      } else {
        console.log('\n❌ Some tests failed. Please check your configuration.');
      }

    } catch (error) {
      console.error('❌ Failed to load configuration:', error);
      console.log('   Run: bun run create-agents first');
    }
  }

  async listAgents(): Promise<void> {
    console.log('📋 Available Travel Agents:\n');
    
    const agents = this.manager.getAvailableAgents();
    Object.entries(agents).forEach(([key, info]) => {
      console.log(`🤖 ${info.name}`);
      console.log(`   Key: ${key}`);
      console.log(`   Description: ${info.description}`);
      console.log(`   Capabilities: ${info.capabilities.join(', ')}`);
      console.log('');
    });
  }

  async exportConfigs(): Promise<void> {
    console.log('📤 Exporting agent configurations...\n');
    
    const configs = this.manager.exportAgentConfigs();
    const exportPath = join(process.cwd(), 'agent-configs-export.json');
    
    writeFileSync(exportPath, JSON.stringify(configs, null, 2));
    console.log(`✅ Configurations exported to: ${exportPath}`);
    console.log(`📊 ${Object.keys(configs).length} agent configurations exported`);
  }

  private getVoiceName(voiceId: string): string {
    const voiceMap: Record<string, string> = {
      'g6xIsTj2HwM6VR4iXFCw': 'Jessica Anne Bogart (Empathetic)',
      'JBFqnCBsd6RMkjVDRZzb': 'George (Warm British)',
      'LcfcDJNUP1GQjkzn1xUU': 'Emily (Professional American)',  
      'oWAxZDx7w5VEj9dCyTzz': 'Grace (Warm Female)',
      'pNInz6obpgDQGcFmaJgB': 'Adam (Confident Male)',
      'ErXwobaYiN019PkySvjV': 'Antoni (Warm Male)',
      'VR6AewLTigWG4xSOukaG': 'Arnold (Strong Male)',
      'AZnzlk1XvdvUeBnXmlld': 'Domi (Strong Female)',
      'EXAVITQu4vr4xnSDxMaL': 'Bella (Calm Female)',
      'MF3mGyEYCl7XYWbV9V6O': 'Elli (Expressive Female)',
      'TxGEqnHWrfWFTfGW9XjX': 'Josh (Calm Male)',
      'XB0fDUnXU5powFXDhCwa': 'Alice (Calm Female)'
    };
    return voiceMap[voiceId] || `Custom Voice (${voiceId})`;
  }
}

// CLI interface
async function main() {
  const cli = new AgentManagerCLI();
  const command = process.argv[2];

  switch (command) {
    case 'create-all':
      await cli.createAllAgents();
      break;
    case 'test':
      await cli.testAgents();
      break;
    case 'list':
      await cli.listAgents();
      break;
    case 'export':
      await cli.exportConfigs();
      break;
    default:
      console.log('🎛️  Travel Agent Manager CLI\n');
      console.log('Available commands:');
      console.log('  create-all  Setup instructions for creating agents');
      console.log('  test        Test existing agent configurations');
      console.log('  list        List all available agent types');
      console.log('  export      Export agent configurations to JSON');
      console.log('');
      console.log('Usage: bun run agents/cli/AgentManagerCLI.ts <command>');
      break;
  }
}

// Run if this file is executed directly  
main().catch(console.error);