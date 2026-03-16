import React from 'react';
import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomNavbar from '../../components/BottomNavbar';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
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
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/customer/account-details')}>
              <Text style={styles.icon}>👤</Text>
              <Text style={styles.menuText}>Akun</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Logout */}
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.logoutIcon}>↩</Text>
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Navbar Fixed */}
        <BottomNavbar />
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
    paddingBottom: 120,
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
