# Módulo Control Groups

Este módulo gestiona los Control Groups, los cuales agrupan funcionalidades, recursos o restricciones que se ligan a permisos o usuarios, formando parte del sistema de Control de Acceso Basado en Atributos (ABAC) del sistema.

## Endpoints

### 1. Obtener lista de Control Groups

- **URL**: `/control-groups`
- **Método**: `GET`
- **Permisos requeridos**: `control-groups:read`

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
      "entity": "ControlGroup",
      "attributes": {
        "id": 1,
        "name": "Beta Testers",
        "description": "Usuarios con acceso a funciones experimentales"
      },
      "relationships": { ... }
    }
  ],
  "meta": { ... }
}
```

---

### 2. Obtener un Control Group específico

- **URL**: `/control-groups/:id`
- **Método**: `GET`
- **Permisos requeridos**: `control-groups:read`

#### Query Parameters
| Parámetro | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `include` | string | Relaciones a incluir | `?include=permissions` |

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": {
    "entity": "ControlGroup",
    "attributes": {
      "id": 1,
      "name": "Beta Testers",
      "description": "Usuarios con acceso a funciones experimentales"
    }
  }
}
```

---

### 3. Crear Control Group

- **URL**: `/control-groups`
- **Método**: `POST`
- **Permisos requeridos**: `control-groups:create`

#### Body
```json
{
  "name": "V.I.P",
  "description": "Usuarios con acceso a características premium",
  "permissionIds": [1, 5, 8]
}
```

#### Respuesta
**201 Created**
```json
{
  "success": true,
  "data": {
    "entity": "ControlGroup",
    "attributes": {
      "id": 2,
      "name": "V.I.P"
    }
  }
}
```

---

### 4. Actualizar Control Group

- **URL**: `/control-groups/:id`
- **Método**: `PATCH`
- **Permisos requeridos**: `control-groups:update`

#### Body
*(Todos los campos son opcionales)*
```json
{
  "description": "Nueva descripción"
}
```

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": {
    "entity": "ControlGroup",
    "attributes": { ... }
  }
}
```

---

### 5. Eliminar Control Group

- **URL**: `/control-groups/:id`
- **Método**: `DELETE`
- **Permisos requeridos**: `control-groups:delete`

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": {
    "entity": "ControlGroup",
    "attributes": {
       "id": 2,
       "deletedAt": "..."
    }
  }
}
```
