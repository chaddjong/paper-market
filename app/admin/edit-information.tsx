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
import { SafeAreaView } from 'react-native-safe-area-context';
import BackIcon from '../../assets/icons/arrow-left.svg';
import { supabase } from '../../config/supabase';

export default function EditInformation() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [title, setTitle] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('informations')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      setTitle(data.title);
      setCondition(data.condition);
      setPrice(data.price.toString());
      setImageUrl(data.image_url);
    } catch (error: any) {
      Alert.alert('Error', 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [id]); // 3. Masukkan id sebagai dependency

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]); // 4. Sekarang fetchDetail aman dimasukkan ke sini

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setNewImage(result.assets[0].uri);
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      let finalImageUrl = imageUrl;

      // 1. CEK: Jika ada gambar baru yang dipilih
      if (newImage && imageUrl) {
        // A. Ambil nama file lama dari URL (untuk dihapus)
        // URL Supabase biasanya: .../public/post-images/informations/namafile.jpg
        const oldFilePath = imageUrl.split('post-images/')[1];

        // B. Upload gambar baru
        const response = await fetch(newImage);
        const blob = await response.blob();
        const arrayBuffer = await new Response(blob).arrayBuffer();
        const fileName = `informations/edit_${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, arrayBuffer, { contentType: blob.type });

        if (uploadError) throw uploadError;

        // C. HAPUS GAMBAR LAMA dari Storage
        if (oldFilePath) {
          const { error: removeError } = await supabase.storage
            .from('post-images')
            .remove([oldFilePath]);

          if (removeError)
            console.error('Gagal hapus file lama:', removeError.message);
        }

        // D. Dapatkan URL baru
        const { data: urlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
      }

      // 2. Update database dengan URL baru (atau tetap yang lama jika tidak ganti)
      const { error } = await supabase
        .from('informations')
        .update({
          title,
          condition,
          price: parseInt(price),
          image_url: finalImageUrl,
        })
        .eq('id', id);

      if (error) throw error;

      Alert.alert('Sukses', 'Informasi diperbarui dan gambar lama dihapus');
      router.back();
    } catch (error: any) {
      Alert.alert('Gagal', error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Hapus',
      'Yakin ingin menghapus informasi ini? Gambar juga akan dihapus dari storage.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              // 1. Ambil Path file dari URL sebelum datanya dihapus
              // Kita asumsikan URL mengandung 'post-images/' sebagai nama bucket
              if (imageUrl) {
                const filePath = imageUrl.split('post-images/')[1];

                if (filePath) {
                  // 2. Hapus file di Supabase Storage
                  const { error: storageError } = await supabase.storage
                    .from('post-images')
                    .remove([filePath]);

                  if (storageError) {
                    console.error(
                      'Gagal hapus file di storage:',
                      storageError.message,
                    );
                    // Kita lanjut saja tetap hapus data di DB agar tidak stuck
                  }
                }
              }

              // 3. Hapus data di Tabel Database
              const { error: dbError } = await supabase
                .from('informations') // atau 'posts' jika di file edit-post
                .delete()
                .eq('id', id);

              if (dbError) throw dbError;

              Alert.alert('Sukses', 'Informasi berhasil dihapus!');
              router.back();
            } catch (error: any) {
              Alert.alert('Gagal Menghapus', error.message);
            }
          },
        },
      ],
    );
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <BackIcon width={22} height={22} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Informasi</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TouchableOpacity onPress={pickImage} style={styles.imageCard}>
              <Image
                source={{ uri: newImage || imageUrl || '' }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.changeOverlay}>
                <Text style={styles.changeText}>Ganti Gambar</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Jenis Kertas</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Harga / Kg</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Kondisi Kertas</Text>
              <TextInput
                style={styles.input}
                value={condition}
                onChangeText={setCondition}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Hapus</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.updateButton}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: '#333',
  },

  scrollContent: {
    paddingTop: 20,
    paddingBottom: 140,
  },

  imageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  changeOverlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeText: { color: '#fff', fontWeight: 'bold' },

  image: {
    width: 120,
    height: 120,
  },

  formGroup: {
    marginBottom: 18,
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

  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 50,
  },

  deleteButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
  },

  deleteText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
  },

  updateButton: {
    flex: 1,
    backgroundColor: '#2F343A',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 8,
  },

  updateText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
