import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  type: 'payment' | 'transaction';
  title: string;
  description?: string;
  onPress: () => void;
}

export default function NotificationCard({
  type,
  title,
  description,
  onPress,
}: Props) {
  const getIcon = () => {
    if (type === 'payment') {
      return require('../assets/images/buku.png'); // sesuaikan nanti
    }

    return require('../assets/images/hvs.png'); // sesuaikan nanti
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.left}>
        <Image source={getIcon()} style={styles.icon} />
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
    borderColor: '#D6D6D6',
    backgroundColor: '#F9F9F9',
  },

  left: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },

  right: {
    flex: 1,
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  description: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
});
