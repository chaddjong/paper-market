import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react'; // Tambah useState & useEffect
import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'; // Tambah Keyboard

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeIcon from '../assets/icons/home-2.svg';
import ProfileIcon from '../assets/icons/profile.svg';
import ShopIcon from '../assets/icons/shop.svg';

export default function BottomNavbar() {
  const router = useRouter();
  const { role } = useAuth();
  const insets = useSafeAreaInsets();

  // State untuk deteksi keyboard
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Jika keyboard muncul di Android, sembunyikan navbar
  if (Platform.OS === 'android' && isKeyboardVisible) return null;

  const basePath = role === 'admin' ? '/admin' : '/customer';
  const routes = {
    home: `${basePath}/homepage` as const,
    market: `${basePath}/marketplace` as const,
    profile: `${basePath}/profile` as const,
  };

  return (
    <View
      style={[
        styles.container,
        {
          // Gunakan padding bottom yang bersih
          paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
          // Jika keyboard muncul (khusus iOS), kita buat dia menempel
          bottom: 0,
        },
      ]}
    >
      <TouchableOpacity onPress={() => router.push(routes.home)}>
        <HomeIcon width={24} height={24} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push(routes.market)}>
        <ShopIcon width={24} height={24} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push(routes.profile)}>
        <ProfileIcon width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Gunakan posisi relatif atau hilangkan absolute jika dibungkus View di Homepage
    // Namun jika tetap absolute, pastikan bottom: 0
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#D6D6D6',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    // Tambahkan elevation agar tidak terlihat transparan saat menumpuk
    // elevation: 8,
  },
});
