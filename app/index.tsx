import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Logo from '../assets/images/logo-splash-screen.svg';

export default function HomeScreen() {
  const router = useRouter();
  const { setRole } = useAuth();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Logo width={180} height={180} />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setRole('customer');
            router.push('/customer/login');
          }}
        >
          <Text style={styles.buttonText}>Customer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setRole('admin');
            router.push('/admin/login');
          }}
        >
          <Text style={styles.buttonText}>Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9E9E9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonContainer: {
    flexDirection: 'row',
    // Memberikan paddingHorizontal agar container tidak mentok ke pinggir layar
    paddingHorizontal: 40,
    gap: 20,
    marginBottom: 100, // Sedikit disesuaikan agar tidak terlalu tinggi
  },

  button: {
    // KUNCI UTAMA: flex 1 membuat tombol membagi ruang secara merata
    flex: 1,
    backgroundColor: '#2F343A',
    paddingVertical: 18, // Sedikit lebih tebal agar terlihat premium
    borderRadius: 16,
    // Kita hapus paddingHorizontal karena lebarnya sudah diatur oleh flex
    justifyContent: 'center',
    alignItems: 'center',
    // Elevation untuk Android agar terlihat sedikit timbul
    elevation: 4,
    // Shadow untuk iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600', // Diubah ke 600 agar lebih tegas
  },
});
