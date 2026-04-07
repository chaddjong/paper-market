import { useRouter } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// 1. Import useSafeAreaInsets
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import BottomNavbar from '../../components/BottomNavbar';

export default function ProfileScreen() {
  const router = useRouter();
  // 2. Inisialisasi insets
  const insets = useSafeAreaInsets();

  return (
    // Tambahkan 'bottom' pada edges agar SafeAreaView menghitung area bawah
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          // Gunakan padding bottom dinamis agar menu terakhir tidak tertutup navbar
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: 100 + insets.bottom },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
          </View>

          <View style={styles.headerDivider} />

          {/* Card Menu */}
          <View style={styles.card}>
            {/* Akun */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/customer/account-details')}
            >
              <Text style={styles.icon}>👤</Text>
              <Text style={styles.menuText}>Akun</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Logout */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/')}
            >
              <Text style={styles.logoutIcon}>↩</Text>
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* 3. Bungkus BottomNavbar agar memiliki jarak aman dari bilah navigasi HP */}
        <View
          style={{
            backgroundColor: '#ffffff',
            paddingBottom: insets.bottom + 10,
          }}
        >
          <BottomNavbar />
        </View>
      </KeyboardAvoidingView>
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
  },

  scrollContainer: {
    // paddingBottom sudah diatur secara dinamis di inline style
    paddingTop: 10,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },

  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },

  headerDivider: {
    height: 1,
    backgroundColor: '#D9D9D9',
  },

  card: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#EDEDED',
    borderRadius: 14,
    overflow: 'hidden',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
  },

  icon: {
    fontSize: 20,
    marginRight: 12,
  },

  menuText: {
    fontSize: 16,
    color: '#000',
  },

  logoutIcon: {
    fontSize: 20,
    marginRight: 12,
    color: '#E53935',
  },

  logoutText: {
    fontSize: 16,
    color: '#E53935',
    fontWeight: '500',
  },

  divider: {
    height: 1,
    backgroundColor: '#D0D0D0',
  },
});
