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

  useEffect(() => {
    const fetchDetail = async () => {
      const { data } = await supabase
        .from('transactions')
        .select('*, posts(jenis_kertas), buyer:buyer_id(nama)')
        .eq('id', id)
        .single();
      setDetail(data);
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon width={22} height={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{detail?.posts?.jenis_kertas}</Text>
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
                resizeMode="contain"
              />
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
    // justifyContent: 'space-between',
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

  placeholder: {
    width: 22,
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
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  imageWrapper: {
    marginBottom: 20,
  },

  imageContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#28A745',
    marginTop: 4,
  },

  /* ALERT */
  alertBox: {
    flexDirection: 'row',
    backgroundColor: '#FFE9E9',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  alertIcon: {
    marginRight: 8,
    fontWeight: '700',
  },

  alertText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
  },

  /* BUTTON */
  bottom: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 30,
    marginHorizontal: 50,
  },

  buttonDisabled: {
    backgroundColor: '#BDBDBD', // abu-abu = disabled
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
