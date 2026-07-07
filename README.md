Estructura

```
pale-app/
├── App.js                       # Pantalla principal (consulta + filtros + lista)
├── src/
│   ├── data/mockOrders.json     # Datos simulados, incluye datos "sucios" a propósito
│   ├── hooks/
│   │   ├── useOrders.js         # Consumo async/await del "servicio externo"
│   │   └── useFavorites.js      # Persistencia local (AsyncStorage)
│   ├── utils/
│   │   └── parseUtils.js        # Limpieza/parseo seguro de datos corruptos
│   └── components/
│       ├── Loader.js
│       ├── EmptyState.js
│       ├── SearchBar.js
│       ├── StatusFilter.js
│       ├── OrderItem.js         # Ítem de lista memoizado (React.memo)
│       └── OrderDetailModal.js  # Modal nativo con desglose y total de volumen
```

## Cómo se cubrió cada fase

### Fase 1 — Arquitectura y Consumo de API
- Pantalla de consulta: App.js lista las órdenes con un header, buscador y filtro de estado.
- Consumo asíncrono real: useOrders.js simula una llamada a un servicio externo con
  await new Promise(...) (latencia de red) y async/await, devolviendo un JSON. Basta con
  reemplazar el cuerpo de fetchOrdersFromApi por un fetch/axios real hacia tu backend.
- Rendimiento de listas: FlatList con keyExtractor estable,
  initialNumToRender, maxToRenderPerBatch, windowSize y removeClippedSubviews.
  OrderItem está envuelto en React.memo con comparación superficial para evitar
  renders innecesarios.
- Estados de UI: Loader mientras carga, EmptyState si no hay resultados o si el
  fetch falla (con mensaje amigable, sin pantallas en blanco).

### Fase 2 — Lógica de Negocio y Resolución de Problemas
- Filtros en tiempo real: SearchBar (por código de autorización o cliente) y
  StatusFilter (Pendiente / En Ruta / Cerrada / Todos), combinados con `useMemo` para
  recalcular la lista filtrada solo cuando cambian sus dependencias.
- Control y limpieza de datos: parseUtils.js centraliza el saneamiento:
  - toSafeNumber() convierte cualquier valor (string, null, undefined, "abc") a un
    número seguro, devolviendo 0 en vez de NaN.
  - normalizeProduct() limpia cada producto y calcula su subtotal de volumen.
  - normalizeOrder() calcula el **Total de Volumen Pedido** sumando los subtotales,
    garantizando que nunca sea NaN ni rompa el render.
  - normalizeOrders() filtra entradas nulas del arreglo completo sin tumbar la app.

  Esto se prueba directamente en mockOrders.json, que incluye volúmenes como string
  ("15.75"), null, undefined y strings inválidos ("abc").

### Fase 3 — Componentes Nativos y Persistencia
- Modal nativo: OrderDetailModal.js usa el componente Modal de React Native
  (presentationStyle="pageSheet", animationType="slide") para mostrar el desglose
  completo de productos y el total de volumen.
- Persistencia local**: useFavorites.js usa @react-native-async-storage/async-storage
  para guardar el arreglo de IDs marcados como "alerta/favorito". Se recupera
  automáticamente al reiniciar la app (useEffect en el montaje) y se actualiza de forma
  optimista al togglear.

## 🧪 Casos de prueba sugeridos
1. Busca por "AUTH-4" → debe filtrar la orden de Distribuidora Los Andes.
2. Filtra por "Cerrada" → deben aparecer 2 órdenes.
3. Abre ORD-1003 (Tubo PVC con volumen "abc") → el total debe calcularse sin crashear
   (el volumen inválido se trata como 0).
4. Marca una orden como favorita, cierra la app (o recarga en Expo) y vuelve a abrirla:
   la estrella debe seguir marcada.
5. Abre ORD-1005 (sin productos) → debe mostrar el mensaje de "sin productos registrados"
   y un total de 0.00 m³.
