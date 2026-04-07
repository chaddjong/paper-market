import * as ImagePicker from 'expo-image-picker'; // Tambahkan ini
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

export default function EditPost() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [jenisKertas, setJenisKertas] = useState('');
  const [kondisi, setKondisi] = useState('');
  const [alamat, setAlamat] = useState('');
  const [berat, setBerat] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<string | null>(null); // State untuk gambar baru

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
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // Fungsi Pilih Gambar
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
    setUpdating(true);
    try {
      let finalImageUrl = imageUrl;

      // 1. Jika ada gambar baru, upload dan hapus yang lama
      if (newImage && imageUrl) {
        // Ambil path file lama
        const oldFilePath = imageUrl.split('post-images/')[1];

        // Upload gambar baru ke folder 'posts'
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

        // Hapus file lama dari storage
        if (oldFilePath) {
          await supabase.storage.from('post-images').remove([oldFilePath]);
        }

        // Ambil URL baru
        const { data: urlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
      }

      // 2. Update Database
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
    Alert.alert('Hapus', 'Hapus postingan customer ini?', [
      { text: 'Batal' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            // 1. Hapus gambar dari storage
            if (imageUrl) {
              const filePath = imageUrl.split('post-images/')[1];
              if (filePath) {
                await supabase.storage.from('post-images').remove([filePath]);
              }
            }

            // 2. Hapus data dari database
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
              <Text style={styles.headerTitle}>Edit Postingan</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
              {/* IMAGE PREVIEW - Sekarang bisa diklik untuk ganti gambar */}
              <TouchableOpacity style={styles.imageCard} onPress={pickImage}>
                <Image
                  source={{ uri: newImage || imageUrl || '' }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay}>
                  <Text style={styles.imageOverlayText}>Ganti Gambar</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Jenis Kertas</Text>
                <TextInput
                  style={styles.input}
                  value={jenisKertas}
                  onChangeText={setJenisKertas}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Kondisi Kertas</Text>
                <TextInput
                  style={styles.input}
                  value={kondisi}
                  onChangeText={setKondisi}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Alamat</Text>
                <TextInput
                  style={styles.input}
                  value={alamat}
                  onChangeText={setAlamat}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Total Berat (Kg)</Text>
                <TextInput
                  style={styles.input}
                  value={berat}
                  onChangeText={setBerat}
                  keyboardType="numeric"
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
              <Text style={styles.updateText}>Perbarui</Text>
            )}
          </TouchableOpacity>
        </View>
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

  image: {
    width: 120,
    height: 120,
  },

  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlayText: { color: '#fff', fontWeight: 'bold' },

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
