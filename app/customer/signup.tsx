import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, // Tambahkan ini untuk feedback loading
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Logo from '../../assets/images/logo-splash-screen.svg';
import { supabase } from '../../config/supabase';

export default function CustomerSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // State loading
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  // Fungsi Validasi Nomor WhatsApp
  const validateWhatsApp = (number: string) => {
    // Menghapus karakter non-digit
    const cleanNumber = number.replace(/\D/g, '');

    // Validasi:
    // 1. Tidak boleh terlalu pendek (min 10 digit standar internasional)
    // 2. Tidak boleh terlalu panjang (max 15 digit)
    // 3. Masukkan logika angka acak (seperti 123456 tidak valid)
    const isTooShort = cleanNumber.length < 10;
    const isRepeatedOrSequential =
      /^(.)\1+$/.test(cleanNumber) || '1234567890'.includes(cleanNumber);

    if (isTooShort)
      return { valid: false, msg: 'Nomor terlalu pendek (Minimal 10 digit)' };
    if (isRepeatedOrSequential)
      return {
        valid: false,
        msg: 'Format nomor tidak valid atau terlalu simpel',
      };

    return { valid: true };
  };

  const handleSignup = async () => {
    const { nama, email, password, confirmPassword, phone } = formData;

    // 1. Validasi Field Kosong
    if (!nama || !email || !password || !phone)
      return Alert.alert('Error', 'Semua field harus diisi');

    // 2. Validasi Match Password
    if (password !== confirmPassword)
      return Alert.alert('Error', 'Password tidak cocok');

    // 3. Validasi Nomor WhatsApp
    const whatsappCheck = validateWhatsApp(phone);
    if (!whatsappCheck.valid) {
      return Alert.alert('Nomor Tidak Valid', whatsappCheck.msg);
    }

    setLoading(true); // Mulai loading
    try {
      // 1. SignUp ke Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: nama,
            phone_number: phone,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Simpan data ke tabel 'users'
        const { error: dbError } = await supabase.from('users').insert([
          {
            id: authData.user.id,
            nama: nama,
            email: email,
            phone: phone,
            role: 'customer',
          },
        ]);

        if (dbError) throw dbError;
      }

      Alert.alert('Sukses', 'Akun berhasil dibuat! Silahkan login.');
      router.push('/customer/login');
    } catch (error: any) {
      Alert.alert('Signup Gagal', error.message);
    } finally {
      setLoading(false); // Matikan loading
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Logo width={60} height={60} />
        <Text style={styles.title}>Sign Up as Customer</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nama</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukan nama"
            placeholderTextColor="#999"
            value={formData.nama}
            onChangeText={(txt) => setFormData({ ...formData, nama: txt })}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukan email anda"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(txt) => setFormData({ ...formData, email: txt })}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukan password anda"
            secureTextEntry
            placeholderTextColor="#999"
            value={formData.password}
            onChangeText={(txt) => setFormData({ ...formData, password: txt })}
          />

          <Text style={styles.label}>Konfirmasi Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukan kembali password"
            secureTextEntry
            placeholderTextColor="#999"
            value={formData.confirmPassword}
            onChangeText={(txt) =>
              setFormData({ ...formData, confirmPassword: txt })
            }
          />

          <Text style={styles.label}>Nomor Whatsapp</Text>
          <TextInput
            style={styles.input}
            placeholder="Cth: 081234567890"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(txt) => setFormData({ ...formData, phone: txt })}
          />

          <TouchableOpacity
            style={[styles.signupButton, loading && { opacity: 0.7 }]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signupText}>Sign up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => router.push('/customer/login')}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  title: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 20,
    textDecorationLine: 'underline',
  },

  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },

  label: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 5,
  },

  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D6D6D6',
  },

  signupButton: {
    backgroundColor: '#2F343A',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },

  signupText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },

  loginText: {
    textDecorationLine: 'underline',
  },
});
