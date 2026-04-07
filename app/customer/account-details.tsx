import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
  const { user } = useAuth(); // Ambil user dari context

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // Ambil data dari tabel users berdasarkan ID user yang sedang login
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
              { paddingBottom: 100 + insets.bottom },
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
                {/* Nama */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nama</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={profile?.nama || '-'}
                    editable={false} // Mengunci input
                  />
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={profile?.email || '-'}
                    editable={false} // Mengunci input
                  />
                </View>

                {/* Whatsapp */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nomor Whatsapp</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={profile?.phone || '-'}
                    editable={false} // Mengunci input
                  />
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Bottom Navbar diposisikan secara absolut (diatur di dalam komponennya) */}
        <BottomNavbar />
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
  },
  scrollContainer: {
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#D9D9D9',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#7A7A7A',
  },
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
  disabledInput: {
    backgroundColor: '#F5F5F5', // Memberikan visual bahwa input terkunci
    color: '#7A7A7A',
  },
});