import { useState, useEffect, useCallback } from 'react';
import { normalizeOrders } from '../utils/parseUtils';
import mockData from '../data/mockOrders.json';

async function fetchOrdersFromApi() {
  // Simula latencia de red real
  await new Promise((resolve) => setTimeout(resolve, 900));

  return mockData.orders;
}

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rawOrders = await fetchOrdersFromApi();
      const cleanOrders = normalizeOrders(rawOrders);
      setOrders(cleanOrders);
    } catch (err) {
      setError('No se pudo cargar la información. Intenta nuevamente.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return { orders, loading, error, reload: loadOrders };
}
