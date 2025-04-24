# Caso de uso - Sistema de Gestión de Pedidos y Reseñas de Restaurantes

## 1. Actores principales
- **Cliente (usuario)**: navega, hace pedidos y deja reseñas.  
- **Administrador**: gestiona usuarios, restaurantes, menús, pedidos y reseñas.  
- **Repartidor**: ve los pedidos asignados y actualiza su estado.  

## 2. Casos de uso principales

| Caso de uso                 | Actor                  | Descripción breve                                                                                   |
|-----------------------------|------------------------|-----------------------------------------------------------------------------------------------------|
| Registro / Login            | Cliente                | El usuario se registra o autentica para poder realizar pedidos y escribir reseñas.                  |
| CRUD de Restaurantes        | Administrador          | Crear, leer, actualizar y borrar restaurantes; definir ubicación (geoespacial), especialidades, imágenes. |
| CRUD de Menú                | Administrador          | Definir artículos del menú vinculados a un restaurante (nombre, descripción, precio, categoría, imagen). |
| Realizar pedido             | Cliente                | Seleccionar platillos, indicar cantidades, confirmar pedido; el sistema guarda el documento Order.  |
| Consultar estado de pedido  | Cliente                | Ver fecha, estado (“pendiente”, “enviado”, “entregado”, etc.) y total; con paginación y filtros.    |
| Gestión de pedidos          | Administrador / Repartidor | Ver lista de pedidos, filtrar por fecha, estado o restaurante; actualizar estado.           |
| Publicar reseña             | Cliente                | Tras la entrega, el cliente puntúa (1–5) y comenta; se crea documento Review asociado a Order y Restaurant. |
| Consultar reseñas           | Cliente / Administrador | Ver reseñas de un restaurante, filtradas por calificación o fecha; búsqueda de texto completo. |
| Búsqueda geoespacial        | Cliente                | Listar restaurantes cercanos usando índice `$geoNear` sobre campo `location`.                       |
| Reportes y agregaciones     | Administrador          | Generar: “restaurantes mejor calificados”, “platillos más vendidos”, etc., usando pipelines de agregación. |

## 3. Flujo básico de “Realizar pedido”

1. **Inicio**: Cliente autenticado accede a listado de restaurantes.  
2. **Selección**: Elige un restaurante y ve su menú (proyección de campos necesarios).  
3. **Carrito**: Añade uno o varios `MenuItem` con cantidad.  
4. **Confirmación**: Cliente revisa total y confirma.  
5. **Creación de orden**:  
   - Inserta en `orders`:
     ```json
     {
       "userId": "...",
       "restaurantId": "...",
       "date": "...",
       "status": "pendiente",
       "total": 0,
       "items": [{ "menuItemId": "...", "quantity": 1 }, …]
     }
     ```
6. **Notificación / seguimiento**: Repartidor ve nueva orden y la acepta.  
7. **Actualización de estado**: Repartidor cambia `status` a “enviado” y luego a “entregado”.  
8. **Cierre**: Cliente recibe aviso de entrega y puede dejar reseña.  

## 4. Flujo alternativo y excepciones

- **Cancelación de pedido**:  
  - Antes de “enviado”, el cliente puede cancelar. Se actualiza `status` a “cancelado” y notifica.  
- **Stock insuficiente**:  
  - Si un platillo no está disponible, se impide la confirmación hasta ajustar cantidades.  
- **Error en actualización**:  
  - Ante conflictos al cambiar estado, se registra error e informa al administrador.  

## 5. Integración de funcionalidades avanzadas

- **GridFS** para almacenar imágenes de restaurantes y platillos.  
- **Text index** en `Reviews.comment` para búsqueda de reseñas por palabras clave.  
- **Multikey index** en `orders.items.menuItemId` para consultas de ventas por platillo.  
- **Paginación y filtros** en endpoints REST usando `skip`, `limit` y parámetros como `?status=entregado&dateFrom=...`.  
