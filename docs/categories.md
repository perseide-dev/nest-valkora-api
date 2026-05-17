# Módulo Categories

Este módulo maneja las categorías principales del foro (ej. "Juegos de Rol", "Discusión General").

## Endpoints

### 1. Obtener lista de Categorías

- **URL**: `/categories`
- **Método**: `GET`
- **Permisos requeridos**: `categories:read`

#### Query Parameters
| Parámetro | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `include` | string | Relaciones a incluir | `?include=subforums` |
| `page` | number | Número de página (paginación) | `?page=1` |
| `limit` | number | Elementos por página | `?limit=10` |

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": [
    {
      "entity": "Categorie",
      "attributes": {
        "uuid": "uuid-de-la-categoria",
        "name": "General",
        "description": "Discusión general del foro",
        "icon": "icon-home",
        "order": 1
      },
      "relationships": { ... }
    }
  ],
  "meta": { ... }
}
```

---

### 2. Obtener una Categoría específica

- **URL**: `/categories/:uuid`
- **Método**: `GET`
- **Permisos requeridos**: `categories:read`

#### Query Parameters
| Parámetro | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `include` | string | Relaciones a incluir | `?include=subforums` |

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": {
    "entity": "Categorie",
    "attributes": {
      "uuid": "...",
      "name": "Juegos de Rol"
    }
  }
}
```

---

### 3. Crear Categoría

- **URL**: `/categories`
- **Método**: `POST`
- **Permisos requeridos**: `categories:create`

#### Body
```json
{
  "name": "General",
  "description": "Zona de discusión de temas varios",
  "icon": "chat-bubble",
  "order": 1
}
```

#### Respuesta
**201 Created**
```json
{
  "success": true,
  "data": {
    "entity": "Categorie",
    "attributes": {
      "uuid": "...",
      "name": "General"
    }
  }
}
```

---

### 4. Actualizar Categoría

- **URL**: `/categories/:uuid`
- **Método**: `PATCH`
- **Permisos requeridos**: `categories:update`

#### Body
*(Todos los campos son opcionales)*
```json
{
  "name": "Discusión General",
  "order": 2
}
```

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": {
    "entity": "Categorie",
    "attributes": { ... }
  }
}
```

---

### 5. Eliminar Categoría

- **URL**: `/categories/:uuid`
- **Método**: `DELETE`
- **Permisos requeridos**: `categories:delete`

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": {
    "entity": "Categorie",
    "attributes": {
       "uuid": "...",
       "deletedAt": "..."
    }
  }
}
```
