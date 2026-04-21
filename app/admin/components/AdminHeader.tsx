import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Logo from '../../../assets/images/papermarket-p-logo.svg';
import CartIcon from '../../../assets/icons/cart.svg'

export default function AdminHeader() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Logo width={32} height={32} />
        <Text style={styles.title}>Paper Market</Text>
      </View>

      <View style={styles.right}>

        <TouchableOpacity onPress={() => router.push('/admin/purchase-history')}>
          <CartIcon width={22} height={22} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D6D6D6',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
  },

  right: {
    flexDirection: 'row',
    gap: 16,
  },
});
