import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function InfoCard({ data }: any) {
  const imageSource =
    typeof data.image === 'string' ? { uri: data.image } : data.image;

  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.image} />

      <Text style={styles.title}>{data.title}</Text>

      <Text style={styles.price}>
        <Text style={styles.priceGreen}>{data.price}</Text> /Kg
      </Text>

      {/* Judul diubah menjadi Kondisi Kertas */}
      <Text style={styles.desc}>Kondisi kertas :</Text>

      {/* Render dinamis dari DB. 
          Menggunakan data.condition yang berisi teks multisaluran (Bagus, Rusak, Keterangan).
      */}
      {data.condition ? (
        <Text style={styles.conditionText}>{data.condition}</Text>
      ) : (
        <Text style={styles.bulletSmall}>Informasi kondisi tidak tersedia</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // Width diubah ke auto atau dihapus agar fleksibel dengan grid 2 kolom di Homepage
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    // Margin disesuaikan untuk grid
    marginBottom: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },

  image: {
    width: '100%',
    height: 100, // Sedikit ditinggikan agar gambar lebih jelas
    resizeMode: 'cover', // Menggunakan cover agar lebih rapi di layout grid
    marginBottom: 8,
    borderRadius: 8,
  },

  title: {
    fontWeight: '700',
    fontSize: 15,
    color: '#333',
  },

  price: {
    marginTop: 4,
    fontSize: 13,
    color: '#555',
  },

  priceGreen: {
    color: '#3FA34D',
    fontWeight: '700',
  },

  desc: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
    marginBottom: 2,
  },

  // Style baru untuk menangani teks kondisi dinamis (\n akan otomatis membuat baris baru)
  conditionText: {
    fontSize: 11,
    color: '#555',
    lineHeight: 16, // Memberi ruang antar baris agar enak dibaca
  },

  bulletSmall: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
});
