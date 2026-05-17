# Módulo Auth

Este módulo maneja la autenticación y el login del sistema. Utiliza cookies seguras (`Authentication` y `Refresh`) para mantener la sesión del usuario.

## Endpoints

### 1. Iniciar Sesión (Login)

Inicia sesión en la aplicación, devolviendo la información del usuario autenticado y estableciendo las cookies de sesión en el navegador.

- **URL**: `/auth/login`
- **Método**: `POST`
- **Autenticación requerida**: No (Público)

#### Query Parameters
| Parámetro | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `include` | string | Relaciones a cargar con el usuario | `?include=rol,rol.permissions` |

#### Body

```json
{
  "emailOrUsername": "usuario123",
  "password": "Password123!"
}
```

#### Respuestas

**201 Created (Éxito)**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "entity": "User",
    "attributes": {
      "uuid": "...",
      "username": "usuario123",
      "email": "correo@ejemplo.com",
      "accountName": "FunnyAnimal"
    },
    "relationships": {
      "rol": {
         "entity": "Role",
         "attributes": {
            "name": "Administrador"
         }
      }
    }
  }
}
```
*(Nota: El backend setea automáticamente las cookies `Authentication` y `Refresh` en el navegador tras una respuesta exitosa).*

**401 Unauthorized**
```json
{
  "success": false,
  "message": "Credenciales inválidas",
  "error": "Unauthorized"
}
```

---

### 2. Configuración Inicial (Setup)

Endpoint interno usado para cargar la semilla (seed) de roles y usuario admin por defecto en la base de datos (usualmente invocado vía CLI).

- **URL**: `/auth/setup`
- **Método**: `POST`
- **Autenticación requerida**: API Key en el header.

#### Headers Requeridos
| Header | Valor | Descripción |
| :--- | :--- | :--- |
| `x-api-key` | string | Token de administrador configurado en el `.env` |

#### Respuestas

**201 Created**
```json
{
  "success": true,
  "message": "Sistema inicializado correctamente con los datos semilla"
}
```
