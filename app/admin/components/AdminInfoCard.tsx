import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AdminInfoCard({ data }: any) {
  const router = useRouter();

  const imageSource =
    typeof data.image === 'string' ? { uri: data.image } : data.image;

  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.price}>
        <Text style={styles.priceGreen}>{data.price}</Text> /Kg
      </Text>
      <Text style={styles.desc}>Kualitas : {data.condition}</Text>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() =>
          router.push({
            pathname: '/admin/edit-information',
            params: { id: data.id },
          })
        }
      >
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
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

  editButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    marginTop: 10,
  },

  editText: {
    fontSize: 11,
    padding: 8,
  },
});
