import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const STATUS_COLORS = {
  Pendiente: '#F5A623',
  'En Ruta': '#4A90D9',
  Cerrada: '#7ED957',
};

function OrderItem({ order, isFavorite, onPress }) {
  const statusColor = STATUS_COLORS[order.status] || '#999';

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(order)} activeOpacity={0.7}>
      <View style={styles.row}>
        <Text style={styles.authCode}>{order.authCode}</Text>
        {isFavorite ? <Text style={styles.star}>⭐</Text> : null}
      </View>
      <Text style={styles.client} numberOfLines={1}>
        {order.clientName}
      </Text>
      <View style={styles.footerRow}>
        <View style={[styles.badge, { backgroundColor: statusColor }]}>
          <Text style={styles.badgeText}>{order.status}</Text>
        </View>
        <Text style={styles.idText}>{order.id}</Text>
      </View>
    </TouchableOpacity>
  );
}

function areEqual(prevProps, nextProps) {
  return (
    prevProps.order.id === nextProps.order.id &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.order.status === nextProps.order.status
  );
}

export default React.memo(OrderItem, areEqual);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authCode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  star: {
    fontSize: 14,
  },
  client: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '600',
  },
  idText: {
    fontSize: 11,
    color: '#AAA',
  },
});
