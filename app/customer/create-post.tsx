import React from 'react';
import {
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
import UploadIcon from '../../assets/icons/upload.svg';

export default function CreatePost() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <BackIcon width={22} height={22} />
            <Text style={styles.headerTitle}>Buat Postingan</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Upload Card */}
            <TouchableOpacity style={styles.uploadCard}>
              <UploadIcon width={24} height={24} />
              <Text style={styles.uploadText}>Upload Gambar</Text>
            </TouchableOpacity>

            {/* FORM */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Jenis Kertas</Text>
              <TextInput
                placeholder="Jenis Kertas"
                placeholderTextColor="#9A9A9A"
                style={styles.input}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Kondisi Kertas</Text>
              <TextInput
                placeholder="Kondisi Kertas"
                placeholderTextColor="#9A9A9A"
                style={styles.input}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Alamat</Text>
              <TextInput
                placeholder="Deskripsi Tempat Tinggal"
                placeholderTextColor="#9A9A9A"
                style={styles.input}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Total Berat Kilogram</Text>
              <TextInput
                placeholder="Perkiraan Total"
                placeholderTextColor="#9A9A9A"
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </ScrollView>

          {/* BUTTON */}
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitText}>Kirim Postingan</Text>
          </TouchableOpacity>
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
  },

  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
