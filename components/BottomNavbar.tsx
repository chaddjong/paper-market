import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import HomeIcon from '../assets/icons/home-2.svg';
import ProfileIcon from '../assets/icons/profile.svg';
import ShopIcon from '../assets/icons/shop.svg';

export default function BottomNavbar() {
  const router = useRouter();
  const { role } = useAuth();

  // fallback biar tidak error
  const basePath = role === 'admin' ? '/admin' : '/customer';

  const routes = {
    home: `${basePath}/homepage` as const,
    market: `${basePath}/marketplace` as const,
    profile: `${basePath}/profile` as const,
  };

  return (
    <View style={styles.container}>
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#D6D6D6',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
});
