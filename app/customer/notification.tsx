import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import NotificationCard from '../../components/NotificationCard';

import BackIcon from '../../assets/icons/arrow-left.svg';

export default function NotificationScreen() {
  const router = useRouter();

  const handlePaymentPress = () => {
    router.push('/customer/payment-success'); // nanti bisa kamu buat
  };

  const handleTransactionPress = () => {
    router.push('/customer/transaction-detail'); // nanti bisa kamu buat
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.wrapper}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon width={22} height={22} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Notifikasi</Text>

          <View style={{ width: 24 }} />
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          {/* PAYMENT CONFIRMATION */}
          <NotificationCard
            type="payment"
            title="Pembayaran telah dilakukan"
            onPress={handleTransactionPress}
          />

          {/* TRANSACTION COMPLETE */}
          <NotificationCard
            type="transaction"
            title="Transaksi selesai"
            description="Buku anda telah dibayar oleh Gabriel"
            onPress={handlePaymentPress}
          />

          <NotificationCard
            type="transaction"
            title="Transaksi selesai"
            description="Map Jilid anda telah dibayar oleh Gabriel"
            onPress={handlePaymentPress}
          />

          <NotificationCard
            type="transaction"
            title="Transaksi selesai"
            description="Kertas HVS anda telah dibayar oleh Gabriel"
            onPress={handlePaymentPress}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  wrapper: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#D6D6D6',
    backgroundColor: '#ffffff',
  },
  backText: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: '#333',
  },

  content: {
    marginTop: 0,
  },
});
