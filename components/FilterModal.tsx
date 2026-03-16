import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import CloseIcon from '../assets/icons/close.svg';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function FilterModal({ visible, onClose }: Props) {
  const categories = ['Kertas HVS', 'Buku', 'Map Jilid', 'Majalah', 'Koran'];
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Filter</Text>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <CloseIcon width={20} height={20} />
            </TouchableOpacity>
          </View>

          {/* JENIS */}
          <Text style={styles.sectionTitle}>Jenis</Text>

          <View style={styles.chipContainer}>
            {categories.map((item, index) => {
              const isSelected = selectedType === item;

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => setSelectedType(item)}
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

          <TextInput
            placeholder="Minimum"
            placeholderTextColor="#999"
            style={styles.input}
          />

          <TextInput
            placeholder="Maximum"
            placeholderTextColor="#999"
            style={styles.input}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },

  container: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },

  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
  },

  closeButton: {
    position: 'absolute',
    right: 0,
  },

  sectionTitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
  },

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },

  chip: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 10,
  },

  chipText: {
    fontSize: 14,
    color: '#333',
  },

  chipSelected: {
    backgroundColor: '#28A745',
  },

  chipTextSelected: {
    color: '#FFFFFF',
  },

  input: {
    marginTop: 10,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    textAlign: 'center', // ini yang membuat placeholder center
  },
});
