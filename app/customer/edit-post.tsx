import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
import { supabase } from '../../config/supabase';

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

export default function EditPost() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [jenisKertas, setJenisKertas] = useState('');
  const [kondisi, setKondisi] = useState('');
  const [alamat, setAlamat] = useState('');
  const [berat, setBerat] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [isFocusKondisi, setIsFocusKondisi] = useState(false);

  const [showMap, setShowMap] = useState(false);
  const [mapLocation, setMapLocation] = useState<any>(null);
  const [region, setRegion] = useState({
    latitude: -1.48,
    longitude: 124.84,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const fetchDetail = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      setJenisKertas(data.jenis_kertas);
      setKondisi(data.kondisi_kertas);
      setAlamat(data.alamat);
      setBerat(data.berat_kg.toString());
      setImageUrl(data.image_url);
    } catch (error: any) {
      Alert.alert('Error', 'Gagal memuat data');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Butuh izin lokasi untuk mengubah alamat.');
      return;
    }
    setLoading(true);
    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      setRegion({
        ...region,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setMapLocation(currentLocation.coords);
      setShowMap(true);
    } catch (error) {
      Alert.alert('Error', 'Gagal GPS.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLocation = async () => {
    if (!mapLocation) return;
    setLoading(true);
    try {
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: mapLocation.latitude,
        longitude: mapLocation.longitude,
      });
      if (reverseGeocode.length > 0) {
        const addr = reverseGeocode[0];
        const fullAddress = `${addr.street || ''} ${addr.name || ''}, ${addr.district || ''}, ${addr.city || ''}`;
        setAlamat(fullAddress.trim());
      }
      setShowMap(false);
    } catch (error) {
      Alert.alert('Error', 'Gagal ambil alamat.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!jenisKertas || !kondisi || !alamat || !berat)
      return Alert.alert('Error', 'Lengkapi data.');
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          kondisi_kertas: kondisi,
          alamat: alamat,
          berat_kg: parseFloat(berat),
        })
        .eq('id', id);
      if (error) throw error;
      Alert.alert('Sukses', 'Diperbarui');
      router.back();
    } catch (error: any) {
      Alert.alert('Gagal', error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert('Hapus', 'Yakin?', [
      { text: 'Batal' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await supabase.from('posts').delete().eq('id', id);
            router.back();
          } catch (error: any) {
            Alert.alert('Error', 'Gagal hapus');
          }
        },
      },
    ]);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#2F343A" />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* TouchableWithoutFeedback memastikan keyboard tutup saat klik area luar */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.flex}>
          {/* Header Tetap di Atas */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <BackIcon width={22} height={22} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Postingan</Text>
          </View>

          {/* KeyboardAvoidingView membungkus ScrollView */}
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.imageCard}>
                <Image
                  source={{ uri: imageUrl || '' }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Jenis Kertas</Text>
                <Dropdown
                  style={[styles.dropdown, styles.disabledInput]}
                  data={dataJenisKertas}
                  labelField="label"
                  valueField="value"
                  value={jenisKertas}
                  disable={true}
                  onChange={() => {}}
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
                  placeholder="Pilih Kondisi"
                  value={kondisi}
                  onFocus={() => setIsFocusKondisi(true)}
                  onBlur={() => setIsFocusKondisi(false)}
                  onChange={(item) => {
                    setKondisi(item.value);
                    setIsFocusKondisi(false);
                  }}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Alamat Penjemputan</Text>
                <View style={styles.locationInputWrapper}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.readOnlyInput,
                      { flex: 1, minHeight: 50 },
                    ]}
                    value={alamat}
                    editable={false}
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
                  style={styles.input}
                  value={berat}
                  onChangeText={setBerat}
                  keyboardType="numeric"
                  placeholder="Contoh: 10"
                />
              </View>

              {/* Padding tambahan bawah scroll agar input terakhir tidak mepet keyboard */}
              <View style={{ height: 20 }} />
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Action Button berada di luar KeyboardAvoidingView 
              ini menjamin posisi tetap di bawah saat keyboard tertutup */}
          <View
            style={[
              styles.bottomActionContainer,
              {
                // Menambahkan offset ekstra agar tidak tertutup navigasi HP
                paddingBottom:
                  Platform.OS === 'ios'
                    ? Math.max(insets.bottom, 20) + 10
                    : insets.bottom + 10,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteText}>Hapus</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.updateButton, updating && { opacity: 0.7 }]}
              onPress={handleUpdate}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.updateText}>Simpan</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Modal Map */}
      <Modal visible={showMap} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>Geser Peta ke Lokasi Baru</Text>
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
              setMapLocation({ latitude: r.latitude, longitude: r.longitude });
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
              <Text style={styles.confirmMapText}>Konfirmasi Lokasi</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: '#333',
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 40, // Ditingkatkan agar ada ruang saat scroll
  },
  imageCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  image: { width: '100%', height: '100%' },
  formGroup: { marginBottom: 18 },
  label: { fontSize: 15, marginBottom: 8, color: '#333', fontWeight: '500' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#DADADA',
    fontSize: 14,
    color: '#000',
  },
  disabledInput: { backgroundColor: '#F5F5F5', borderColor: '#E0E0E0' },
  readOnlyInput: { backgroundColor: '#F9F9F9', color: '#555' },
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
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  deleteButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteText: { color: '#FF3B30', fontSize: 16, fontWeight: '600' },
  updateButton: {
    flex: 2,
    backgroundColor: '#2F343A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  updateText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
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
