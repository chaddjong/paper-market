import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import MapIcon from '../assets/icons/map.svg';

export default function MarketCard({ data }: any) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push('/customer/product-detail')}
    >
      <Image source={data.image} style={styles.image} />

      <Text style={styles.title}>{data.title}</Text>

      <Text style={styles.time}>{data.time}</Text>

      <Text style={styles.condition}>{data.condition}</Text>

      <View style={styles.locationRow}>
        <MapIcon width={14} height={14} />
        <Text style={styles.location}>{data.location}</Text>
      </View>

      <Text style={styles.weight}>{data.weight}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    marginLeft: 1,
    marginRight: 1,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
  },

  image: {
    width: '100%',
    height: 90,
    resizeMode: 'contain',
    marginBottom: 8,
  },

  title: {
    fontWeight: '600',
    fontSize: 14,
  },

  time: {
    fontSize: 12,
    color: '#666',
  },

  condition: {
    fontSize: 13,
    marginTop: 4,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  location: {
    fontSize: 12,
    marginLeft: 4,
    color: '#666',
  },

  weight: {
    marginTop: 4,
    fontWeight: '600',
    color: '#3FA34D',
  },
});
