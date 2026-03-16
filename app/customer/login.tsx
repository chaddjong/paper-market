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

export default function CustomerLogin() {
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
        <Text style={styles.title}>Customer Login</Text>

        {/* Card */}
        <View style={styles.card}>
          {/* Email */}
          <Text style={styles.label}>Email / Nomor Whatsapp</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukan email/nomor anda"
            placeholderTextColor="#999"
          />

          {/* Password */}
          <Text style={[styles.label, { marginTop: 15 }]}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukan password anda"
            placeholderTextColor="#999"
            secureTextEntry
          />

          {/* Login */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/customer/homepage')}
          >
            <Text style={styles.loginText}>Log in</Text>
          </TouchableOpacity>

          {/* Signup */}
          <View style={styles.signupRow}>
            <Text>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => router.push('/customer/signup')}>
              <Text style={styles.signupText}>Sign Up</Text>
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
