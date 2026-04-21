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

export default function Homepage() {
  const insets = useSafeAreaInsets();

  // State hanya untuk informasi (Katalog Harga)
  const [informations, setInformations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fungsi Fetch Hanya untuk Informasi
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const { data: infoData, error: infoError } = await supabase
        .from('informations')
        .select('*')
        .order('created_at', { ascending: true });

      if (infoError) throw infoError;
      setInformations(infoData || []);
    } catch (error: any) {
      console.error('Error fetching information data:', error.message);
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
              { paddingBottom: 100 + insets.bottom },
            ]}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <Text style={styles.sectionTitle}>Informasi</Text>

            {loading && !refreshing ? (
              <ActivityIndicator color="#2F343A" style={{ marginTop: 20 }} />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.infoScroll}
              >
                {informations.length > 0 ? (
                  informations.map((item) => (
                    <InfoCard
                      key={item.id}
                      data={{
                        title: item.title,
                        price: `Rp. ${item.price.toLocaleString('id-ID')}`,
                        image: item.image_url,
                      }}
                    />
                  ))
                ) : (
                  <Text style={styles.emptyText}>Belum ada informasi harga.</Text>
                )}
              </ScrollView>
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
    // Ruang kosong untuk scrolling
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
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    width: '100%',
  },
});