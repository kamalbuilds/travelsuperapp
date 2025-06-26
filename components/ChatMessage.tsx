import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, Text, View } from "react-native";

export type Message = {
  source: string;
  message: string;
  timestamp?: string;
};

type Props = {
  message: Message;
};

export function ChatMessage({ message }: Props) {
  const colorScheme = useColorScheme();
  const isAI = message.source === "ai";

  return (
    <View
      style={[
        styles.messageContainer,
        isAI ? styles.aiMessage : styles.userMessage,
      ]}
    >
      <View style={[
        styles.bubble, 
        isAI ? styles.aiBubble : styles.userBubble,
        { backgroundColor: isAI 
          ? Colors[colorScheme ?? 'light'].tabIconDefault + '20'
          : Colors[colorScheme ?? 'light'].tint 
        }
      ]}>
        <Text
          style={[
            styles.messageText, 
            isAI ? styles.aiText : styles.userText,
            { color: isAI 
              ? Colors[colorScheme ?? 'light'].text 
              : '#FFFFFF' 
            }
          ]}
        >
          {message.message}
        </Text>
        {message.timestamp && (
          <Text style={[styles.timestamp, { 
            color: isAI 
              ? Colors[colorScheme ?? 'light'].text + '60' 
              : '#FFFFFF80' 
          }]}>
            {message.timestamp}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    marginVertical: 8,
    paddingHorizontal: 16,
    alignItems: "flex-end",
  },
  aiMessage: {
    justifyContent: "flex-start",
  },
  userMessage: {
    justifyContent: "flex-end",
  },
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  aiBubble: {
    borderTopLeftRadius: 4,
  },
  userBubble: {
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  aiText: {
    // Color set dynamically
  },
  userText: {
    // Color set to white
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '300',
  },
}); 