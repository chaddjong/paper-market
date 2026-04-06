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

import BackIcon from '../../assets/icons/arrow-left.svg';
import UploadIcon from '../../assets/icons/upload.svg';

export default function CreateInformation() {
  const router = useRouter();

  // States
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Information card biasanya square lebih bagus
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreate = async () => {
    if (!image || !title || !price || !condition) {
      return Alert.alert('Error', 'Harap isi semua data dan upload gambar.');
    }

    setLoading(true);
    try {
      // 1. Upload ke Storage (Folder informations)
      const response = await fetch(image);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const fileExt = image.split('.').pop();
      const fileName = `info_${Date.now()}.${fileExt}`;
      const filePath = `informations/${fileName}`; // Masuk ke folder informations

      const { error: storageError } = await supabase.storage
        .from('post-images')
        .upload(filePath, arrayBuffer, {
          contentType: blob.type,
          upsert: true,
        });

      if (storageError) throw storageError;

      // 2. Ambil Public URL
      const { data: urlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // 3. Simpan ke Tabel informations
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
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
            contentContainerStyle={styles.scrollContent}
          >
            {/* Upload Area */}
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

            {/* FORM */}
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
                placeholder="Contoh: Bersih & Kering"
                placeholderTextColor="#9A9A9A"
                style={styles.input}
                value={condition}
                onChangeText={setCondition}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

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

  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },

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
    marginBottom: 30,
    marginHorizontal: 50,
  },

  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
