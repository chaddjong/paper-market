import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackIcon from '../../assets/icons/arrow-left.svg';
import MapIcon from '../../assets/icons/map.svg';
import WhatsappIcon from '../../assets/icons/whatsapp.svg';

export default function ProductDetail() {
  const router = useRouter();

  const product = {
    title: 'Buku',
    image: require('../../assets/images/hvs.png'),
    postedBy: 'Gabriel',
    postedTime: '3 hari yang lalu',
    weight: '15 Kg',
    condition: 'Rusak',
    location: 'Maumbi, Minahasa Utara',
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <BackIcon width={22} height={22} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{product.title}</Text>
          </View>

          {/* CONTENT */}
          <View style={styles.content}>
            <Image source={product.image} style={styles.image} />

            <Text style={styles.postInfo}>
              Di posting {product.postedTime} oleh {product.postedBy}
            </Text>

            <Text style={styles.weight}>{product.weight}</Text>

            <Text style={styles.condition}>{product.condition}</Text>

            <View style={styles.locationRow}>
              <MapIcon width={16} height={16} />
              <Text style={styles.location}>{product.location}</Text>
            </View>
          </View>

          {/* BOTTOM ACTION */}
          <View style={styles.bottomAction}>
            <TouchableOpacity style={styles.whatsappButton}>
              <WhatsappIcon width={18} height={18} />
              <Text style={styles.whatsappText}>Chat WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => router.push('/customer/purchase-form')}
            >
              <Text style={styles.buyText}>Lanjut Pembelian</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D6D6D6',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: '#333',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },

  image: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  postInfo: {
    fontSize: 13,
    color: '#777',
    marginBottom: 20,
  },

  weight: {
    fontSize: 24,
    fontWeight: '700',
    color: '#43A047',
    alignSelf: 'flex-start',
  },

  condition: {
    fontSize: 16,
    marginTop: 6,
    color: '#444',
    alignSelf: 'flex-start',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-start',
  },

  location: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },

  bottomAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#43B02A',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  whatsappText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 6,
  },

  buyButton: {
    flex: 1,
    backgroundColor: '#2F343A',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  buyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
