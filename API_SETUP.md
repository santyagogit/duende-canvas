# Configuración de la API de Productos

## Descripción

Este proyecto está configurado para conectarse con una API REST para gestionar productos. La integración incluye:

- ✅ Llamadas HTTP reales a la API
- ✅ Manejo de errores robusto
- ✅ Interceptores HTTP para gestión global
- ✅ Configuración de entornos (desarrollo/producción)
- ✅ Fallback a datos mock cuando la API no está disponible
- ✅ Notificaciones de estado con Material Design

## Configuración de la API

### URL Base
La URL base de la API se configura en los archivos de entorno:

- **Desarrollo**: `src/environments/environment.ts`
- **Producción**: `src/environments/environment.prod.ts`

Por defecto está configurada para: `https://localhost:7263/api/product`

### Endpoints Esperados

La aplicación espera los siguientes endpoints en tu API:

```
GET    /api/productos           - Obtener todos los productos
GET    /api/productos/:id       - Obtener producto por ID
POST   /api/productos           - Crear nuevo producto
PUT    /api/productos/:id       - Actualizar producto
DELETE /api/productos/:id       - Eliminar producto
GET    /api/productos/search?q= - Buscar productos
```

### Estructura de Datos

#### Producto
```typescript
interface Producto {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  imagen?: string;
}
```

#### Ejemplo de Respuesta GET /api/productos
```json
[
  {
    "id": "123456789",
    "nombre": "Producto A",
    "precio": 10.99,
    "descripcion": "Descripción del producto A",
    "imagen": "https://via.placeholder.com/150x150?text=Producto+A"
  }
]
```

## Configuración del Backend

### Ejemplo con Express.js y Node.js

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Simulación de base de datos
let productos = [
  {
    id: "123456789",
    nombre: "Producto A",
    precio: 10.99,
    descripcion: "Descripción del producto A",
    imagen: "https://via.placeholder.com/150x150?text=Producto+A"
  }
];

// GET /api/productos
app.get('/api/productos', (req, res) => {
  res.json(productos);
});

// GET /api/productos/:id
app.get('/api/productos/:id', (req, res) => {
  const producto = productos.find(p => p.id === req.params.id);
  if (!producto) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  res.json(producto);
});

// POST /api/productos
app.post('/api/productos', (req, res) => {
  const nuevoProducto = {
    id: Date.now().toString(),
    ...req.body
  };
  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

// PUT /api/productos/:id
app.put('/api/productos/:id', (req, res) => {
  const index = productos.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  productos[index] = { ...productos[index], ...req.body };
  res.json(productos[index]);
});

// DELETE /api/productos/:id
app.delete('/api/productos/:id', (req, res) => {
  const index = productos.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  productos.splice(index, 1);
  res.status(204).send();
});

// GET /api/productos/search
app.get('/api/productos/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const resultados = productos.filter(p => 
    p.nombre.toLowerCase().includes(query) ||
    p.descripcion?.toLowerCase().includes(query)
  );
  res.json(resultados);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
```

### Ejemplo con Python Flask

```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Simulación de base de datos
productos = [
    {
        "id": "123456789",
        "nombre": "Producto A",
        "precio": 10.99,
        "descripcion": "Descripción del producto A",
        "imagen": "https://via.placeholder.com/150x150?text=Producto+A"
    }
]

@app.route('/api/productos', methods=['GET'])
def get_productos():
    return jsonify(productos)

@app.route('/api/productos/<id>', methods=['GET'])
def get_producto(id):
    producto = next((p for p in productos if p['id'] == id), None)
    if not producto:
        return jsonify({'message': 'Producto no encontrado'}), 404
    return jsonify(producto)

@app.route('/api/productos', methods=['POST'])
def create_producto():
    nuevo_producto = {
        'id': str(len(productos) + 1),
        **request.json
    }
    productos.append(nuevo_producto)
    return jsonify(nuevo_producto), 201

@app.route('/api/productos/<id>', methods=['PUT'])
def update_producto(id):
    producto = next((p for p in productos if p['id'] == id), None)
    if not producto:
        return jsonify({'message': 'Producto no encontrado'}), 404
    
    producto.update(request.json)
    return jsonify(producto)

@app.route('/api/productos/<id>', methods=['DELETE'])
def delete_producto(id):
    global productos
    productos = [p for p in productos if p['id'] != id]
    return '', 204

@app.route('/api/productos/search', methods=['GET'])
def search_productos():
    query = request.args.get('q', '').lower()
    resultados = [p for p in productos 
                  if query in p['nombre'].lower() or 
                     query in p.get('descripcion', '').lower()]
    return jsonify(resultados)

if __name__ == '__main__':
    app.run(port=3000, debug=True)
```

## Uso en la Aplicación

### Funcionalidades Disponibles

1. **Cargar Productos**: Automáticamente carga productos desde la API
2. **Búsqueda Local**: Filtra productos cargados localmente
3. **Búsqueda en API**: Busca productos directamente en el servidor
4. **Selección de Productos**: Selecciona productos para usar en el editor
5. **Datos de Prueba**: Botón para cargar datos mock si la API no está disponible
6. **Manejo de Errores**: Notificaciones automáticas de errores con opción de reintentar

### Estados de la Aplicación

- **Cargando**: Spinner mientras se cargan los datos
- **Error**: Mensaje de error con opciones de reintentar o usar datos mock
- **Éxito**: Lista de productos con funcionalidades completas

### Notificaciones

La aplicación muestra notificaciones para:
- ✅ Productos cargados exitosamente
- ❌ Errores de conexión
- ⚠️ Uso de datos de prueba
- 🔍 Resultados de búsqueda

## Próximos Pasos

1. Configura tu backend con los endpoints mencionados
2. Ajusta la URL en `src/environments/environment.ts`
3. Ejecuta `ng serve` para probar la integración
4. Verifica que los productos se cargan correctamente
5. Prueba las funcionalidades de búsqueda y selección

## Troubleshooting

### Error de CORS
Si tienes errores de CORS, asegúrate de configurar CORS en tu backend:
```javascript
app.use(cors({
  origin: 'http://localhost:4200', // URL de tu aplicación Angular
  credentials: true
}));
```

### Error de Conexión
Si no puedes conectar con la API:
1. Verifica que el servidor backend esté ejecutándose
2. Comprueba la URL en el archivo de entorno
3. Usa el botón "Datos de prueba" para continuar con datos mock

### Error 404
Si obtienes error 404:
1. Verifica que los endpoints estén implementados correctamente
2. Comprueba que la ruta base sea `/api/productos`
3. Asegúrate de que el servidor esté escuchando en el puerto correcto
