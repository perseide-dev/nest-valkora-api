# Módulo Permissions

Este módulo gestiona los permisos del sistema que definen las acciones específicas que un usuario puede realizar en cada módulo del sistema.

## Endpoints

### 1. Obtener lista de permisos

- **URL**: `/permissions`
- **Método**: `GET`
- **Permisos requeridos**: `permissions:read`

#### Query Parameters
| Parámetro | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `include` | string | Relaciones a incluir | `?include=controlGroups` |
| `page` | number | Número de página (paginación) | `?page=1` |
| `limit` | number | Elementos por página | `?limit=10` |

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": [
    {
      "entity": "Permission",
      "attributes": {
        "id": 1,
        "action": "create",
        "module": "users",
        "description": "Permiso para crear usuarios"
      },
      "relationships": { ... }
    }
  ],
  "meta": { ... }
}
```

---

### 2. Obtener un permiso específico

- **URL**: `/permissions/:id`
- **Método**: `GET`
- **Permisos requeridos**: `permissions:read`

#### Query Parameters
| Parámetro | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `include` | string | Relaciones a incluir | `?include=controlGroups` |

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": {
    "entity": "Permission",
    "attributes": {
      "id": 2,
      "action": "read",
      "module": "roles"
    }
  }
}
```

---

### 3. Crear permiso

- **URL**: `/permissions`
- **Método**: `POST`
- **Permisos requeridos**: `permissions:create`

#### Body
```json
{
  "action": "manage",
  "module": "system",
  "description": "Acceso a la configuración global",
  "controlGroupIds": [1, 2]
}
```

#### Respuesta
**201 Created**
```json
{
  "success": true,
  "data": {
    "entity": "Permission",
    "attributes": {
      "id": 3,
      "action": "manage",
      "module": "system"
    }
  }
}
```

---

### 4. Actualizar permiso

- **URL**: `/permissions/:id`
- **Método**: `PATCH`
- **Permisos requeridos**: `permissions:update`

#### Body
*(Todos los campos son opcionales)*
```json
{
  "description": "Nueva descripción del permiso",
  "controlGroupIds": [3]
}
```

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": {
    "entity": "Permission",
    "attributes": { ... }
  }
}
```

---

### 5. Eliminar permiso

- **URL**: `/permissions/:id`
- **Método**: `DELETE`
- **Permisos requeridos**: `permissions:delete`

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": {
    "entity": "Permission",
    "attributes": {
       "id": 3,
       "deletedAt": "..."
    }
  }
}
```
