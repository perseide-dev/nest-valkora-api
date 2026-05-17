# Módulo Roles

Este módulo maneja los roles del sistema. Los roles agrupan diferentes permisos y se asignan a los usuarios para controlar su nivel de acceso.

## Endpoints

### 1. Obtener lista de roles

- **URL**: `/roles`
- **Método**: `GET`
- **Permisos requeridos**: `roles:read`

#### Query Parameters
| Parámetro | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `include` | string | Relaciones a incluir | `?include=permissions` |
| `page` | number | Número de página (paginación) | `?page=1` |
| `limit` | number | Elementos por página | `?limit=10` |

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": [
    {
      "entity": "Role",
      "attributes": {
        "uuid": "uuid-del-rol",
        "name": "Administrador",
        "description": "Acceso total al sistema"
      },
      "relationships": { ... }
    }
  ],
  "meta": { ... }
}
```

---

### 2. Obtener un rol específico

- **URL**: `/roles/:uuid`
- **Método**: `GET`
- **Permisos requeridos**: `roles:read`

#### Query Parameters
| Parámetro | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `include` | string | Relaciones a incluir | `?include=permissions,users` |

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": {
    "entity": "Role",
    "attributes": {
      "uuid": "...",
      "name": "Moderador",
      "description": "Acceso a foros"
    }
  }
}
```

---

### 3. Crear rol

- **URL**: `/roles`
- **Método**: `POST`
- **Permisos requeridos**: `roles:create`

#### Body
```json
{
  "name": "Nuevo Rol",
  "description": "Descripción opcional",
  "permissionIds": [1, 2, 3]
}
```

#### Respuesta
**201 Created**
```json
{
  "success": true,
  "data": {
    "entity": "Role",
    "attributes": {
      "uuid": "...",
      "name": "Nuevo Rol"
    }
  }
}
```

---

### 4. Actualizar rol

- **URL**: `/roles/:uuid`
- **Método**: `PATCH`
- **Permisos requeridos**: `roles:update`

#### Body
*(Todos los campos son opcionales)*
```json
{
  "name": "Rol Actualizado",
  "permissionIds": [1, 4, 5]
}
```

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": {
    "entity": "Role",
    "attributes": { ... }
  }
}
```

---

### 5. Eliminar rol

- **URL**: `/roles/:uuid`
- **Método**: `DELETE`
- **Permisos requeridos**: `roles:delete`

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": {
    "entity": "Role",
    "attributes": {
       "uuid": "...",
       "deletedAt": "..."
    }
  }
}
```
