import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import FilterModal from '@/components/FilterModal';
import BottomNavbar from '../../components/BottomNavbar';
import MarketCard from '../../components/MarketCard';

import FilterAppliedIcon from '../../assets/icons/filter-applied.svg';
import FilterIcon from '../../assets/icons/filter.svg';

import EditIcon from '../../assets/icons/edit.svg';

import SearchIcon from '../../assets/icons/search.svg';

export default function Marketplace() {
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
    {
      title: 'Koran',
      image: require('../../assets/images/hvs.png'),
      time: '3 hari yang lalu',
      condition: 'Bagus',
      location: 'Maumbi, Minahasa Utara',
      weight: '10 Kg',
    },
  ];

  const [showFilter, setShowFilter] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          {/* Header Search */}
          <View style={styles.header}>
            <View style={styles.searchBox}>
              <TextInput
                placeholder="Cari kertas"
                placeholderTextColor="#888"
                style={styles.input}
              />
              <SearchIcon width={18} height={18} />
            </View>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowFilter(true)}
            >
              {showFilter ? (
                <FilterAppliedIcon width={22} height={22} />
              ) : (
                <FilterIcon width={22} height={22} />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <EditIcon width={22} height={22} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.marketGrid}>
              {marketData.map((item, index) => (
                <MarketCard key={index} data={item} />
              ))}
            </View>
          </ScrollView>

          <BottomNavbar />
        </View>

        {/* Modal di luar container */}
        <FilterModal
          visible={showFilter}
          onClose={() => setShowFilter(false)}
        />
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
    backgroundColor: '#E9E9E9',
  },

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    marginRight: 10,
  },

  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
  },

  iconButton: {
    marginLeft: 6,
  },

  scrollContent: {
    paddingBottom: 120,
    paddingTop: 10,
  },

  marketGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
