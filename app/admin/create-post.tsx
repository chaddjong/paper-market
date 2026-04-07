import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';

import BackIcon from '../../assets/icons/arrow-left.svg';
import UploadIcon from '../../assets/icons/upload.svg';

export default function CreatePost() {
  const router = useRouter();
  const { user } = useAuth();

  // Form States
  const [image, setImage] = useState<string | null>(null);
  const [jenisKertas, setJenisKertas] = useState('');
  const [kondisiKertas, setKondisiKertas] = useState('');
  const [alamat, setAlamat] = useState('');
  const [berat, setBerat] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!image || !jenisKertas || !kondisiKertas || !alamat || !berat) {
      Alert.alert('Error', 'Harap lengkapi semua data dan foto.');
      return;
    }

    setLoading(true);
    try {
      // 1. Proses Gambar menjadi Blob untuk Supabase
      const response = await fetch(image);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const fileExt = image.split('.').pop();
      const fileName = `${user?.id}_${Date.now()}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      // 2. Upload ke Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('post-images') // Nama bucket Anda
        .upload(filePath, arrayBuffer, {
          contentType: blob.type,
          upsert: true,
        });

      if (storageError) throw storageError;

      // 3. Dapatkan Public URL
      const { data: urlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // 4. Simpan Metadata ke Tabel 'posts' di Supabase
      const { error: dbError } = await supabase.from('posts').insert([
        {
          user_id: user?.id,
          image_url: publicUrl,
          jenis_kertas: jenisKertas,
          kondisi_kertas: kondisiKertas,
          alamat: alamat,
          berat_kg: parseFloat(berat),
          status: 'pending',
        },
      ]);

      if (dbError) throw dbError;

      Alert.alert('Sukses', 'Postingan berhasil dibuat!');
      router.replace('/customer/homepage');
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        'Gagal',
        error.message || 'Terjadi kesalahan saat mengunggah.',
      );
    } finally {
      setLoading(false);
    }
  };

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
              <TextInput
                placeholder="Jenis Kertas (HVS, Koran, dll)"
                placeholderTextColor="#9A9A9A"
                style={styles.input}
                value={jenisKertas}
                onChangeText={setJenisKertas}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Kondisi Kertas</Text>
              <TextInput
                placeholder="Kondisi Kertas (Bersih, Campuran, dll)"
                placeholderTextColor="#9A9A9A"
                style={styles.input}
                value={kondisiKertas}
                onChangeText={setKondisiKertas}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Alamat</Text>
              <TextInput
                placeholder="Deskripsi Tempat Tinggal"
                placeholderTextColor="#9A9A9A"
                style={styles.input}
                value={alamat}
                onChangeText={setAlamat}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Total Berat Kilogram</Text>
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
  },

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
    paddingBottom: 120,
    paddingHorizontal: 4,
  },

  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  uploadCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingVertical: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginBottom: 24,
  },

  uploadText: {
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },

  formGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 15,
    marginBottom: 8,
    color: '#333',
  },

  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#DADADA',
    fontSize: 14,
  },

  submitButton: {
    backgroundColor: '#2F343A',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 50,
    marginHorizontal: 50,
  },

  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
