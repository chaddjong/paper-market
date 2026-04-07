import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
  const infoData = [
    {
      title: 'Kertas HVS',
      price: 'Rp. 1000',
      image: require('../../assets/images/hvs.png'),
    },
    {
      title: 'Buku',
      price: 'Rp. 1000',
      image: require('../../assets/images/hvs.png'),
    },
    {
      title: 'Buku',
      price: 'Rp. 1000',
      image: require('../../assets/images/hvs.png'),
    },
  ];

  const [marketPosts, setMarketPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fungsi untuk mengambil data dari Supabase
  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false }); // Postingan terbaru di atas

      if (error) throw error;
      setMarketPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching posts:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Fungsi Pull to Refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  return (
    // Ubah edges menjadi ['top', 'bottom'] agar menjaga area navigasi bawah
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <Header />

          <ScrollView
            showsVerticalScrollIndicator={false}
            // Tambahkan padding bottom dinamis agar konten terakhir tidak tertutup Navbar
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: 50 },
            ]}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <Text style={styles.sectionTitle}>Informasi</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.infoScroll}
            >
              {infoData.map((item, index) => (
                <InfoCard key={index} data={item} />
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>Market</Text>

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#2F343A"
                style={{ marginTop: 20 }}
              />
            ) : (
              <View style={styles.marketGrid}>
                {marketPosts.map((item) => (
                  <MarketCard
                    key={item.id}
                    data={{
                      id: item.id,
                      title: item.jenis_kertas,
                      image: item.image_url,
                      time: new Date(item.created_at).toLocaleDateString(),
                      condition: item.kondisi_kertas,
                      location: item.alamat,
                      weight: `${item.berat_kg} Kg`,
                    }}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* Bungkus BottomNavbar dengan View yang memiliki padding bottom 
        sesuai tinggi bilah navigasi HP 
      */}
      <View
        style={{ backgroundColor: '#ffffff', paddingBottom: insets.bottom + 10 }}
      >
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
