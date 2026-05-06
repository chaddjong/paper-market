import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackIcon from '../../assets/icons/arrow-left.svg';
import { supabase } from '../../config/supabase';

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<any>(null);
  const [basePrice, setBasePrice] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // Ambil data dari tabel transactions
        const { data, error } = await supabase
          .from('transactions')
          .select('*, buyer:buyer_id(nama)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setDetail(data);

        // Ambil harga dasar dari tabel informations berdasarkan product_name (jenis kertas)
        // Kita gunakan ilike agar pencarian teks lebih fleksibel
        if (data?.product_name) {
          const { data: infoData } = await supabase
            .from('informations')
            .select('price')
            .ilike('title', `%${data.product_name}%`)
            .single();

          if (infoData) {
            setBasePrice(infoData.price);
          }
        }
      } catch (error: any) {
        console.error('Error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  // Rumus: Total Harga / Harga per Kg
  const calculatedKg =
    detail?.total_price && basePrice > 0
      ? Math.round(detail.total_price / basePrice)
      : 0;

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#2F343A" />;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon width={22} height={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{detail?.product_name}</Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.mainTitle}>
            Dibayar oleh {detail?.buyer?.nama}
          </Text>

          <View style={styles.imageWrapper}>
            <Text style={styles.sectionTitle}>Bukti Pembayaran</Text>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: detail?.payment_proof_url }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* TOTAL PENJUALAN (KG) */}
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Total Penjualan</Text>
            <View style={styles.disabledPlaceholder}>
              <Text style={styles.placeholderText}>
                {calculatedKg > 0 ? `${calculatedKg} Kg` : 'Menghitung...'}
              </Text>
            </View>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.label}>Harga</Text>
            <Text style={styles.finalPrice}>
              Rp {detail?.total_price?.toLocaleString('id-ID')}
            </Text>
          </View>
        </View>

        <View style={styles.bottom}>
          <View style={styles.buttonDisabled}>
            <Text style={styles.buttonTextDisabled}>Terjual</Text>
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

  /* HEADER */
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

  /* CONTENT */
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
    color: '#333',
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
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

  /* INFO KG (NEW) */
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
    fontWeight: '600',
  },

  /* PRICE */
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

  /* BUTTON */
  bottom: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 30,
    marginHorizontal: 50,
  },

  buttonDisabled: {
    backgroundColor: '#BDBDBD',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
  },

  buttonTextDisabled: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
