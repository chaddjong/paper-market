import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../config/supabase';

import AdminHistoryCard from '../admin/components/AdminHistoryCard';
import BackIcon from '../../assets/icons/arrow-left.svg';

export default function AdminHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      // Ambil data transaksi yang sudah diverifikasi (status 'verified')
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <BackIcon width={22} height={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>List Pembelian Kertas</Text>
        </View>

        {loading ? (
          <ActivityIndicator color="#2F343A" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            renderItem={({ item }) => (
              <AdminHistoryCard
                data={{
                  productName: item.product_name, // Mengambil dari kolom permanen
                  date: new Date(item.created_at).toLocaleDateString('id-ID'),
                  image: item.product_image, // Mengambil dari kolom permanen
                }}
                // onPress={() => {
                //   // Arahkan ke detail transaksi jika diperlukan
                //   router.push({
                //     pathname: '/admin/transaction-detail',
                //     params: { id: item.id },
                //   });
                // }}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Belum ada riwayat pembelian.</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D6D6D6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#9A9A9A',
    fontSize: 15,
  },
});