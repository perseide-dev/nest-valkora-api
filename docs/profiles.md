# Módulo Profiles

Este módulo gestiona los perfiles de los usuarios dentro del sistema. La creación de perfiles asocia la cuenta autenticada del usuario al perfil recién creado y permite añadir amantes, propiedades e información estadística.

## Endpoints

### 1. Obtener lista de perfiles

- **URL**: `/profiles`
- **Método**: `GET`
- **Permisos requeridos**: `profiles:read`

#### Query Parameters
| Parámetro | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `include` | string | Relaciones a incluir | `?include=user,info,lover` |
| `page` | number | Número de página (paginación) | `?page=1` |
| `limit` | number | Elementos por página | `?limit=10` |

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": [
    {
      "entity": "Profile",
      "attributes": {
        "uuid": "uuid-del-perfil",
        "name": "Nombre de personaje",
        "nationality": "Nacionalidad",
        "race": "Raza",
        "age": 25,
        "history": "Biografía del personaje...",
        "status": "Alive"
      },
      "relationships": { ... }
    }
  ],
  "meta": { ... }
}
```

---

### 2. Obtener un perfil específico

- **URL**: `/profiles/:uuid`
- **Método**: `GET`
- **Permisos requeridos**: `profiles:read`

#### Query Parameters
| Parámetro | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `include` | string | Relaciones a incluir | `?include=info,lover,user,assets` |

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": {
    "entity": "Profile",
    "attributes": {
      "uuid": "...",
      "name": "Nombre del Perfil"
    }
  }
}
```

---

### 3. Crear perfil

- **URL**: `/profiles`
- **Método**: `POST`
- **Permisos requeridos**: `profiles:create`

#### Body
```json
{
  "name": "Cloud Strife",
  "nationality": "Nibelheim",
  "race": "Human",
  "age": 21,
  "history": "Ex-SOLDIER...",
  "status": "Alive"
}
```
*(Nota: El perfil se asocia automáticamente al usuario logueado en la sesión que realiza la petición).*

#### Respuesta
**201 Created**
```json
{
  "success": true,
  "data": {
    "entity": "Profile",
    "attributes": {
      "uuid": "...",
      "name": "Cloud Strife",
      "userUuid": "uuid-del-usuario-logueado"
    }
  }
}
```

---

### 4. Actualizar perfil

- **URL**: `/profiles/:uuid`
- **Método**: `PATCH`
- **Permisos requeridos**: `profiles:update`

#### Body
*(Todos los campos son opcionales)*
```json
{
  "status": "Dead",
  "age": 22
}
```

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": {
    "entity": "Profile",
    "attributes": { ... }
  }
}
```

---

### 5. Eliminar perfil

- **URL**: `/profiles/:uuid`
- **Método**: `DELETE`
- **Permisos requeridos**: `profiles:delete`

#### Respuesta
**200 OK**
```json
{
  "success": true,
  "data": {
    "entity": "Profile",
    "attributes": {
       "uuid": "...",
       "deletedAt": "..."
    }
  }
}
```
