import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import BackIcon from '../../assets/icons/arrow-left.svg';
import MapIcon from '../../assets/icons/map.svg';
import UploadIcon from '../../assets/icons/upload.svg';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';

const dataJenisKertas = [
  { label: 'Majalah', value: 'Majalah' },
  { label: 'Kertas HVS', value: 'Kertas HVS' },
  { label: 'Buku', value: 'Buku' },
  { label: 'Koran', value: 'Koran' },
  { label: 'Map Jilid', value: 'Map Jilid' },
];

const dataKondisiKertas = [
  { label: 'Bagus', value: 'Bagus' },
  { label: 'Rusak', value: 'Rusak' },
];

export default function CreatePost() {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets(); // Untuk menangani jarak tombol navigasi HP

  const [image, setImage] = useState<string | null>(null);
  const [jenisKertas, setJenisKertas] = useState('');
  const [kondisiKertas, setKondisiKertas] = useState('');
  const [alamat, setAlamat] = useState('');
  const [berat, setBerat] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isFocusKondisi, setIsFocusKondisi] = useState(false);

  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [region, setRegion] = useState({
    latitude: -1.48,
    longitude: 124.84,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Izin Ditolak',
        'Aplikasi butuh izin lokasi untuk memilih alamat.',
      );
      return;
    }

    setLoading(true);
    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      const newRegion = {
        ...region,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      setRegion(newRegion);
      setLocation(currentLocation.coords);
      setShowMap(true);
    } catch (error) {
      Alert.alert('Error', 'Gagal mendapatkan lokasi GPS.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLocation = async () => {
    if (!location) return;
    setLoading(true);
    try {
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.latitude,
        longitude: location.longitude,
      });

      if (reverseGeocode.length > 0) {
        const addr = reverseGeocode[0];
        const fullAddress = `${addr.street || ''} ${addr.name || ''}, ${addr.district || ''}, ${addr.city || ''}`;
        setAlamat(fullAddress.trim());
      }
      setShowMap(false);
    } catch (error) {
      Alert.alert('Error', 'Gagal mendapatkan teks alamat.');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    if (!image || !jenisKertas || !kondisiKertas || !alamat || !berat) {
      Alert.alert('Error', 'Harap lengkapi semua data.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();
      const fileExt = image.split('.').pop();
      const fileName = `${user?.id}_${Date.now()}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      const { error: storageError } = await supabase.storage
        .from('post-images')
        .upload(filePath, arrayBuffer, {
          contentType: blob.type,
          upsert: true,
        });

      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('posts').insert([
        {
          user_id: user?.id,
          image_url: urlData.publicUrl,
          jenis_kertas: jenisKertas,
          kondisi_kertas: kondisiKertas,
          alamat: alamat,
          berat_kg: parseFloat(berat),
          status: 'pending',
        },
      ]);

      if (dbError) throw dbError;

      Alert.alert('Sukses', 'Postingan berhasil dibuat!');
      router.replace('/customer/customer-items');
    } catch (error: any) {
      Alert.alert('Gagal', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Gunakan edges top saja, bagian bottom ditangani oleh insets manual
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <BackIcon width={22} height={22} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Buat Postingan</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <TouchableOpacity style={styles.uploadCard} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : (
                <>
                  <UploadIcon width={24} height={24} />
                  <Text style={styles.uploadText}>Upload Gambar</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Jenis Kertas</Text>
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: '#007AFF' }]}
                data={dataJenisKertas}
                labelField="label"
                valueField="value"
                placeholder="Pilih Jenis Kertas"
                value={jenisKertas}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setJenisKertas(item.value);
                  setIsFocus(false);
                }}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Kondisi Kertas</Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocusKondisi && { borderColor: '#007AFF' },
                ]}
                data={dataKondisiKertas}
                labelField="label"
                valueField="value"
                placeholder="Pilih Kondisi Kertas"
                value={kondisiKertas}
                onFocus={() => setIsFocusKondisi(true)}
                onBlur={() => setIsFocusKondisi(false)}
                onChange={(item) => {
                  setKondisiKertas(item.value);
                  setIsFocusKondisi(false);
                }}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Alamat Penjemputan</Text>
              <View style={styles.locationInputWrapper}>
                <TextInput
                  placeholder="Klik ikon map untuk pilih lokasi"
                  placeholderTextColor="#9A9A9A"
                  style={[
                    styles.input,
                    styles.disabledInput,
                    { flex: 1, minHeight: 50 },
                  ]}
                  value={alamat}
                  editable={false} // MENONAKTIFKAN KETIK MANUAL
                  multiline
                />
                <TouchableOpacity
                  style={styles.mapButton}
                  onPress={getCurrentLocation}
                >
                  <MapIcon width={22} height={22} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Total Berat (Kg)</Text>
              <TextInput
                placeholder="Contoh: 10"
                placeholderTextColor="#9A9A9A"
                keyboardType="numeric"
                style={styles.input}
                value={berat}
                onChangeText={setBerat}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* Button diletakkan di luar KeyboardAvoidingView namun di dalam SafeAreaView logic */}
      <View
        style={[
          styles.bottomActionContainer,
          {
            // Kita tambahkan ekstra padding agar lebih tinggi dari navigasi HP
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : 35,
            paddingTop: 15,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.submitButton, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Kirim Postingan</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal visible={showMap} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>Geser Peta ke Lokasi Anda</Text>
            <TouchableOpacity onPress={() => setShowMap(false)}>
              <Text style={styles.closeMap}>Batal</Text>
            </TouchableOpacity>
          </View>
          <MapView
            style={styles.map}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            initialRegion={region}
            onRegionChangeComplete={(r) => {
              setRegion(r);
              setLocation({ latitude: r.latitude, longitude: r.longitude });
            }}
          >
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
            />
          </MapView>
          <View style={styles.mapFooter}>
            <TouchableOpacity
              style={styles.confirmMapButton}
              onPress={handleConfirmLocation}
            >
              <Text style={styles.confirmMapText}>Konfirmasi Lokasi Ini</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#DADADA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: '#333',
  },
  scrollContent: { paddingTop: 20, paddingBottom: 50 },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    resizeMode: 'cover',
  },
  uploadCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DADADA',
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  uploadText: { fontSize: 14, color: '#666', marginTop: 8 },
  formGroup: { marginBottom: 18 },
  label: { fontSize: 15, marginBottom: 8, color: '#333', fontWeight: '500' },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#DADADA',
    fontSize: 14,
    color: '#000',
  },
  disabledInput: {
    backgroundColor: '#F9F9F9', // Menandakan bahwa ini tidak bisa diketik
    color: '#555',
  },
  dropdown: {
    height: 50,
    borderColor: '#DADADA',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  locationInputWrapper: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  mapButton: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DADADA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomActionContainer: {
    paddingHorizontal: 30,
    backgroundColor: '#fff', // Menutup konten scroll saat keyboard muncul
  },
  submitButton: {
    backgroundColor: '#2F343A',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  modalContainer: { flex: 1 },
  map: { flex: 1 },
  mapHeader: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  mapTitle: { fontSize: 16, fontWeight: '600' },
  closeMap: { color: 'red', fontWeight: '500' },
  mapFooter: { position: 'absolute', bottom: 40, left: 20, right: 20 },
  confirmMapButton: {
    backgroundColor: '#2F343A',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmMapText: { color: '#fff', fontWeight: '600' },
});
