import { Ionicons } from '@expo/vector-icons'; // Library icon bawaan Expo
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import BackIcon from '../../assets/icons/arrow-left.svg';
import BottomNavbar from '../../components/BottomNavbar';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';

export default function AccountDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // States untuk Ubah Password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // States untuk Visibility Password
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();
      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      return Alert.alert('Error', 'Konfirmasi password baru tidak cocok');
    }

    setUpdating(true);
    try {
      // Menggunakan API Supabase untuk update password user yang sedang login
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      Alert.alert('Sukses', 'Password berhasil diperbarui');

      // Reset form sesuai permintaan
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowOld(false);
      setShowNew(false);
      setShowConfirm(false);
    } catch (error: any) {
      Alert.alert('Gagal', error.message);
    } finally {
      setUpdating(false);
    }
  };

  // Logika button enable: ketiga kotak harus terisi
  const isButtonDisabled =
    !oldPassword || !newPassword || !confirmPassword || updating;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.flex}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContainer,
              { paddingBottom: 120 + insets.bottom },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <BackIcon width={22} height={22} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Akun</Text>
            </View>

            <View style={styles.headerDivider} />

            {loading ? (
              <ActivityIndicator color="#2F343A" style={{ marginTop: 50 }} />
            ) : (
              <View style={styles.formContainer}>
                {/* Data Profil (Locked) */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nama</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={profile?.nama || '-'}
                    editable={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={profile?.email || '-'}
                    editable={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nomor Whatsapp</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={profile?.phone || '-'}
                    editable={false}
                  />
                </View>

                {/* Section Ubah Password */}
                <Text
                  style={[
                    styles.label,
                    { color: '#000', marginTop: 10, fontWeight: '400', fontSize: 14 },
                  ]}
                >
                  Ubah Password
                </Text>

                {/* Input Password Lama */}
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Masukkan Password Lama"
                    secureTextEntry={!showOld}
                    value={oldPassword}
                    onChangeText={setOldPassword}
                  />
                  <TouchableOpacity onPress={() => setShowOld(!showOld)}>
                    <Ionicons
                      name={showOld ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#7A7A7A"
                    />
                  </TouchableOpacity>
                </View>

                {/* Input Password Baru */}
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Masukkan Password Baru"
                    secureTextEntry={!showNew}
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                    <Ionicons
                      name={showNew ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#7A7A7A"
                    />
                  </TouchableOpacity>
                </View>

                {/* Konfirmasi Password Baru */}
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Konfirmasi Password Baru"
                    secureTextEntry={!showConfirm}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirm(!showConfirm)}
                  >
                    <Ionicons
                      name={showConfirm ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#7A7A7A"
                    />
                  </TouchableOpacity>
                </View>

                {/* Button Ubah Password */}
                <TouchableOpacity
                  style={[
                    styles.button,
                    isButtonDisabled && styles.buttonDisabled,
                  ]}
                  onPress={handleUpdatePassword}
                  disabled={isButtonDisabled}
                >
                  {updating ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.buttonText}>Ubah Password</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
        <BottomNavbar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1 },
  scrollContainer: { paddingTop: 10 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: '600' },
  headerDivider: { height: 1, backgroundColor: '#D9D9D9' },
  formContainer: { paddingHorizontal: 20, paddingTop: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, marginBottom: 8, color: '#7A7A7A' },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    color: '#000',
  },
  disabledInput: { backgroundColor: '#F5F5F5', color: '#7A7A7A' },

  // Style Password Baru
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  button: {
    backgroundColor: '#2F343A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A1A1A1', // Warna abu-abu jika disable
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
