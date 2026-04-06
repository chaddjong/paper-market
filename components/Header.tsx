import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import EditIcon from '../assets/icons/edit.svg';
import NotificationIcon from '../assets/icons/notification.svg';
import Logo from '../assets/images/papermarket-p-logo.svg';

export default function Header() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Logo width={32} height={32} />
        <Text style={styles.title}>Paper Market</Text>
      </View>

      <View style={styles.right}>
        <TouchableOpacity onPress={() => router.push('/customer/create-post')}>
          <EditIcon width={22} height={22} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/customer/notification')}
        >
          <NotificationIcon width={22} height={22} />
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
