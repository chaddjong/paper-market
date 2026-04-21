import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeIcon from '../assets/icons/home-2.svg';
import ProfileIcon from '../assets/icons/profile.svg';
import ShopIcon from '../assets/icons/shop.svg';
// Import ikon baru untuk customer
import CustomerItemsIcon from '../assets/icons/customer-items.svg';

export default function BottomNavbar() {
  const router = useRouter();
  const { role } = useAuth();
  const insets = useSafeAreaInsets();

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

  if (Platform.OS === 'android' && isKeyboardVisible) return null;

  const isAdmin = role === 'admin';
  const basePath = isAdmin ? '/admin' : '/customer';

  // Konfigurasi Routes
  const routes = {
    home: `${basePath}/homepage` as const,
    // Jika admin ke marketplace, jika customer ke customer-items
    middle: isAdmin ? `${basePath}/marketplace` : `${basePath}/customer-items` as const,
    profile: `${basePath}/profile` as const,
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
          bottom: 0,
        },
      ]}
    >
      {/* Tab Home */}
      <TouchableOpacity onPress={() => router.push(routes.home)}>
        <HomeIcon width={24} height={24} />
      </TouchableOpacity>

      {/* Tab Tengah (Dinamis) */}
      <TouchableOpacity onPress={() => router.push(routes.middle)}>
        {isAdmin ? (
          <ShopIcon width={24} height={24} />
        ) : (
          <CustomerItemsIcon width={24} height={24} />
        )}
      </TouchableOpacity>

      {/* Tab Profile */}
      <TouchableOpacity onPress={() => router.push(routes.profile)}>
        <ProfileIcon width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    zIndex: 100, // Memastikan navbar selalu di atas konten
  },
});