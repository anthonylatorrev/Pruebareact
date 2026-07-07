import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@pale_app:favorite_orders';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setFavoriteIds(parsed);
        }
      } catch (err) {
        setFavoriteIds([]);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const toggleFavorite = useCallback(async (orderId) => {
    setFavoriteIds((prev) => {
      const isFav = prev.includes(orderId);
      const updated = isFav
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId];

      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {
      });

      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (orderId) => favoriteIds.includes(orderId),
    [favoriteIds]
  );

  return { favoriteIds, isFavorite, toggleFavorite, ready };
}
