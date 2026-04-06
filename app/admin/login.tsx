import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const router = useRouter();
  const { setRole } = useAuth();

  const [identifier, setIdentifier] = useState(''); // Bisa email atau HP
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async () => {
    const cleanId = identifier.trim();
    if (!cleanId || !password) {
      return Alert.alert('Error', 'Email/No HP dan Password harus diisi');
    }

    setLoading(true);
    try {
      let emailToLogin = cleanId;

      // 1. Logika Login via Nomor HP (Cari email terkait di tabel users)
      if (!cleanId.includes('@')) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email')
          .eq('phone', cleanId)
          .single();

        if (userError || !userData) throw new Error('Nomor HP tidak terdaftar');
        emailToLogin = userData.email;
      }

      // 2. Login Utama ke Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: emailToLogin,
          password: password,
        });

      if (authError) throw authError;

      if (authData.user) {
        // 3. PROTEKSI ADMIN: Cek Role di Tabel Users
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (profileError || !profile) throw new Error('Gagal mengambil profil');

        // Jika Role bukan Admin, langsung Logout paksa
        if (profile.role !== 'admin') {
          await supabase.auth.signOut(); // Kick user dari session
          throw new Error('Akses Ditolak: Anda bukan Admin!');
        }

        // 4. Berhasil: Update Context dan Masuk Homepage Admin
        setRole('admin');
        router.push('/admin/homepage');
      }
    } catch (error: any) {
      Alert.alert('Login Admin Gagal', error.message);
    } finally {
      setLoading(false);
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
        <Text style={styles.title}>Admin Login</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Email / Nomor Whatsapp</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukan email/nomor admin"
            placeholderTextColor="#999"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
          />

          <Text style={[styles.label, { marginTop: 15 }]}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukan password anda"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.loginButton, loading && { opacity: 0.7 }]}
            onPress={handleAdminLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginText}>Log in</Text>
            )}
          </TouchableOpacity>
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

  loginButton: {
    backgroundColor: '#2F343A',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },

  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },

  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },

  signupText: {
    textDecorationLine: 'underline',
  },
});
