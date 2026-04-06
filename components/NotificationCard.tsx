import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  type: 'payment' | 'transaction';
  title: string;
  description?: string;
  imageUrl?: string; // Tambahkan prop imageUrl
  onPress: () => void;
}

export default function NotificationCard({
  type,
  title,
  description,
  imageUrl,
  onPress,
}: Props) {
  // Logika penentuan sumber gambar
  const renderIcon = () => {
    if (imageUrl) {
      return { uri: imageUrl };
    }
    // Fallback jika tidak ada gambar dari database
    return type === 'payment'
      ? require('../assets/images/buku.png')
      : require('../assets/images/hvs.png');
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.left}>
        <Image source={renderIcon()} style={styles.icon} />
      </View>

      <View style={styles.right}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#EEEEEE', // Lebih soft
    backgroundColor: '#FFFFFF', // Putih bersih
  },
  left: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden', // Agar gambar tidak keluar dari border radius
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Cover agar lebih estetik seperti feed
  },
  right: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
