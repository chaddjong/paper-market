import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { supabase } from '../../config/supabase';

import BackIcon from '../../assets/icons/arrow-left.svg';
import UploadIcon from '../../assets/icons/upload.svg';

export default function CreateInformation() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Gunakan insets untuk akurasi posisi bawah

  // States
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [rusakNote, setRusakNote] = useState('');
  const [penaltyPrice, setPenaltyPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const formattedNote = rusakNote ? rusakNote : 'Keterangan';
    const formattedPenalty = penaltyPrice
      ? `(- Rp. ${parseInt(penaltyPrice).toLocaleString('id-ID')}/kg)`
      : '';

    const finalString = `• Bagus\n• Rusak\n(${formattedNote})${formattedPenalty}`;
    setCondition(finalString);
  }, [rusakNote, penaltyPrice]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreate = async () => {
    if (!image || !title || !price || !rusakNote || !penaltyPrice) {
      return Alert.alert('Error', 'Harap isi semua data dan upload gambar.');
    }

    setLoading(true);
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const fileExt = image.split('.').pop();
      const fileName = `info_${Date.now()}.${fileExt}`;
      const filePath = `informations/${fileName}`;

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

      const publicUrl = urlData.publicUrl;

      const { error: dbError } = await supabase.from('informations').insert([
        {
          title: title,
          price: parseInt(price),
          condition: condition,
          image_url: publicUrl,
        },
      ]);

      if (dbError) throw dbError;

      Alert.alert('Sukses', 'Informasi baru berhasil dibuat!');
      router.replace('/admin/homepage');
    } catch (error: any) {
      Alert.alert('Gagal', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. KeyboardAvoidingView membungkus area konten utama */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <BackIcon width={22} height={22} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Buat Informasi</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
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
              <TextInput
                placeholder="Contoh: Kertas HVS"
                placeholderTextColor="#9A9A9A"
                style={styles.input}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Harga Kertas / Kg</Text>
              <TextInput
                placeholder="Contoh: 1000"
                placeholderTextColor="#9A9A9A"
                keyboardType="numeric"
                style={styles.input}
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Kondisi Kertas</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={condition}
                multiline={true}
                editable={false}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.subSection}>
              <Text style={styles.subTitle}>Detail Kerusakan</Text>
              <View style={styles.formGroup}>
                <Text style={styles.subLabel}>Keterangan Rusak</Text>
                <TextInput
                  placeholder="Contoh: robek, sebagian terbakar"
                  placeholderTextColor="#9A9A9A"
                  style={styles.input}
                  value={rusakNote}
                  onChangeText={setRusakNote}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.subLabel}>Nominal Penalti (Rp)</Text>
                <TextInput
                  placeholder="Contoh: 300"
                  placeholderTextColor="#9A9A9A"
                  keyboardType="numeric"
                  style={styles.input}
                  value={penaltyPrice}
                  onChangeText={setPenaltyPrice}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* 2. Tombol Aksi diletakkan DI LUAR KeyboardAvoidingView 
          agar perilakunya stabil dan kembali ke posisi semula (Flow Layout) */}
      <View
        style={[
          styles.bottomContainer,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 },
        ]}
      >
        <TouchableOpacity
          style={[styles.submitButton, loading && { opacity: 0.7 }]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Buat</Text>
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
    borderColor: '#DADADA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: '#333',
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40, // Padding secukupnya karena tombol sudah di luar ScrollView
    paddingHorizontal: 4,
  },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  uploadCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingVertical: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    elevation: 4,
    marginBottom: 24,
  },
  uploadText: {
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  formGroup: { marginBottom: 18 },
  label: { fontSize: 15, marginBottom: 8, color: '#333', fontWeight: '500' },
  subTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2F343A',
    marginBottom: 15,
  },
  subLabel: { fontSize: 14, marginBottom: 6, color: '#555' },
  subSection: {
    marginTop: 10,
    // padding: 15,
    // backgroundColor: '#F9F9F9',
    // borderRadius: 12,
    // borderWidth: 1,
    // borderColor: '#EEE',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#DADADA',
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    backgroundColor: '#FFF',
    color: '#333',
  },
  // Style baru untuk container tombol agar tidak melompat
  bottomContainer: {
    paddingHorizontal: 50,
    paddingTop: 5,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#2F343A',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
