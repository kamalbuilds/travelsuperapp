"use dom";
import { useEffect, useRef } from "react";
import type { Message } from "../components/ChatMessage";

export default function ConvAiDOMComponent({
  platform,
  get_battery_level,
  change_brightness,
  flash_screen,
  onMessage,
}: {
  dom?: import("expo/dom").DOMProps;
  platform: string;
  get_battery_level: () => number;
  change_brightness: () => void;
  flash_screen: () => void;
  onMessage: (message: Message) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      // Create the ElevenLabs widget element
      const widget = document.createElement('elevenlabs-convai');
      widget.setAttribute('agent-id', 'agent_01jyp6rh49e86acqze2qm2yxne');
      
      // Create and load the script
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      
      // Add both elements to the container
      containerRef.current.appendChild(widget);
      document.head.appendChild(script);
      
      // Cleanup function
      return () => {
        if (containerRef.current?.contains(widget)) {
          containerRef.current.removeChild(widget);
        }
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, []);
  
  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    />
  );
}
