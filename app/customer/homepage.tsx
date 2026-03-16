import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import BottomNavbar from '../../components/BottomNavbar';
import Header from '../../components/Header';
import InfoCard from '../../components/InfoCard';
import MarketCard from '../../components/MarketCard';

export default function Homepage() {
  const infoData = [
    {
      title: 'Kertas HVS',
      price: 'Rp. 1000',
      image: require('../../assets/images/hvs.png'),
    },
    {
      title: 'Buku',
      price: 'Rp. 1000',
      image: require('../../assets/images/hvs.png'),
    },
    {
      title: 'Buku',
      price: 'Rp. 1000',
      image: require('../../assets/images/hvs.png'),
    },
  ];

  const marketData = [
    {
      title: 'Kertas HVS',
      image: require('../../assets/images/hvs.png'),
      time: '3 hari yang lalu',
      condition: 'Bagus',
      location: 'Maumbi, Minahasa Utara',
      weight: '15 Kg',
    },
    {
      title: 'Buku',
      image: require('../../assets/images/hvs.png'),
      time: '3 hari yang lalu',
      condition: 'Rusak',
      location: 'Maumbi, Minahasa Utara',
      weight: '20 Kg',
    },
    {
      title: 'Map Jilid',
      image: require('../../assets/images/hvs.png'),
      time: '3 hari yang lalu',
      condition: 'Bagus',
      location: 'Maumbi, Minahasa Utara',
      weight: '35 Kg',
    },
    {
      title: 'Majalah',
      image: require('../../assets/images/hvs.png'),
      time: '3 hari yang lalu',
      condition: 'Bagus',
      location: 'Maumbi, Minahasa Utara',
      weight: '4 Kg',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <Header />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.sectionTitle}>Informasi</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.infoScroll}
            >
              {infoData.map((item, index) => (
                <InfoCard key={index} data={item} />
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>Market</Text>

            <View style={styles.marketGrid}>
              {marketData.map((item, index) => (
                <MarketCard key={index} data={item} />
              ))}
            </View>
          </ScrollView>

          <BottomNavbar />
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
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },

  infoScroll: {
    marginBottom: 10,
  },

  marketGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
