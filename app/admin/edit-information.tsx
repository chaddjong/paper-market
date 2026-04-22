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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import BackIcon from '../../assets/icons/arrow-left.svg';
import { supabase } from '../../config/supabase';

export default function EditInformation() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

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
      if (newImage && imageUrl) {
        const oldFilePath = imageUrl.split('post-images/')[1];
        const response = await fetch(newImage);
        const blob = await response.blob();
        const arrayBuffer = await new Response(blob).arrayBuffer();
        const fileName = `informations/edit_${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, arrayBuffer, { contentType: blob.type });

        if (uploadError) throw uploadError;
        if (oldFilePath) {
          await supabase.storage.from('post-images').remove([oldFilePath]);
        }

        const { data: urlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
      }

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
      Alert.alert('Sukses', 'Informasi diperbarui');
      router.back();
    } catch (error: any) {
      Alert.alert('Gagal', error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert('Hapus', 'Yakin ingin menghapus?', [
      { text: 'Batal', style: 'cancel' },
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
            await supabase.from('informations').delete().eq('id', id);
            router.back();
          } catch (error: any) {
            Alert.alert('Gagal', error.message);
          }
        },
      },
    ]);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. KeyboardAvoidingView membungkus Header dan ScrollView */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <BackIcon width={22} height={22} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Informasi</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
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
                placeholder="Masukkan jenis kertas"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Harga / Kg</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                placeholder="Masukkan harga"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Kondisi Kertas</Text>
              <TextInput
                style={[
                  styles.input,
                  { minHeight: 120, textAlignVertical: 'top' },
                ]}
                value={condition}
                onChangeText={setCondition}
                multiline
                placeholder="Jelaskan kondisi kertas"
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* 2. Action Buttons diletakkan DI LUAR KeyboardAvoidingView */}
      {/* Ini akan membuat tombol terangkat tapi tetap kembali ke posisi awal karena flow layout */}
      <View style={styles.bottomActions}>
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
            <Text style={styles.updateText}>Simpan</Text>
          )}
        </TouchableOpacity>
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
    // Sesuai contoh: paddingBottom besar agar konten tidak tertutup tombol saat di-scroll
    paddingBottom: 120,
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  changeOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  changeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
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
    color: '#333',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
    // Sesuai contoh: diletakkan di bawah dengan margin
    marginBottom: 20,
  },
  deleteButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  updateButton: {
    flex: 2,
    backgroundColor: '#2F343A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  updateText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
