import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../config/supabase';

import AlertIcon from '../../assets/icons/alert.svg';
import BackIcon from '../../assets/icons/arrow-left.svg';

export default function PurchaseForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // ID Postingan

  const [loading, setLoading] = useState(true);
  const [postData, setPostData] = useState<any>(null);
  const [basePrice, setBasePrice] = useState(0);

  const [totalKg, setTotalKg] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  // 1. Fetch Data Post dan Harga Dasar
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Ambil data postingan
      const { data: post, error: postErr } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (postErr) throw postErr;
      setPostData(post);
      console.log('Data Post Ditemukan:', post.jenis_kertas);

      // 2. Ambil harga (Gunakan .contains atau pastikan string bersih)
      const cleanTitle = post.jenis_kertas.trim();

      const { data: info, error: infoErr } = await supabase
        .from('informations')
        .select('price')
        // Gunakan eq jika nama harus sama persis, atau ilike jika parsial
        .ilike('title', `%${cleanTitle}%`);

      if (infoErr) {
        console.error('Error Info:', infoErr.message);
      }

      if (info && info.length > 0) {
        console.log('Harga Dasar Ditemukan:', info[0].price);
        setBasePrice(info[0].price);
      } else {
        console.warn('Harga tidak ditemukan untuk jenis:', cleanTitle);
        // Opsi: Berikan harga default jika tidak ditemukan di tabel info
        setBasePrice(0);
      }
    } catch (error: any) {
      console.error('Error Fetch:', error.message);
      Alert.alert('Error', 'Data produk tidak ditemukan');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 2. Logika Perhitungan Real-time
  useEffect(() => {
    const kg = parseFloat(totalKg);
    if (!kg || isNaN(kg) || !postData) {
      setEstimatedPrice(0);
      return;
    }

    // Hitung Harga: (Harga Dasar * Kg)
    let total = basePrice * kg;

    // Jika kondisi Rusak, potong 300 per kg
    if (postData.kondisi_kertas.toLowerCase() === 'rusak') {
      total = total - 300 * kg;
    }

    setEstimatedPrice(total > 0 ? total : 0);
  }, [totalKg, basePrice, postData]);

  const handleNext = () => {
    const inputKg = parseFloat(totalKg);

    // Validasi Kosong
    if (!inputKg) {
      return Alert.alert('Error', 'Masukkan jumlah pembelian');
    }

    // Validasi Stok (Tidak boleh lebih dari berat_kg di postingan)
    if (inputKg > postData.berat_kg) {
      return Alert.alert(
        'Jumlah Tidak Cukup',
        `Maksimal pembelian untuk postingan ini adalah ${postData.berat_kg} Kg`,
      );
    }

    // Kirim data ke halaman berikutnya
    router.push({
      pathname: '/customer/upload-payment-proof',
      params: {
        postId: id,
        totalKg: totalKg,
        totalPrice: estimatedPrice,
      },
    });
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#2F343A" />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <BackIcon width={22} height={22} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Pembelian</Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.alertBox}>
                <AlertIcon width={18} height={18} />
                <Text style={styles.alertText}>
                  Pastikan mengisi form ini saat anda bertemu dengan penjual
                  kertas
                </Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Jenis Kertas</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={postData?.jenis_kertas}
                  editable={false}
                />
              </View>

              <View style={styles.formGroup}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={styles.label}>Total Pembelian Kg</Text>
                  <Text style={{ fontSize: 12, color: '#888' }}>
                    Tersedia: {postData?.berat_kg} Kg
                  </Text>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    parseFloat(totalKg) > postData?.berat_kg &&
                      styles.inputError,
                  ]}
                  placeholder="Contoh: 5"
                  value={totalKg}
                  onChangeText={setTotalKg}
                  keyboardType="numeric"
                />
                {parseFloat(totalKg) > postData?.berat_kg && (
                  <Text style={styles.errorText}>
                    Jumlah melebihi stok tersedia!
                  </Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Kondisi Kertas</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={postData?.kondisi_kertas}
                  editable={false}
                />
                {postData?.kondisi_kertas.toLowerCase() === 'rusak' && (
                  <Text style={styles.infoText}>
                    *Potongan Rp. 300/Kg untuk kondisi rusak
                  </Text>
                )}
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.label}>Estimasi Harga</Text>
                <Text style={styles.price}>
                  Rp. {estimatedPrice.toLocaleString('id-ID')}
                </Text>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              (!totalKg || parseFloat(totalKg) > postData?.berat_kg) && {
                opacity: 0.5,
              },
            ]}
            onPress={handleNext}
            disabled={!totalKg || parseFloat(totalKg) > postData?.berat_kg}
          >
            <Text style={styles.buttonText}>Upload Bukti Pembayaran</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },

  scrollContent: {
    paddingBottom: 140,
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

  alertBox: {
    flexDirection: 'row',
    backgroundColor: '#FFE9E9',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },

  alertText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
    color: '#333',
  },

  formGroup: {
    marginTop: 20,
  },

  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#444',
  },

  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    fontSize: 14,
  },

  disabledInput: {
    backgroundColor: '#DCDCDC',
    color: '#777',
  },

  inputError: { borderColor: '#FF4D4D', backgroundColor: '#FFF5F5' },

  errorText: { color: '#FF4D4D', fontSize: 12, marginTop: 5 },
  infoText: {
    color: '#FF8C00',
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },

  priceContainer: {
    marginTop: 20,
  },

  price: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: '700',
    color: '#1E9E52',
  },

  bottomContainer: {
    marginTop: 'auto',
    marginBottom: 30,
    marginHorizontal: 50,
  },

  button: {
    backgroundColor: '#2F343A',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
