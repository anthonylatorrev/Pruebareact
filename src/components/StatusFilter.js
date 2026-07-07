import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const STATUS_OPTIONS = ['Todos', 'Pendiente', 'En Ruta', 'Cerrada'];

export default function StatusFilter({ selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.wrapper}
      contentContainerStyle={styles.content}
    >
      {STATUS_OPTIONS.map((status) => {
        const isActive = status === selected;
        return (
          <TouchableOpacity
            key={status}
            onPress={() => onSelect(status)}
            style={[styles.chip, isActive && styles.chipActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {status}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
  },
  content: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#C8102E',
  },
  chipText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFF',
  },
});
