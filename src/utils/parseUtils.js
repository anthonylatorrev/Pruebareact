
/**
 * @param {*} value
 * @returns {number}
 */
export function toSafeNumber(value) {
  if (value === null || value === undefined || value === '') return 0;

  const parsed = typeof value === 'number' ? value : parseFloat(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * @param {object} rawProduct
 * @returns {{ name: string, volume: number, quantity: number, subtotal: number }}
 */
export function normalizeProduct(rawProduct = {}) {
  const name = rawProduct?.name?.toString?.().trim() || 'Producto sin nombre';
  const volume = toSafeNumber(rawProduct?.volume);
  const quantity = toSafeNumber(rawProduct?.quantity);

  return {
    name,
    volume,
    quantity,
    subtotal: volume * quantity,
  };
}

/**
 * @param {object} rawOrder
 * @returns {object} orden normalizada + totalVolume
 */
export function normalizeOrder(rawOrder = {}) {
  const products = Array.isArray(rawOrder?.products)
    ? rawOrder.products.map(normalizeProduct)
    : [];

  const totalVolume = products.reduce((acc, p) => acc + p.subtotal, 0);

  return {
    id: rawOrder?.id ?? `SIN-ID-${Math.random().toString(36).slice(2, 8)}`,
    authCode: rawOrder?.authCode ?? '—',
    clientName: rawOrder?.clientName ?? 'Cliente desconocido',
    status: rawOrder?.status ?? 'Pendiente',
    createdAt: rawOrder?.createdAt ?? null,
    products,
    totalVolume,
  };
}

/**
 * Normaliza un arreglo completo de órdenes, descartando entradas
 * totalmente inválidas (null/undefined) sin tumbar la app.
 * @param {Array} rawOrders
 * @returns {Array}
 */
export function normalizeOrders(rawOrders) {
  if (!Array.isArray(rawOrders)) return [];
  return rawOrders.filter(Boolean).map(normalizeOrder);
}
