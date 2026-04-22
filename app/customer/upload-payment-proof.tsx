import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';

import BackIcon from '../../assets/icons/arrow-left.svg';
import UploadIcon from '../../assets/icons/upload.svg';

export default function UploadPaymentProof() {
  const router = useRouter();
  const { user } = useAuth();
  const { postId, totalKg, totalPrice } = useLocalSearchParams();

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleFinish = async () => {
    if (!image) return Alert.alert('Error', 'Harap upload bukti pembayaran');

    setLoading(true);
    try {
      // 1. Ambil data seller_id dari post
      const { data: post } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();

      // 2. Upload Gambar ke Storage
      const response = await fetch(image);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();
      const fileName = `proofs/${user?.id}_${Date.now()}.jpg`;

      const { error: storageError } = await supabase.storage
        .from('post-images')
        .upload(fileName, arrayBuffer, { contentType: blob.type });

      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      // 3. Simpan ke Tabel Transactions
      const { error: dbError } = await supabase.from('transactions').insert([
        {
          post_id: postId,
          buyer_id: user?.id,
          seller_id: post?.user_id,
          amount_kg: parseFloat(totalKg as string),
          total_price: parseFloat(totalPrice as string),
          payment_proof_url: urlData.publicUrl,
          status: 'pending',
        },
      ]);

      if (dbError) throw dbError;

      Alert.alert(
        'Sukses',
        'Bukti pembayaran berhasil dikirim. Menunggu verifikasi penjual.',
      );
      router.replace('/admin/marketplace');
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
            <Text style={styles.headerTitle}>Upload Bukti</Text>
          </View>

          <TouchableOpacity style={styles.uploadCard} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <>
                <UploadIcon width={22} height={22} />
                <Text style={styles.uploadText}>Upload Gambar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={image ? styles.button : styles.disabledButton}
          onPress={handleFinish}
          disabled={!image || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Selesai</Text>
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
    backgroundColor: '#ffffff',
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

  uploadCard: {
    marginTop: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,

    flexDirection: 'row',
  },

  uploadText: {
    marginLeft: 8,
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '500',
    color: '#333',
  },

  bottomContainer: {
    marginTop: 'auto',
    marginBottom: 50,
    marginHorizontal: 50,
  },

  previewImage: { width: '100%', height: '100%', resizeMode: 'contain' },

  button: {
    backgroundColor: '#2F343A',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: { color: '#fff', fontWeight: 'bold' },

  disabledButton: {
    backgroundColor: '#BDBDBD',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },

  disabledText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
