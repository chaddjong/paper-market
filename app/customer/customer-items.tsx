import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';

import BottomNavbar from '../../components/BottomNavbar';
import MarketCard from '../../components/MarketCard';

import SearchIcon from '../../assets/icons/search.svg';
import EditIcon from '../../assets/icons/edit.svg';

export default function CustomerItemsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMyPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user?.id) // Filter hanya milik user login
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyPosts(data || []);
      setFilteredPosts(data || []);
    } catch (error: any) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  // Fungsi Search Lokal
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = myPosts.filter((item) =>
        item.jenis_kertas.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(myPosts);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.flex} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Custom Header sesuai desain */}
          <View style={styles.header}>
            <View style={styles.searchBar}>
              <TextInput
                placeholder="Cari kertas"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={handleSearch}
              />
              <SearchIcon width={20} height={20} />
            </View>
            <TouchableOpacity 
              style={styles.iconEdit} 
              onPress={() => router.push('/customer/create-post')}
            >
              <EditIcon width={24} height={24} />
            </TouchableOpacity>
          </View>

          <Text style={styles.pageTitle}>Postingan Anda</Text>

          {loading ? (
            <ActivityIndicator color="#2F343A" style={{ marginTop: 50 }} />
          ) : (
            <FlatList
              data={filteredPosts}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={styles.row}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
              renderItem={({ item }) => (
                <MarketCard
                  showEdit={true} // Tampilkan tombol edit
                  data={{
                    id: item.id,
                    title: item.jenis_kertas,
                    image: item.image_url,
                    time: new Date(item.created_at).toLocaleDateString('id-ID'),
                    condition: item.kondisi_kertas,
                    location: item.alamat,
                    weight: `${item.berat_kg} Kg`,
                  }}
                />
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Tidak ada postingan ditemukan.</Text>
              }
            />
          )}
        </View>
      </KeyboardAvoidingView>
      <BottomNavbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  flex: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 45,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#333' },
  iconEdit: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 10,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginVertical: 15,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontSize: 14,
  },
});