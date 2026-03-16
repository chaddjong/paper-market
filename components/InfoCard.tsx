import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function InfoCard({ data }: any) {
  return (
    <View style={styles.card}>
      <Image source={data.image} style={styles.image} />

      <Text style={styles.title}>{data.title}</Text>

      <Text style={styles.price}>
        <Text style={styles.priceGreen}>{data.price}</Text> /Kg
      </Text>

      <Text style={styles.desc}>Kualitas kertas :</Text>

      <Text style={styles.bullet}>• Bagus</Text>
      <Text style={styles.bullet}>• Rusak</Text>
      <Text style={styles.bulletSmall}>
        (robek, sebagian terbakar) (- Rp. 300/kg)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginRight: 12,
    marginLeft: 2,
    marginTop: 1,
    marginBottom: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },

  image: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
    marginBottom: 6,
  },

  title: {
    fontWeight: '600',
    fontSize: 14,
  },

  price: {
    marginTop: 4,
    fontSize: 13,
  },

  priceGreen: {
    color: '#3FA34D',
    fontWeight: '600',
  },

  desc: {
    marginTop: 6,
    fontSize: 12,
  },

  bullet: {
    fontSize: 12,
  },

  bulletSmall: {
    fontSize: 11,
    color: '#555',
  },
});
