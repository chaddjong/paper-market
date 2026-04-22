import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { supabase } from '../../config/supabase';

import BottomNavbar from '../../components/BottomNavbar';
import Header from '../admin/components/AdminHeader';
import AdminInfoCard from '../admin/components/AdminInfoCard';

import PlusIcon from '../../assets/icons/plus.svg';

export default function Homepage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [infoData, setInfoData] = useState<any[]>([]);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Fetch Informasi
      const { data: info, error: infoErr } = await supabase
        .from('informations')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. Fetch Market Posts
      // const { data: posts, error: postsErr } = await supabase
      //   .from('posts')
      //   .select('*')
      //   .order('created_at', { ascending: false });

      if (infoErr) throw infoErr;
      // if (postsErr) throw postsErr;

      setInfoData(info || []);
      // setMarketData(posts || []);
    } catch (error: any) {
      console.error('Fetch Admin Data Error:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    // Gunakan edges top saja karena bagian bawah ditangani oleh BottomNavbar secara absolut
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.flex}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.container}>
            <Header />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: 100 + insets.bottom }, // Jarak aman agar konten terakhir tidak tertutup navbar
              ]}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {/* SECTION INFORMASI */}
              {/* SECTION INFORMASI */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Informasi</Text>
                <TouchableOpacity
                  onPress={() => router.push('/admin/create-information')}
                >
                  <PlusIcon width={18} height={18} />
                </TouchableOpacity>
              </View>

              {loading && !refreshing ? (
                <ActivityIndicator
                  color="#2F343A"
                  style={{ marginVertical: 20 }}
                />
              ) : (
                /* Ganti ScrollView Horizontal dengan View Grid */
                <View style={styles.infoGrid}>
                  {infoData.map((item) => (
                    <View key={item.id} style={styles.infoCardWrapper}>
                      <AdminInfoCard
                        data={{
                          id: item.id,
                          title: item.title,
                          price: `Rp. ${item.price.toLocaleString()}`,
                          image: item.image_url,
                          condition: item.condition,
                        }}
                      />
                    </View>
                  ))}
                </View>
              )}

              {/* SECTION MARKET
              <Text style={styles.sectionTitle}>Market</Text>

              {loading && !refreshing ? (
                <ActivityIndicator
                  color="#2F343A"
                  style={{ marginVertical: 20 }}
                />
              ) : (
                <View style={styles.marketGrid}>
                  {marketData.map((item) => (
                    <AdminMarketCard
                      key={item.id}
                      data={{
                        id: item.id,
                        title: item.jenis_kertas,
                        image: item.image_url,
                        time: new Date(item.created_at).toLocaleDateString(
                          'id-ID',
                        ),
                        condition: item.kondisi_kertas,
                        location: item.alamat,
                        weight: `${item.berat_kg} Kg`,
                      }}
                    />
                  ))}
                </View>
              )} */}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>

        {/* Letakkan BottomNavbar di sini agar melayang (absolute) di atas flex view */}
        <BottomNavbar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
  },

  scrollContent: {
    paddingTop: 10,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    gap: 10,
  },

  infoScroll: {
    marginBottom: 10,
  },

  infoGrid: {
    flexDirection: 'row', // Arahkan ke samping
    flexWrap: 'wrap', // Baris baru jika tidak muat
    justifyContent: 'space-between', // Beri jarak antar kolom kiri & kanan
    marginBottom: 10,
  },

  infoCardWrapper: {
    width: '48%', // Sedikit kurang dari 50% untuk ruang gap
    marginBottom: 14, // Jarak antar baris ke bawah
  },

  marketGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
