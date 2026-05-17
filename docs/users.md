# Módulo Users

Este módulo maneja la gestión de los usuarios del sistema. Los endpoints requieren autenticación (SessionGuard) y permisos específicos.

## Endpoints

### 1. Obtener lista de usuarios

- **URL**: `/users`
- **Método**: `GET`
- **Permisos requeridos**: `users:read`

#### Query Parameters
| Parámetro | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `include` | string | Relaciones a incluir | `?include=rol` |
| `page` | number | Número de página (paginación) | `?page=1` |
| `limit` | number | Elementos por página | `?limit=10` |

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": [
    {
      "entity": "User",
      "attributes": {
        "uuid": "uuid-del-usuario",
        "username": "usuario1",
        "email": "user1@example.com",
        "accountName": "BraveTiger",
        "isActive": true
      },
      "relationships": { ... }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### 2. Obtener un usuario específico

- **URL**: `/users/:uuid`
- **Método**: `GET`
- **Permisos requeridos**: `users:read`

#### Query Parameters
| Parámetro | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `include` | string | Relaciones a incluir | `?include=rol,profile` |

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": {
    "entity": "User",
    "attributes": {
      "uuid": "uuid-del-usuario",
      "username": "usuario1",
      "email": "user1@example.com"
    }
  }
}
```

---

### 3. Crear usuario

- **URL**: `/users`
- **Método**: `POST`
- **Permisos requeridos**: `users:create`

#### Body
```json
{
  "email": "nuevo@example.com",
  "username": "nuevousuario",
  "password": "Password123!",
  "roleId": 1
}
```

#### Respuesta
**201 Created**
```json
{
  "success": true,
  "data": {
    "entity": "User",
    "attributes": {
      "uuid": "nuevo-uuid",
      "username": "nuevousuario",
      "email": "nuevo@example.com"
    }
  }
}
```

---

### 4. Actualizar usuario

- **URL**: `/users/:uuid`
- **Método**: `PATCH`
- **Permisos requeridos**: `users:update`

#### Body
*(Todos los campos son opcionales)*
```json
{
  "email": "actualizado@example.com",
  "isActive": false,
  "roleId": 2
}
```

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": {
    "entity": "User",
    "attributes": { ... }
  }
}
```

---

### 5. Eliminar usuario

- **URL**: `/users/:uuid`
- **Método**: `DELETE`
- **Permisos requeridos**: `users:delete`

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": {
    "entity": "User",
    "attributes": {
       "uuid": "...",
       "deletedAt": "2026-05-16T..."
    }
  }
}
```
*(Nota: El sistema utiliza Soft Delete, por lo que el usuario no se borra físicamente, sino que se marca con una fecha de borrado).*
