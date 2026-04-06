import { useRouter } from 'expo-router';
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
import Logo from '../../assets/images/logo-splash-screen.svg';

export default function AdminSignup() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <Logo width={60} height={60} />

        {/* Title */}
        <Text style={styles.title}>Sign Up as Admin</Text>

        {/* Card */}
        <View style={styles.card}>
          {/* Nama */}
          <Text style={styles.label}>Nama</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukan nama"
            placeholderTextColor="#999"
          />

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukan email anda"
            placeholderTextColor="#999"
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukan password anda"
            secureTextEntry
            placeholderTextColor="#999"
          />

          {/* Konfirmasi Password */}
          <Text style={styles.label}>Konfirmasi Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukan kembali password"
            secureTextEntry
            placeholderTextColor="#999"
          />

          {/* Nomor Whatsapp */}
          <Text style={styles.label}>Nomor Whatsapp</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukan nomor whatsapp"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />

          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => router.push('/customer/login')}
          >
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>

          {/* Login */}
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
