import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import CloseIcon from '../assets/icons/close.svg';

interface FilterData {
  jenisKertas: string | null;
  minBerat: string;
  maxBerat: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  filters: FilterData;
  setFilters: (filters: FilterData) => void;
}

export default function FilterModal({
  visible,
  onClose,
  filters,
  setFilters,
}: Props) {
  const categories = ['Kertas HVS', 'Buku', 'Map Jilid', 'Majalah', 'Koran'];

  const toggleCategory = (item: string) => {
    const newVal = filters.jenisKertas === item ? null : item;
    setFilters({ ...filters, jenisKertas: newVal });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Filter</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <CloseIcon width={24} height={24} />
            </TouchableOpacity>
          </View>

          {/* JENIS */}
          <Text style={styles.sectionTitle}>Jenis</Text>
          <View style={styles.chipContainer}>
            {categories.map((item, index) => {
              const isSelected = filters.jenisKertas === item;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => toggleCategory(item)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* BERAT */}
          <Text style={styles.sectionTitle}>Berat</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Minimum"
              placeholderTextColor="#BDBDBD"
              keyboardType="numeric"
              style={styles.input}
              value={filters.minBerat}
              onChangeText={(txt) => setFilters({ ...filters, minBerat: txt })}
            />
            <TextInput
              placeholder="Maximum"
              placeholderTextColor="#BDBDBD"
              keyboardType="numeric"
              style={styles.input}
              value={filters.maxBerat}
              onChangeText={(txt) => setFilters({ ...filters, maxBerat: txt })}
            />
          </View>

          {/* BUTTON TERAPKAN */}
          <TouchableOpacity style={styles.applyButton} onPress={onClose}>
            <Text style={styles.applyText}>Terapkan Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Sedikit lebih gelap agar fokus ke modal
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 25,
    paddingTop: 24,
    paddingBottom: 10, // Ruang ekstra bawah untuk kenyamanan
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 10,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
  },
  sectionTitle: {
    // marginTop: 25,
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  chip: {
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  chipSelected: {
    backgroundColor: '#2F343A', // Sesuaikan dengan tema app Anda
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  inputContainer: {
    gap: 12, // Memberikan jarak antar input vertikal
    marginTop: 5,
  },
  input: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  applyButton: {
    backgroundColor: '#2F343A',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  applyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
