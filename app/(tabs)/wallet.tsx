import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Eye,
  EyeOff,
  TrendingUp,
  Wallet as WalletIcon,
  Shield,
  Zap,
} from 'lucide-react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width } = Dimensions.get('window');

const currencies = [
  { code: 'USD', name: 'US Dollar', balance: 2450.75, change: '+2.5%' },
  { code: 'EUR', name: 'Euro', balance: 1850.30, change: '+1.8%' },
  { code: 'JPY', name: 'Japanese Yen', balance: 125000, change: '-0.5%' },
  { code: 'ALGO', name: 'Algorand', balance: 500.25, change: '+15.2%' },
];

const transactions = [
  {
    id: 1,
    type: 'expense',
    title: 'Hotel Booking - Tokyo',
    amount: -450.00,
    currency: 'USD',
    date: '2 hours ago',
    category: 'accommodation',
  },
  {
    id: 2,
    type: 'income',
    title: 'Cashback Reward',
    amount: +25.50,
    currency: 'USD',
    date: '1 day ago',
    category: 'reward',
  },
  {
    id: 3,
    type: 'expense',
    title: 'Flight to Paris',
    amount: -680.00,
    currency: 'USD',
    date: '3 days ago',
    category: 'transport',
  },
  {
    id: 4,
    type: 'exchange',
    title: 'USD to EUR Exchange',
    amount: -200.00,
    currency: 'USD',
    date: '1 week ago',
    category: 'exchange',
  },
];

export default function WalletScreen() {
  const colorScheme = useColorScheme();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const totalBalance = currencies.find(c => c.code === selectedCurrency)?.balance || 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            Travel Wallet
          </Text>
          <TouchableOpacity
            style={styles.visibilityButton}
            onPress={() => setBalanceVisible(!balanceVisible)}
          >
            {balanceVisible ? (
              <Eye size={24} color={Colors[colorScheme ?? 'light'].text} />
            ) : (
              <EyeOff size={24} color={Colors[colorScheme ?? 'light'].text} />
            )}
          </TouchableOpacity>
        </View>

        {/* Main Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <View style={styles.blockchainBadge}>
              <Shield size={12} color="#43e97b" />
              <Text style={styles.blockchainText}>Blockchain Secured</Text>
            </View>
          </View>
          <View style={styles.balanceAmount}>
            <Text style={styles.balanceValue}>
              {balanceVisible ? `$${totalBalance.toLocaleString()}` : '••••••'}
            </Text>
            <Text style={styles.balanceCurrency}>{selectedCurrency}</Text>
          </View>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={[styles.actionButton, styles.sendButton]}>
              <ArrowUpRight size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.receiveButton]}>
              <ArrowDownLeft size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Receive</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.addButton]}>
              <Plus size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Add Funds</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Currency Selection */}
        <View style={styles.currencySection}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Currencies
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.currencyList}>
              {currencies.map((currency) => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.currencyCard,
                    selectedCurrency === currency.code && styles.selectedCurrencyCard,
                    { backgroundColor: Colors[colorScheme ?? 'light'].background }
                  ]}
                  onPress={() => setSelectedCurrency(currency.code)}
                >
                  <View style={styles.currencyHeader}>
                    <Text style={[styles.currencyCode, { color: Colors[colorScheme ?? 'light'].text }]}>
                      {currency.code}
                    </Text>
                    <Text
                      style={[
                        styles.currencyChange,
                        { color: currency.change.startsWith('+') ? '#43e97b' : '#ff4757' }
                      ]}
                    >
                      {currency.change}
                    </Text>
                  </View>
                  <Text style={[styles.currencyName, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                    {currency.name}
                  </Text>
                  <Text style={[styles.currencyBalance, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {balanceVisible ? currency.balance.toLocaleString() : '••••••'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: '#667eea' }]}>
              <TrendingUp size={24} color="#fff" />
              <Text style={styles.quickActionText}>Exchange</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: '#f093fb' }]}>
              <WalletIcon size={24} color="#fff" />
              <Text style={styles.quickActionText}>Pay Bills</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: '#4facfe' }]}>
              <Zap size={24} color="#fff" />
              <Text style={styles.quickActionText}>Instant Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: '#43e97b' }]}>
              <CreditCard size={24} color="#fff" />
              <Text style={styles.quickActionText}>Cards</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.transactionsHeader}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Recent Transactions
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: Colors[colorScheme ?? 'light'].tint }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.transactionsList, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            {transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={[
                  styles.transactionIcon,
                  {
                    backgroundColor: transaction.type === 'expense' ? '#ff4757' :
                      transaction.type === 'income' ? '#43e97b' : '#667eea'
                  }
                ]}>
                  {transaction.type === 'expense' ? (
                    <ArrowUpRight size={16} color="#fff" />
                  ) : transaction.type === 'income' ? (
                    <ArrowDownLeft size={16} color="#fff" />
                  ) : (
                    <TrendingUp size={16} color="#fff" />
                  )}
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={[styles.transactionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {transaction.title}
                  </Text>
                  <Text style={[styles.transactionDate, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                    {transaction.date}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    {
                      color: transaction.amount > 0 ? '#43e97b' : Colors[colorScheme ?? 'light'].text
                    }
                  ]}
                >
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  visibilityButton: {
    padding: 8,
  },
  balanceCard: {
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#667eea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  blockchainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(67, 233, 123, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  blockchainText: {
    color: '#43e97b',
    fontSize: 12,
    fontWeight: '500',
  },
  balanceAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  balanceCurrency: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginLeft: 8,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  sendButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  receiveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  currencySection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  currencyList: {
    flexDirection: 'row',
    gap: 16,
    paddingRight: 20,
  },
  currencyCard: {
    width: 140,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCurrencyCard: {
    borderWidth: 2,
    borderColor: '#667eea',
  },
  currencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  currencyChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  currencyName: {
    fontSize: 12,
    marginBottom: 8,
  },
  currencyBalance: {
    fontSize: 16,
    fontWeight: '600',
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 56) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  transactionsList: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});