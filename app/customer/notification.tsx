import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';

import NotificationCard from '../../components/NotificationCard';

import BackIcon from '../../assets/icons/arrow-left.svg';

export default function NotificationScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Ambil transaksi di mana saya adalah SELLER
      const { data, error } = await supabase
        .from('transactions')
        .select(
          `
        *,
        posts (
          jenis_kertas, 
          image_url
        ),
        buyer:buyer_id (nama)
      `,
        )
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Fetch Notifications Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon width={22} height={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifikasi</Text>
        </View>

        <ScrollView style={styles.content}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            // Di dalam map notifications pada notification.tsx
            notifications.map((item) => {
              const isVerified = item.status === 'verified';

              const displayTitle = isVerified
                ? item.product_name
                : item.posts?.jenis_kertas;
              const displayImage = isVerified
                ? item.payment_proof_url
                : item.posts?.image_url;

              return (
                <NotificationCard
                  key={item.id}
                  type={isVerified ? 'transaction' : 'payment'}
                  title={
                    isVerified
                      ? 'Transaksi selesai'
                      : 'Pembayaran telah dilakukan'
                  }
                  description={
                    isVerified
                      ? `${displayTitle} anda telah dibayar oleh ${item.buyer?.nama}`
                      : `${item.buyer?.nama} telah membayar ${displayTitle}`
                  }
                  imageUrl={displayImage} // Akan menampilkan bukti transfer jika sudah verified
                  onPress={() =>
                    router.push({
                      pathname: isVerified
                        ? '/customer/payment-success'
                        : '/customer/transaction-detail',
                      params: { id: item.id },
                    })
                  }
                />
              );
            })
          )}
          {notifications.length === 0 && !loading && (
            <Text>Belum ada notifikasi</Text>
          )}
        </ScrollView>
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
