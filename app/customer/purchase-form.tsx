import React, { useState } from 'react';
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

import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import AlertIcon from '../../assets/icons/alert.svg';
import BackIcon from '../../assets/icons/arrow-left.svg';

export default function PurchaseForm() {
  const router = useRouter();

  const [totalKg, setTotalKg] = useState('');
  const [condition] = useState('Rusak');

  const estimatedPrice = 'Rp. 76.000';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={{ flex: 1 }}>
        {/* KEYBOARD AREA */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
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

            {/* SCROLLABLE CONTENT */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* WARNING BOX */}
              <View style={styles.alertBox}>
                <AlertIcon width={18} height={18} />
                <Text style={styles.alertText}>
                  Pastikan mengisi form ini saat anda bertemu dengan penjual
                  kertas
                </Text>
              </View>

              {/* FORM */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Jenis Kertas</Text>

                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value="Map Jilid"
                  editable={false}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Total Pembelian Kg</Text>

                <TextInput
                  style={styles.input}
                  placeholder="5 kg"
                  value={totalKg}
                  onChangeText={setTotalKg}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Kondisi Kertas</Text>

                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={condition}
                  editable={false}
                />
              </View>

              {/* ESTIMASI */}
              <View style={styles.priceContainer}>
                <Text style={styles.label}>Estimasi Harga</Text>
                <Text style={styles.price}>{estimatedPrice}</Text>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>

        {/* FIXED BUTTON (AMAN) */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/customer/upload-payment-proof')}
          >
            <Text style={styles.buttonText}>Upload Bukti Pembayaran</Text>
          </TouchableOpacity>
        </View>
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

  scrollContent: {
    paddingBottom: 140,
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

  alertBox: {
    flexDirection: 'row',
    backgroundColor: '#FFE9E9',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },

  alertText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
    color: '#333',
  },

  formGroup: {
    marginTop: 20,
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

  disabledInput: {
    backgroundColor: '#DCDCDC',
    color: '#777',
  },

  priceContainer: {
    marginTop: 20,
  },

  price: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: '700',
    color: '#1E9E52',
  },

  bottomContainer: {
    marginTop: 'auto',
    marginBottom: 30,
    marginHorizontal: 50,
  },

  button: {
    backgroundColor: '#2F343A',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
