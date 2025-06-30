"use dom";
import React, { useEffect, useRef, useState } from "react";
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
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [isSecureContext, setIsSecureContext] = useState(false);
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check for secure context and debug information
    const checkEnvironment = () => {
      const isSecure = window.isSecureContext;
      const protocol = window.location.protocol;
      const origin = window.location.origin;
      const hasNavigator = typeof navigator !== 'undefined';
      const hasMediaDevices = hasNavigator && typeof navigator.mediaDevices !== 'undefined';
      const hasGetUserMedia = hasMediaDevices && typeof navigator.mediaDevices.getUserMedia !== 'undefined';
      const isLocalhost = window.location.hostname === 'localhost';
      const isWeb = platform === 'web' || window.location.hostname === 'localhost' || 
                   window.navigator.userAgent.includes('Mozilla') && !window.navigator.userAgent.includes('Mobile');
      const isTunnel = window.location.hostname.includes('exp.direct');
      const isWebBrowser = !(window as any).ReactNativeWebView && typeof window !== 'undefined';
      
      const debugMessage = `
🔐 Secure Context: ${isSecure}
📍 Protocol: ${protocol}
🌐 Origin: ${origin}
🧭 Navigator: ${hasNavigator}
📱 MediaDevices: ${hasMediaDevices}
🎤 GetUserMedia: ${hasGetUserMedia}
🌐 Is Web: ${isWeb}
🏠 Is Localhost: ${isLocalhost}
🔗 Is Tunnel: ${isTunnel}
🖥️ Is Web Browser: ${isWebBrowser}
📱 Platform: ${platform}
🔗 UserAgent: ${navigator?.userAgent?.substring(0, 100) || 'undefined'}...
      `.trim();
      
      console.log('🔍 DOM Component Environment Check:', debugMessage);
      setDebugInfo(debugMessage);
      setIsSecureContext(isSecure);
      
      return { isSecure, hasGetUserMedia, isWeb, isLocalhost, isTunnel, isWebBrowser };
    };
    
    const { isSecure, hasGetUserMedia, isWeb, isLocalhost, isTunnel, isWebBrowser } = checkEnvironment();
    
    // Load widget if we have secure context OR if we're on localhost web OR if we're in a web browser
    const canLoadWidget = isSecure || (isLocalhost && isWeb) || isWebBrowser;
    
    if (containerRef.current && canLoadWidget) {
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      try {
        // Create the ElevenLabs widget element
        const widget = document.createElement('elevenlabs-convai');
        widget.setAttribute('agent-id', 'agent_01jyp6rh49e86acqze2qm2yxne');
        
        // Add error handling to the widget
        widget.addEventListener('error', (error) => {
          console.error('🚨 ElevenLabs Widget Error:', error);
          setLoadingError(`Widget error: ${error}`);
        });
        
        // Check if script is already loaded to prevent duplicates
        const scriptSrc = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
        let script = document.head.querySelector(`script[src="${scriptSrc}"]`) as HTMLScriptElement;
        
        if (!script) {
          // Create and load the script only if it doesn't exist
          script = document.createElement('script');
          script.src = scriptSrc;
          script.async = true;
          script.type = 'text/javascript';
          
          // Add error handling to the script
          script.onload = () => {
            console.log('✅ ElevenLabs widget script loaded successfully');
            setWidgetLoaded(true);
            setLoadingError(null);
          };
          
          script.onerror = (error) => {
            console.error('🚨 Failed to load ElevenLabs widget script:', error);
            setLoadingError('Failed to load widget script');
          };
          
          // Add script to head
          document.head.appendChild(script);
        } else {
          // Script already exists, just mark as loaded
          console.log('✅ ElevenLabs widget script already loaded');
          setWidgetLoaded(true);
          setLoadingError(null);
        }
        
        // Add widget to container
        containerRef.current.appendChild(widget);
        
        // Cleanup function
        return () => {
          try {
            // Clean up widget element
            if (widget && containerRef.current && containerRef.current.contains(widget)) {
              containerRef.current.removeChild(widget);
              console.log('✅ Widget element cleaned up');
            }
            
            // Clean up script element
            if (script) {
              // Check if script is still in document head
              const existingScript = document.head.querySelector(`script[src="${script.src}"]`);
              if (existingScript && document.head.contains(existingScript)) {
                document.head.removeChild(existingScript);
                console.log('✅ Script element cleaned up');
              }
            }
          } catch (error) {
            console.warn('⚠️ Cleanup warning (non-critical):', error);
            // Don't throw - this is just cleanup
          }
        };
      } catch (error) {
        console.error('Error creating widget:', error);
        setLoadingError(`Setup error: ${error}`);
      }
    } else {
      console.warn('❌ Environment not ready for ElevenLabs widget');
      if (!canLoadWidget) {
        setLoadingError('Secure context required for microphone access');
      }
    }
  }, [platform]);
  
  // Show loading state
  if (widgetLoaded && !loadingError) {
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
  
  // Show error or loading state
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
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px'
      }}
    >
      <div style={{ 
        backgroundColor: isSecureContext ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 165, 0, 0.1)', 
        border: `1px solid ${isSecureContext ? '#00ff00' : '#ffa500'}`,
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        {loadingError ? (
          <>
            <h2 style={{ color: '#ffa500', marginBottom: '16px', fontSize: '18px' }}>
              ⚠️ {isSecureContext ? 'Widget Loading Issue' : 'Secure Context Required'}
            </h2>
            <p style={{ marginBottom: '16px' }}>
              {isSecureContext 
                ? 'The ElevenLabs widget is having trouble loading.'
                : 'The ElevenLabs widget requires HTTPS to access the microphone.'
              }
            </p>
          </>
        ) : (
          <>
            <h2 style={{ color: '#00ff00', marginBottom: '16px', fontSize: '18px' }}>
              🔄 Loading ElevenLabs Voice AI...
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Setting up your voice conversation interface...
            </p>
          </>
        )}
        
        <div style={{ 
          textAlign: 'left', 
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '11px',
          lineHeight: '1.4',
          marginBottom: '16px'
        }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{debugInfo}</pre>
        </div>
        
        <div style={{ fontSize: '12px', opacity: 0.9 }}>
          {isSecureContext ? (
            <div>
              <p>✅ <strong>Secure context detected!</strong></p>
              <p>The widget should load momentarily...</p>
            </div>
          ) : (
            <div>
              <p>💡 <strong>Solutions:</strong></p>
              <p>🌐 <strong>Web:</strong> Try opening <code>http://localhost:8081</code> in your browser</p>
              <p>📱 <strong>Mobile:</strong> Use a development build instead of Expo Go</p>
              <p>🔧 <strong>Command:</strong> <code>npx expo run:ios</code> (currently building...)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
