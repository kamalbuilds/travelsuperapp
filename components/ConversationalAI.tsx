'use dom';

import { useConversation } from "@11labs/react";
import { Audio } from 'expo-av';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

async function requestMicrophonePermission() {
  try {
    console.log('🎤 Requesting microphone permission with expo-av...');
    console.log('📱 Platform:', Platform.OS);
    
    if (Platform.OS === 'web') {
      // Use web API for web platform
      console.log('🌐 Using web navigator.mediaDevices...');
      console.log('🌐 Navigator available:', !!navigator);
      console.log('📱 MediaDevices available:', !!navigator?.mediaDevices);
      console.log('🎵 getUserMedia available:', !!navigator?.mediaDevices?.getUserMedia);
      
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ Web microphone permission granted');
      return true;
    } else {
      // Use expo-av for native platforms (iOS/Android)
      console.log('📱 Using expo-av Audio.requestPermissionsAsync...');
      const { status } = await Audio.requestPermissionsAsync();
      console.log('🔐 Permission status:', status);
      
      if (status !== 'granted') {
        console.log('❌ Microphone permission denied');
        console.log('📋 Status received:', status);
        alert('Permission to access microphone was denied!');
        return false;
      }
      
      console.log('✅ Native microphone permission granted');
      return true;
    }
  } catch (error) {
    console.log('❌ Microphone permission error:', error);
    console.log('🔍 Error type:', (error as any)?.name);
    console.log('🔍 Error message:', (error as any)?.message);
    return false;
  }
}

interface ConversationalAIDOMProps {
  dom?: import('expo/dom').DOMProps;
  agentId: string;
  onMessage?: (message: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export default function ConversationalAIDOMComponent({
  agentId,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
}: ConversationalAIDOMProps) {
  console.log('🎭 ConversationalAI Component Rendered');
  console.log('🆔 Received Agent ID:', agentId);
  console.log('📲 On iOS platform:', Platform.OS === 'ios');
  console.log('📱 Platform OS:', Platform.OS);
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [volume, setVolume] = useState(0.8);

  const conversation = useConversation({
    onConnect: () => {
      console.log('✅ ElevenLabs: Connected to agent');
      console.log('🔗 Connection status:', conversation.status);
      setIsConnecting(false);
      onConnect?.();
    },
    onDisconnect: () => {
      console.log('❌ ElevenLabs: Disconnected from agent');
      console.log('🔗 Connection status:', conversation.status);
      setIsConnecting(false);
      onDisconnect?.();
    },
    onMessage: (message: any) => {
      console.log('📨 ElevenLabs Message received:', message);
      console.log('📨 Message type:', message?.type);
      console.log('📨 Message content:', message?.content || message?.text);
      onMessage?.(message);
    },
    onError: (error: any) => {
      console.error('❌ ElevenLabs Error:', error);
      console.error('🔍 Error details:', JSON.stringify(error, null, 2));
      setIsConnecting(false);
      onError?.(error);
    },
  });

  const startConversation = useCallback(async () => {
    console.log('🎯 Starting conversation...');
    console.log('📊 Current status:', conversation.status);
    console.log('🔄 Is connecting:', isConnecting);
    console.log('🆔 Agent ID:', agentId);
    
    if (conversation.status === 'connected' || isConnecting) {
      console.log('⚠️ Already connected or connecting, skipping...');
      return;
    }

    try {
      setIsConnecting(true);
      console.log('🎤 Requesting microphone permission...');
      
      // Request microphone permission
      const hasPermission = await requestMicrophonePermission();
      console.log('🔐 Microphone permission:', hasPermission);
      
      if (!hasPermission) {
        console.log('❌ Microphone permission denied');
        alert('Microphone permission is required for voice conversations');
        setIsConnecting(false);
        return;
      }

      console.log('🚀 Starting session with agent:', agentId);
      // Start the conversation with the agent
      await conversation.startSession({
        agentId: agentId,
      });
      console.log('✅ Session started successfully');
    } catch (error) {
      console.error('❌ Failed to start conversation:', error);
      console.error('🔍 Error details:', JSON.stringify(error, null, 2));
      setIsConnecting(false);
      onError?.(error as Error);
    }
  }, [conversation, agentId, isConnecting, onError]);

  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('Failed to stop conversation:', error);
    }
  }, [conversation]);

  const adjustVolume = useCallback(async (newVolume: number) => {
    try {
      setVolume(newVolume);
      if (conversation.status === 'connected') {
        await conversation.setVolume({ volume: newVolume });
      }
    } catch (error) {
      console.error('Failed to adjust volume:', error);
    }
  }, [conversation]);

  const getStatusColor = () => {
    if (isConnecting) return '#F59E0B'; // yellow
    if (conversation.status === 'connected') return '#10B981'; // green
    return '#6B7280'; // gray
  };

  const getStatusText = () => {
    if (isConnecting) return 'Connecting...';
    if (conversation.status === 'connected') return 'Connected';
    return 'Disconnected';
  };

  const isActive = conversation.status === 'connected' || isConnecting;

  return (
    <View style={styles.container}>
      {/* Status Indicator */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      {/* Main Control Button */}
      <Pressable
        style={[
          styles.controlButton,
          isActive && styles.controlButtonActive,
        ]}
        onPress={conversation.status === 'disconnected' ? startConversation : stopConversation}
        disabled={isConnecting}
      >
        <View style={[
          styles.buttonInner,
          isActive && styles.buttonInnerActive,
        ]}>
          {conversation.status === 'connected' ? (
            <MicOff size={32} color="#E2E8F0" strokeWidth={1.5} />
          ) : (
            <Mic size={32} color="#E2E8F0" strokeWidth={1.5} />
          )}
        </View>
      </Pressable>

      {/* Volume Control */}
      {conversation.status === 'connected' && (
        <View style={styles.volumeContainer}>
          <Pressable
            style={styles.volumeButton}
            onPress={() => adjustVolume(volume > 0 ? 0 : 0.8)}
          >
            {volume > 0 ? (
              <Volume2 size={20} color="#6B7280" strokeWidth={1.5} />
            ) : (
              <VolumeX size={20} color="#6B7280" strokeWidth={1.5} />
            )}
          </Pressable>
          
          <View style={styles.volumeSliderContainer}>
            <View style={styles.volumeSlider}>
              <View 
                style={[styles.volumeFill, { width: `${volume * 100}%` }]} 
              />
            </View>
          </View>
          
          <Text style={styles.volumeText}>{Math.round(volume * 100)}%</Text>
        </View>
      )}

      {/* Agent Mode Indicator */}
      {conversation.status === 'connected' && (
        <View style={styles.modeContainer}>
          <Text style={styles.modeText}>
            AI Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  controlButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  controlButtonActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  buttonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonInnerActive: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  volumeButton: {
    padding: 8,
    marginRight: 12,
  },
  volumeSliderContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  volumeSlider: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  volumeText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 12,
    minWidth: 35,
  },
  modeContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  modeText: {
    fontSize: 12,
    color: '#E2E8F0',
    fontWeight: '500',
  },
}); 