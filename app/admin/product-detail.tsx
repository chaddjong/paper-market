import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../config/supabase';

import BackIcon from '../../assets/icons/arrow-left.svg';
import MapIcon from '../../assets/icons/map.svg';
import WhatsappIcon from '../../assets/icons/whatsapp.svg';

export default function AdminProductDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProductDetail = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users (
            nama,
            phone
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error: any) {
      console.error('Fetch Detail Error:', error.message);
      Alert.alert('Error', 'Gagal memuat detail produk');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  const handleWhatsApp = () => {
    if (!product?.users?.phone) {
      return Alert.alert('Error', 'Nomor WhatsApp tidak tersedia');
    }

    let phone = product.users.phone.replace(/[^0-9]/g, '');
    if (phone.startsWith('0')) {
      phone = '62' + phone.slice(1);
    }

    const message = `Halo ${product.users.nama}, saya Admin Paper Market. Ingin bertanya mengenai postingan ${product.jenis_kertas} Anda.`;
    const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#2F343A" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <BackIcon width={22} height={22} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{product.jenis_kertas}</Text>
          </View>

          {/* CONTENT */}
          <View style={styles.content}>
            <Image source={{ uri: product.image_url }} style={styles.image} />

            <View style={styles.infoBox}>
              <Text style={styles.postInfo}>
                Diposting oleh{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {product.users?.nama}
                </Text>{' '}
                pada {new Date(product.created_at).toLocaleDateString('id-ID')}
              </Text>

              <Text style={styles.weight}>{product.berat_kg} Kg</Text>
              <Text style={styles.condition}>
                Kondisi: {product.kondisi_kertas}
              </Text>

              <View style={styles.locationRow}>
                <MapIcon width={16} height={16} />
                <Text style={styles.location}>{product.alamat}</Text>
              </View>
            </View>
          </View>

          {/* BOTTOM ACTION */}
          <View style={styles.bottomAction}>
            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={handleWhatsApp}
            >
              <WhatsappIcon width={18} height={18} />
              <Text style={styles.whatsappText}>Chat WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buyButton}
              onPress={() =>
                router.push({
                  pathname: '/customer/purchase-form',
                  params: { id: product.id },
                })
              }
            >
              <Text style={styles.buyText}>Lanjut Pembelian</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D6D6D6',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: '#333',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },

  image: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  infoBox: { gap: 10 },

  postInfo: {
    fontSize: 13,
    color: '#777',
    marginBottom: 20,
  },

  weight: {
    fontSize: 24,
    fontWeight: '700',
    color: '#43A047',
    alignSelf: 'flex-start',
  },

  condition: {
    fontSize: 16,
    marginTop: 6,
    color: '#444',
    alignSelf: 'flex-start',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-start',
  },

  location: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },

  bottomAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
  },

  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#43B02A',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  whatsappText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 6,
  },

  buyButton: {
    flex: 1,
    backgroundColor: '#2F343A',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  buyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});