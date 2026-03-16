import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackIcon from '../../assets/icons/arrow-left.svg';
import UploadIcon from '../../assets/icons/upload.svg';

export default function UploadPaymentProof() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <BackIcon width={22} height={22} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Pembelian</Text>
          </View>

          {/* UPLOAD CARD */}
          <TouchableOpacity style={styles.uploadCard}>
            <UploadIcon width={22} height={22} />

            <Text style={styles.uploadText}>Upload Gambar</Text>
          </TouchableOpacity>

          {/* BUTTON */}
          <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.disabledButton}>
              <Text style={styles.disabledText}>Selesai</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    marginBottom: 30,
  },

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
