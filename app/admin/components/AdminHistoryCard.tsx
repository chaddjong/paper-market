import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface HistoryCardProps {
  data: {
    productName: string;
    date: string;
    image: string;
  };
  onPress: () => void;
}

export default function AdminHistoryCard({ data, onPress }: HistoryCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: data.image }} style={styles.image} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>Pembelian {data.productName}</Text>
        <Text style={styles.date}>Dibeli pada {data.date}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    alignItems: 'center',
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  infoContainer: {
    marginLeft: 15,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  date: {
    fontSize: 13,
    color: '#9A9A9A',
    marginTop: 4,
  },
});