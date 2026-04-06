import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackIcon from '../../assets/icons/arrow-left.svg';
import BottomNavbar from '../../components/BottomNavbar';

export default function AccountDetailsScreen() {
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
            <BackIcon width={22} height={22} />

            <Text style={styles.headerTitle}>Akun</Text>
          </View>

          <View style={styles.headerDivider} />

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Nama */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama</Text>

              <TextInput
                style={styles.input}
                placeholder="Gabriel"
                placeholderTextColor="#9E9E9E"
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>

              <TextInput
                style={styles.input}
                placeholder="gabriel78@gmail.com"
                placeholderTextColor="#9E9E9E"
                keyboardType="email-address"
              />
            </View>

            {/* Whatsapp */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nomor Whatsapp</Text>

              <TextInput
                style={styles.input}
                placeholder="081551515678"
                placeholderTextColor="#9E9E9E"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Bottom Navbar */}
      <BottomNavbar />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
  },

  backIcon: {
    fontSize: 22,
    marginRight: 10,
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
  },
});
