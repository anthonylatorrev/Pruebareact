import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export default function Loader({ label = 'Cargando órdenes...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#C8102E" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
});
