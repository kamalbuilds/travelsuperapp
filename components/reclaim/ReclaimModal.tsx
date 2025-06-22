import type { Proof } from '@reclaimprotocol/reactnative-sdk';
import { ReclaimProofRequest } from '@reclaimprotocol/reactnative-sdk';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const APP_ID = '';
const APP_SECRET = '';
const PROVIDER_ID = '';
const APP_SCHEME = 'reclaimexample://';

interface ReclaimModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ReclaimModal({ visible, onClose }: ReclaimModalProps) {
  const [status, setStatus] = useState<string>('');
  const [extracted, setExtracted] = useState<string | null>(null);
  const [proofObject, setProofObject] = useState<string | null>(null);
  const [reclaimProofRequest, setReclaimProofRequest] = useState<ReclaimProofRequest | null>(null);
  const [requestUrl, setRequestUrl] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      initializeReclaimProofRequest();
      setupDeepLinking();
    }
  }, [visible]);

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
  }

  async function initializeReclaimProofRequest() {
    try {
      const proofRequest = await ReclaimProofRequest.init(
        "0xFC5e57a3485BF42F34dC97F64a77c1fe1BDbEE76",
        "0x665e561267b1bd871aaa91282ec3a226d1372021d60b82834a9744b2c8f8d887",
        "6d3f6753-7ee6-49ee-a545-62f1b1822ae5",
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
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Reclaim Verification</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
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
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#4A5568',
  },
  content: {
    alignItems: 'center',
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