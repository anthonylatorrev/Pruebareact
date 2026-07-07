import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

export default function OrderDetailModal({ order, visible, onClose, isFavorite, onToggleFavorite }) {
  if (!order) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{order.authCode}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.clientName}>{order.clientName}</Text>
          <Text style={styles.status}>Estado: {order.status}</Text>
          <Text style={styles.orderId}>ID interno: {order.id}</Text>
        </View>

        <TouchableOpacity
          style={[styles.favButton, isFavorite && styles.favButtonActive]}
          onPress={() => onToggleFavorite(order.id)}
          activeOpacity={0.8}
        >
          <Text style={[styles.favButtonText, isFavorite && styles.favButtonTextActive]}>
            {isFavorite ? '⭐ Marcada como alerta' : '☆ Marcar como alerta'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Productos</Text>

        <FlatList
          data={order.products}
          keyExtractor={(item, index) => `${order.id}-${item.name}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.productRow}>
              <Text style={styles.productName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.productDetail}>
                {item.quantity} u × {item.volume} = {item.subtotal.toFixed(2)} m³
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noProducts}>Esta orden no tiene productos registrados.</Text>
          }
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total de Volumen Pedido</Text>
          <Text style={styles.totalValue}>{order.totalVolume.toFixed(2)} m³</Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#222' },
  closeText: { fontSize: 15, color: '#C8102E', fontWeight: '600' },
  infoBlock: { paddingHorizontal: 20, paddingTop: 14 },
  clientName: { fontSize: 16, fontWeight: '600', color: '#333' },
  status: { fontSize: 13, color: '#666', marginTop: 4 },
  orderId: { fontSize: 12, color: '#AAA', marginTop: 2 },
  favButton: {
    marginHorizontal: 20,
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C8102E',
    alignItems: 'center',
  },
  favButtonActive: { backgroundColor: '#C8102E' },
  favButtonText: { color: '#C8102E', fontWeight: '600', fontSize: 13 },
  favButtonTextActive: { color: '#FFF' },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    marginTop: 20,
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 12 },
  productRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  productName: { fontSize: 14, color: '#333', fontWeight: '500' },
  productDetail: { fontSize: 12, color: '#888', marginTop: 2 },
  noProducts: { fontSize: 13, color: '#999', paddingVertical: 12 },
  totalBox: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#F5C6C6',
    alignItems: 'center',
  },
  totalLabel: { fontSize: 12, color: '#888' },
  totalValue: { fontSize: 24, fontWeight: '800', color: '#C8102E', marginTop: 4 },
});
