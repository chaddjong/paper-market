import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../config/supabase';

import BackIcon from '../../assets/icons/arrow-left.svg';

export default function AdminTransactionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<any>(null);
  const [basePrice, setBasePrice] = useState(0);

  useEffect(() => {
    fetchTransactionDetail();
  }, [id]);

  const fetchTransactionDetail = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select(
          `
          *,
          posts (jenis_kertas),
          seller:seller_id (nama)
        `,
        )
        .eq('id', id)
        .single();

      if (error) throw error;
      setDetail(data);

      // Ambil harga dasar dari tabel informations berdasarkan jenis kertas
      if (data?.posts?.jenis_kertas) {
        const { data: infoData } = await supabase
          .from('informations')
          .select('price')
          .ilike('title', `%${data.posts.jenis_kertas}%`)
          .single();

        if (infoData) {
          setBasePrice(infoData.price);
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Kalkulasi Berat Kg (Total Harga / Harga Dasar)
  const calculatedKg =
    detail?.total_price && basePrice > 0
      ? Math.round(detail.total_price / basePrice)
      : 0;

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#2F343A" />;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.wrapper}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon width={22} height={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Pembelian Admin</Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={styles.content}>
          {/* PERUBAHAN DISINI: Dibeli dari (Nama Seller) */}
          <Text style={styles.mainTitle}>
            Dibeli dari {detail?.seller?.nama || 'Penjual'}
          </Text>

          <View style={styles.imageWrapper}>
            <Text style={styles.sectionTitle}>Bukti Pembayaran Anda</Text>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: detail?.payment_proof_url }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Total Pembelian</Text>
            <View style={styles.disabledPlaceholder}>
              <Text style={styles.placeholderText}>
                {calculatedKg > 0 ? `${calculatedKg} Kg` : 'Menghitung...'}
              </Text>
            </View>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.label}>Total Bayar</Text>
            <Text style={styles.finalPrice}>
              Rp {detail?.total_price?.toLocaleString('id-ID')}
            </Text>
          </View>

          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Status Transaksi:</Text>
            <Text
              style={[
                styles.statusValue,
                {
                  color: detail?.status === 'verified' ? '#28A745' : '#FF8C00',
                },
              ]}
            >
              {detail?.status === 'verified'
                ? 'Terverifikasi'
                : 'Menunggu Konfirmasi Penjual'}
            </Text>
          </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#2F343A',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoGroup: {
    marginBottom: 20,
  },
  disabledPlaceholder: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    marginTop: 6,
  },
  placeholderText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  imageWrapper: {
    marginBottom: 20,
  },
  imageContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  image: {
    width: '100%',
    height: 200,
  },
  priceSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: '#555',
  },
  finalPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: '#28A745',
    marginTop: 4,
  },
  statusBox: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EEE',
    marginTop: 10,
  },
  statusLabel: {
    fontSize: 12,
    color: '#777',
  },
  statusValue: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
});
