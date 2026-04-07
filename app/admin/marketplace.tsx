import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { supabase } from '../../config/supabase';

import FilterModal from '@/components/FilterModal';
import BottomNavbar from '../../components/BottomNavbar';
import MarketCard from '../admin/components/AdminMarketCard';

import EditIcon from '../../assets/icons/edit.svg';
import FilterAppliedIcon from '../../assets/icons/filter-applied.svg';
import FilterIcon from '../../assets/icons/filter.svg';
import SearchIcon from '../../assets/icons/search.svg';

export default function Marketplace() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState({
    jenisKertas: null as string | null,
    minBerat: '',
    maxBerat: '',
  });

  const fetchMarketData = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from('posts').select('*');

      if (searchQuery) {
        query = query.ilike('jenis_kertas', `%${searchQuery}%`);
      }

      if (filters.jenisKertas) {
        query = query.ilike('jenis_kertas', `%${filters.jenisKertas}%`);
      }
      if (filters.minBerat) {
        query = query.gte('berat_kg', parseFloat(filters.minBerat));
      }
      if (filters.maxBerat) {
        query = query.lte('berat_kg', parseFloat(filters.maxBerat));
      }

      const { data, error } = await query.order('created_at', {
        ascending: false,
      });

      if (error) throw error;
      setMarketData(data || []);
    } catch (error: any) {
      console.error('Error marketplace:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters.jenisKertas, filters.minBerat, filters.maxBerat, searchQuery]);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  const isFilterApplied =
    filters.jenisKertas || filters.minBerat || filters.maxBerat;

  const onRefresh = () => {
    setRefreshing(true);
    fetchMarketData();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.flex}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.container}>
            {/* Header Search */}
            <View style={styles.header}>
              <View style={styles.searchBox}>
                <TextInput
                  placeholder="Cari kertas"
                  placeholderTextColor="#888"
                  style={styles.input}
                  value={searchQuery}
                  onChangeText={(text) => setSearchQuery(text)}
                />
                <SearchIcon width={18} height={18} />
              </View>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowFilter(true)}
              >
                {isFilterApplied ? (
                  <FilterAppliedIcon width={22} height={22} />
                ) : (
                  <FilterIcon width={22} height={22} />
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/customer/create-post')}>
                <EditIcon width={22} height={22} />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" color="#2F343A" />
              </View>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                  styles.scrollContent,
                  { paddingBottom: 100 + insets.bottom },
                ]}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
                <View style={styles.marketGrid}>
                  {marketData.length > 0 ? (
                    marketData.map((item) => (
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
                    <Text style={styles.emptyText}>
                      Tidak ada barang di marketplace.
                    </Text>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>

        {/* BottomNavbar diletakkan secara independen di dalam View flex */}
        <BottomNavbar />

        <FilterModal
          visible={showFilter}
          onClose={() => setShowFilter(false)}
          filters={filters}
          setFilters={setFilters}
        />
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
    paddingHorizontal: 16,
  },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    marginRight: 10,
  },

  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
  },

  iconButton: {
    marginLeft: 6,
  },

  scrollContent: {
    paddingTop: 10,
  },

  marketGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
    width: '100%',
  },
});
