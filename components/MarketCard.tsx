import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapIcon from '../assets/icons/map.svg';

export default function MarketCard({ data, showEdit = false }: any) {
  const router = useRouter();

  const imageSource = typeof data.image === 'string' ? { uri: data.image } : data.image;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/customer/product-detail',
          params: { id: data.id },
        })
      }
    >
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.time}>{data.time}</Text>
      <Text style={styles.condition}>{data.condition}</Text>

      <View style={styles.locationRow}>
        <MapIcon width={14} height={14} />
        <Text style={styles.location} numberOfLines={2}>{data.location}</Text>
      </View>

      <Text style={styles.weight}>{data.weight}</Text>

      {/* Tombol Edit Khusus Halaman Postingan Anda */}
      {showEdit && (
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => router.push({ pathname: '/customer/edit-post', params: { id: data.id } })}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      )}
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    borderRadius: 8,
    marginBottom: 8,
  },
  title: { fontWeight: '700', fontSize: 16, color: '#000' },
  time: { fontSize: 12, color: '#9A9A9A', marginTop: 2 },
  condition: { fontSize: 13, color: '#7A7A7A', marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 4, gap: 4 },
  location: { fontSize: 11, color: '#7A7A7A', flex: 1 },
  weight: { marginTop: 6, fontWeight: '700', color: '#3FA34D', fontSize: 15 },
  editButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
  },
  editText: { fontSize: 13, fontWeight: '500', color: '#333' },
});