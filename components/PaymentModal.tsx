import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  amount: string;
  onPaymentComplete: (method: string) => void;
}

export default function PaymentModal({ visible, onClose, amount, onPaymentComplete }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'crypto' | null>(null);
  const [upiId, setUpiId] = useState('');

  const handleUPIPayment = () => {
    if (!upiId.trim()) {
      Alert.alert('Error', 'Please enter a valid UPI ID');
      return;
    }
    // Mock payment processing
    Alert.alert(
      'Payment Processing',
      'Processing UPI payment...',
      [
        {
          text: 'OK',
          onPress: () => {
            onPaymentComplete('UPI');
            onClose();
            setUpiId('');
            setPaymentMethod(null);
          },
        },
      ]
    );
  };

  const handleCryptoPayment = () => {
    Alert.alert(
      'Crypto Payment',
      'Connecting to wallet...',
      [
        {
          text: 'OK',
          onPress: () => {
            onPaymentComplete('Crypto');
            onClose();
            setPaymentMethod(null);
          },
        },
      ]
    );
  };

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
            <Text style={styles.title}>Payment</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.amount}>Amount: ₹{amount}</Text>

          {!paymentMethod ? (
            <View style={styles.methodSelection}>
              <TouchableOpacity
                style={styles.methodButton}
                onPress={() => setPaymentMethod('upi')}
              >
                <Text style={styles.methodButtonText}>Pay via UPI</Text>
                <Text style={styles.methodDescription}>Instant payment using UPI</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.methodButton}
                onPress={() => setPaymentMethod('crypto')}
              >
                <Text style={styles.methodButtonText}>Pay via Crypto</Text>
                <Text style={styles.methodDescription}>Pay with Bitcoin, Ethereum, etc.</Text>
              </TouchableOpacity>
            </View>
          ) : paymentMethod === 'upi' ? (
            <View style={styles.upiForm}>
              <Text style={styles.formLabel}>Enter UPI ID</Text>
              <TextInput
                style={styles.input}
                placeholder="example@upi"
                value={upiId}
                onChangeText={setUpiId}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.payButton} onPress={handleUPIPayment}>
                <Text style={styles.payButtonText}>Pay ₹{amount}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cryptoForm}>
              <Text style={styles.formLabel}>Crypto Payment</Text>
              <Text style={styles.cryptoDescription}>
                Connect your wallet to complete the payment
              </Text>
              <TouchableOpacity style={styles.payButton} onPress={handleCryptoPayment}>
                <Text style={styles.payButtonText}>Connect Wallet</Text>
              </TouchableOpacity>
            </View>
          )}
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
  amount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#38A169',
    textAlign: 'center',
    marginBottom: 24,
  },
  methodSelection: {
    gap: 16,
  },
  methodButton: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  methodButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: '#718096',
  },
  upiForm: {
    gap: 16,
  },
  cryptoForm: {
    gap: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  cryptoDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
  },
  payButton: {
    backgroundColor: '#38A169',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 