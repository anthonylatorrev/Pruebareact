import React, { useState, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';

import { useOrders } from './src/hooks/useOrders';
import { useFavorites } from './src/hooks/useFavorites';

import Loader from './src/components/Loader';
import EmptyState from './src/components/EmptyState';
import SearchBar from './src/components/SearchBar';
import StatusFilter from './src/components/StatusFilter';
import OrderItem from './src/components/OrderItem';
import OrderDetailModal from './src/components/OrderDetailModal';

export default function App() {
  const { orders, loading, error } = useOrders();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredOrders = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'Todos' || order.status === statusFilter;

      const matchesText =
        query.length === 0 ||
        order.authCode.toLowerCase().includes(query) ||
        order.clientName.toLowerCase().includes(query);

      return matchesStatus && matchesText;
    });
  }, [orders, searchText, statusFilter]);

  const handleOpenOrder = useCallback((order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <OrderItem order={item} isFavorite={isFavorite(item.id)} onPress={handleOpenOrder} />
    ),
    [isFavorite, handleOpenOrder]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Órdenes de Distribución</Text>
        <Text style={styles.headerSubtitle}>
          {loading ? 'Actualizando...' : `${filteredOrders.length} resultado(s)`}
        </Text>
      </View>

      <SearchBar value={searchText} onChangeText={setSearchText} />
      <StatusFilter selected={statusFilter} onSelect={setStatusFilter} />

      {loading ? (
        <Loader />
      ) : error ? (
        <EmptyState title="Ocurrió un problema" subtitle={error} icon="⚠️" />
      ) : filteredOrders.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={7}
          removeClippedSubviews
          contentContainerStyle={styles.listContent}
        />
      )}

      <OrderDetailModal
        order={selectedOrder}
        visible={modalVisible}
        onClose={handleCloseModal}
        isFavorite={selectedOrder ? isFavorite(selectedOrder.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#222' },
  headerSubtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  listContent: { paddingBottom: 24 },
});
