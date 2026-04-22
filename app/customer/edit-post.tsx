import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import BackIcon from '../../assets/icons/arrow-left.svg';
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
  const [newImage, setNewImage] = useState<string | null>(null);

  const [isFocusJenis, setIsFocusJenis] = useState(false);
  const [isFocusKondisi, setIsFocusKondisi] = useState(false);

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
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setNewImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    if (!jenisKertas || !kondisi || !alamat || !berat) {
      return Alert.alert('Error', 'Harap lengkapi semua data.');
    }

    setUpdating(true);
    try {
      let finalImageUrl = imageUrl;

      if (newImage) {
        const response = await fetch(newImage);
        const blob = await response.blob();
        const arrayBuffer = await new Response(blob).arrayBuffer();
        const fileName = `posts/edit_${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, arrayBuffer, {
            contentType: blob.type,
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;

        if (imageUrl) {
          const oldPath = imageUrl.split('post-images/')[1];
          if (oldPath)
            await supabase.storage.from('post-images').remove([oldPath]);
        }
      }

      const { error } = await supabase
        .from('posts')
        .update({
          jenis_kertas: jenisKertas,
          kondisi_kertas: kondisi,
          alamat: alamat,
          berat_kg: parseFloat(berat),
          image_url: finalImageUrl,
        })
        .eq('id', id);

      if (error) throw error;
      Alert.alert('Sukses', 'Postingan diperbarui');
      router.back();
    } catch (error: any) {
      Alert.alert('Gagal', error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert('Hapus', 'Yakin ingin menghapus postingan Anda?', [
      { text: 'Batal' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            if (imageUrl) {
              const filePath = imageUrl.split('post-images/')[1];
              if (filePath)
                await supabase.storage.from('post-images').remove([filePath]);
            }
            const { error } = await supabase
              .from('posts')
              .delete()
              .eq('id', id);
            if (error) throw error;
            router.back();
          } catch (error: any) {
            Alert.alert('Error', 'Gagal menghapus postingan');
          }
        },
      },
    ]);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
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
            <Text style={styles.headerTitle}>Edit Postingan</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* 1. Gambar Dinonaktifkan (TouchableOpacity diubah jadi View atau disabled) */}
            <View style={[styles.imageCard, { opacity: 0.9 }]}>
              <Image
                source={{ uri: newImage || imageUrl || '' }}
                style={styles.image}
                resizeMode="cover"
              />
              {/* Overlay Ganti Gambar Dihapus agar user tahu tidak bisa ganti */}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Jenis Kertas</Text>
              {/* 2. Dropdown Dinonaktifkan */}
              <Dropdown
                style={[
                  styles.dropdown,
                  styles.disabledInput, // Tambahkan style visual disabled
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={dataJenisKertas}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={jenisKertas}
                disable={true} // Kunci dropdown
                onChange={() => {}} // Kosongkan
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Kondisi Kertas</Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  isFocusKondisi && { borderColor: '#007AFF' },
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={dataKondisiKertas}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocusKondisi ? 'Pilih Kondisi' : '...'}
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
              <Text style={styles.label}>Alamat</Text>
              <TextInput
                style={styles.input}
                value={alamat}
                onChangeText={setAlamat}
                placeholder="Alamat penjemputan"
              />
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
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      <View
        style={[
          styles.bottomContainer,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 },
        ]}
      >
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
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
            <Text style={styles.updateText}>Perbarui</Text>
          )}
        </TouchableOpacity>
      </View>
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
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: '#333',
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100, // Memberi ruang agar input terbawah bisa di-scroll melewati tombol
    paddingHorizontal: 4,
  },
  imageCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: '100%', height: '100%' },
  disabledInput: {
    backgroundColor: '#F5F5F5', // Warna abu-abu untuk menandakan tidak bisa diedit
    borderColor: '#E0E0E0',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  imageOverlayText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  formGroup: { marginBottom: 18 },
  label: { fontSize: 15, marginBottom: 8, color: '#333' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#DADADA',
    fontSize: 14,
    color: '#333',
  },
  dropdown: {
    height: 50,
    borderColor: '#DADADA',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFF',
  },
  placeholderStyle: { fontSize: 14, color: '#9A9A9A' },
  selectedTextStyle: { fontSize: 14, color: '#333' },
  bottomContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  deleteButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  deleteText: { color: '#FF3B30', fontSize: 16, fontWeight: '600' },
  updateButton: {
    flex: 2,
    backgroundColor: '#2F343A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 8,
  },
  updateText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
