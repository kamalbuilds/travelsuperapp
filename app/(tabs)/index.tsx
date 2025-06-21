import type { Proof } from '@reclaimprotocol/reactnative-sdk';
import { ReclaimProofRequest } from '@reclaimprotocol/reactnative-sdk';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Linking, StyleSheet, Text, View } from 'react-native';

const APP_ID = '';
const APP_SECRET = '';
const PROVIDER_ID = '';
const APP_SCHEME = 'exp://192.168.0.112:8081';

export default function App() {
  const [status, setStatus] = useState<string>('');
  const [extracted, setExtracted] = useState<string | null>(null);
  const [proofObject, setProofObject] = useState<string | null>(null);
  const [reclaimProofRequest, setReclaimProofRequest] = useState<ReclaimProofRequest | null>(null);
  const [requestUrl, setRequestUrl] = useState<string | null>(null);

  useEffect(() => {
    initializeReclaimProofRequest();
    setupDeepLinking();
  }, []);

  function setupDeepLinking() {
    Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({url});
      }
    });

    return () => {
      Linking.removeAllListeners('url');
    };
  }

  function handleDeepLink(event: {url: string}) {
    console.log('Deep link received:', event.url);
    // You can add logic here to handle the deep link
  }

  async function initializeReclaimProofRequest() {
    try {
      const proofRequest = await ReclaimProofRequest.init(
        "APP_ID",
        "APP_SECRET",
        "PROVIDER_ID",
      );
      setReclaimProofRequest(proofRequest);

      proofRequest.addContext('0x00000000000', 'Example context message');
      proofRequest.setRedirectUrl(`${APP_SCHEME}proof`);

      console.log('Proof request initialized:', proofRequest.toJsonString());
    } catch (error) {
      console.error('Error initializing ReclaimProofRequest:', error);
    }
  }

  async function startReclaimSession() {
    if (!reclaimProofRequest) {
      console.error('ReclaimProofRequest not initialized');
      return;
    }

    try {
      setStatus('Starting Reclaim session...');

      const url = await reclaimProofRequest.getRequestUrl();
      setRequestUrl(url);
      
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        setStatus('Session started. Waiting for proof...');
      } else {
        setStatus('Unable to open URL automatically. Please copy and open the URL manually.');
      }

      const statusUrl = reclaimProofRequest.getStatusUrl();
      console.log('Status URL:', statusUrl);

      await reclaimProofRequest.startSession({
        onSuccess: async (proof: Proof | Proof[] | string | undefined) => {
          if (proof){
            if (typeof proof === 'string') {
              console.log('SDK Message:', proof)
              setExtracted(proof)
            } else if (typeof proof !== 'string') {  
              console.log('Proof received:', proof);
              if (Array.isArray(proof)) {
                setExtracted(JSON.stringify(proof.map(p => p.claimData.context)))
              } else {
                setExtracted(JSON.stringify(proof.claimData.context));
              }
            }
            setStatus('Proof received!');
            setProofObject(JSON.stringify(proof, null, 2));
          }

        },
        onError: (error: Error) => {
          console.error('Error in proof generation:', error);
          setStatus(`Error in proof generation: ${error.message}`);
        },
      });
    } catch (error) {
      console.error('Error starting Reclaim session:', error);
      setStatus(`Error starting Reclaim session`);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Reclaim Demo</Text>
      <Button onPress={startReclaimSession} title="Start Reclaim Session" />
      <Text style={styles.status}>{status}</Text>
      {requestUrl && (
        <Text style={styles.url}>Request URL: {requestUrl}</Text>
      )}
      {proofObject && (
        <View style={styles.proofContainer}>
          <Text style={styles.subtitle}>Proof Data:</Text>
          <Text>{proofObject}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    marginVertical: 10,
  },
  url: {
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  proofContainer: {
    marginTop: 20,
  },
});