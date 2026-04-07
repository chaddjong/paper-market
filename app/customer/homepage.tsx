import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { supabase } from '../../config/supabase';

import BottomNavbar from '../../components/BottomNavbar';
import Header from '../../components/Header';
import InfoCard from '../../components/InfoCard';
import MarketCard from '../../components/MarketCard';

export default function Homepage() {
  const insets = useSafeAreaInsets();

  // State untuk data dinamis
  const [informations, setInformations] = useState<any[]>([]);
  const [marketPosts, setMarketPosts] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fungsi Fetch Gabungan
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Fetch Informasi (Katalog Harga)
      const { data: infoData, error: infoError } = await supabase
        .from('informations')
        .select('*')
        .order('created_at', { ascending: true });

      // 2. Fetch Market Posts
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (infoError) throw infoError;
      if (postError) throw postError;

      setInformations(infoData || []);
      setMarketPosts(postData || []);
    } catch (error: any) {
      console.error('Error fetching homepage data:', error.message);
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.flex}>
        <View style={styles.container}>
          <Header />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: 100 + insets.bottom }, // Beri ruang agar konten tidak tertutup navbar
            ]}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <Text style={styles.sectionTitle}>Informasi</Text>

            {loading && !refreshing ? (
              <ActivityIndicator color="#2F343A" />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.infoScroll}
              >
                {informations.map((item) => (
                  <InfoCard
                    key={item.id}
                    data={{
                      title: item.title,
                      price: `Rp. ${item.price.toLocaleString('id-ID')}`,
                      image: item.image_url,
                    }}
                  />
                ))}
              </ScrollView>
            )}

            <Text style={styles.sectionTitle}>Market</Text>

            {loading && !refreshing ? (
              <ActivityIndicator
                size="large"
                color="#2F343A"
                style={{ marginTop: 20 }}
              />
            ) : (
              <View style={styles.marketGrid}>
                {marketPosts.length > 0 ? (
                  marketPosts.map((item) => (
                    <MarketCard
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
                  ))
                ) : (
                  <Text style={styles.emptyText}>Belum ada postingan.</Text>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
      <BottomNavbar />
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
    // paddingTop: 10,
    // paddingBottom dipindah ke inline style agar dinamis
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },

  infoScroll: {
    marginBottom: 10,
  },

  marketGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    width: '100%',
  },
});
