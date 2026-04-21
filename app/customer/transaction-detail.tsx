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

import AlertIcon from '../../assets/icons/alert.svg';
import BackIcon from '../../assets/icons/arrow-left.svg';

export default function TransactionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [detail, setDetail] = useState<any>(null);

  useEffect(() => {
    fetchTransactionDetail();
  }, [id]);

  const fetchTransactionDetail = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(
          `
          *,
          posts (jenis_kertas),
          buyer:buyer_id (nama)
        `,
        )
        .eq('id', id)
        .single();

      if (error) throw error;
      setDetail(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSold = async () => {
    setUpdating(true);
    try {
      // 1. Ambil data postingan (nama dan image_url) sebelum dihapus
      const { data: postData, error: postFetchError } = await supabase
        .from('posts')
        .select('jenis_kertas, image_url')
        .eq('id', detail.post_id)
        .single();

      if (postFetchError || !postData)
        throw new Error('Data postingan asli tidak ditemukan.');

      // 2. Update transaksi: Simpan nama produk & URL gambar secara permanen
      // Kita set post_id ke null agar tidak melanggar relasi saat post dihapus
      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          status: 'verified',
          product_name: postData.jenis_kertas,
          product_image: postData.image_url, // Memastikan gambar tersimpan di riwayat
          post_id: null,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // 3. HAPUS GAMBAR PRODUK DI STORAGE (DINONAKTIFKAN)
      /* const imageUrl = postData.image_url;
      if (imageUrl) {
        const filePath = imageUrl.split('post-images/')[1];
        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from('post-images')
            .remove([filePath]);

          if (storageError)
            console.error(
              'Gagal hapus gambar produk di storage:',
              storageError.message,
            );
        }
      }
      */

      // 4. Hapus baris di tabel posts
      const { error: deletePostError } = await supabase
        .from('posts')
        .delete()
        .eq('id', detail.post_id);

      if (deletePostError) throw deletePostError;

      Alert.alert(
        'Sukses',
        'Transaksi diverifikasi dan postingan telah dihapus dari marketplace!',
      );
      
      // Kembali ke halaman notifikasi/history
      router.replace('/customer/notification');
    } catch (error: any) {
      Alert.alert('Gagal', error.message);
    } finally {
      setUpdating(false);
    }
  };

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

          <View style={styles.alertBox}>
            <AlertIcon width={18} height={18} />
            <Text style={styles.alertText}>
              Mohon konfirmasi jika uang telah diterima atau belum
            </Text>
          </View>
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity
            style={[styles.button, updating && { opacity: 0.7 }]}
            onPress={handleMarkAsSold}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Tandai sebagai terjual</Text>
            )}
          </TouchableOpacity>
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
    marginBottom: 50,
    marginHorizontal: 50,
  },

  button: {
    backgroundColor: '#2F343A',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
