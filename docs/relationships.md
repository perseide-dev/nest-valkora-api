# Relaciones y Estructura de Respuesta (Includes)

La API utiliza un formato de respuesta estándar diseñado para ser predecible y fácil de consumir en el frontend. Todas las respuestas exitosas que devuelven entidades siguen una estructura uniforme y soportan la carga dinámica de relaciones mediante el query parameter `include`.

## Estructura Base de la Respuesta

Cada endpoint devuelve un objeto JSON con la siguiente estructura:

```json
{
  "success": true,
  "message": "Mensaje opcional de éxito",
  "data": {
    "entity": "NombreEntidad",
    "attributes": {
      "uuid": "...",
      "campo1": "valor1",
      "campo2": "valor2"
    },
    "relationships": {
      "nombreRelacion": {
        "entity": "EntidadRelacionada",
        "attributes": { ... },
        "relationships": { ... }
      }
    }
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Explicación de los campos:
- **`success`**: Indica si la operación fue exitosa (`true`) o falló (`false`).
- **`message`**: (Opcional) Un mensaje descriptivo de la acción (ej. "Login exitoso").
- **`data`**: Contiene la información principal. Si es una lista, será un arreglo `[]` de objetos con esta estructura. Si la respuesta es de paginación, también existirá el objeto `meta`.
- **`entity`**: El nombre del modelo/entidad (ej. `"User"`, `"Role"`, `"Profile"`).
- **`attributes`**: Los campos propios de la entidad que no son relaciones (ej. `email`, `username`, `createdAt`).
- **`relationships`**: (Opcional) Contiene las entidades relacionadas. Solo aparecerá si se solicitó explícitamente mediante el parámetro `include`.
- **`meta`**: (Opcional) Información de paginación, solo presente en endpoints `GET` que devuelven listas.

## El parámetro `include` (Carga Dinámica de Relaciones)

Por defecto, la API **no** devuelve relaciones anidadas para evitar sobrecarga de datos. Para obtener datos relacionados, debes usar el query parameter `include` en la URL.

### Sintaxis

- **Una relación:** `?include=rol`
- **Múltiples relaciones:** `?include=rol,profile`
- **Relaciones anidadas:** `?include=rol,rol.permissions`

### Ejemplo de uso

Si haces un `GET /users/:uuid`, por defecto solo obtendrás los atributos del usuario.

Si quieres obtener el usuario con su rol y los permisos de ese rol, la petición sería:

`GET /users/:uuid?include=rol,rol.permissions`

**Respuesta Esperada:**

```json
{
  "success": true,
  "data": {
    "entity": "User",
    "attributes": {
      "uuid": "1234-5678",
      "email": "user@example.com",
      "username": "usuario_prueba"
    },
    "relationships": {
      "rol": {
        "entity": "Role",
        "attributes": {
          "uuid": "role-123",
          "name": "Administrador"
        },
        "relationships": {
          "permissions": [
            {
              "entity": "Permission",
              "attributes": {
                "action": "create",
                "module": "users"
              }
            }
          ]
        }
      }
    }
  }
}
```

## Notas Importantes para el Frontend
1. **Verificar `relationships`**: Al extraer datos en el frontend, siempre verifica si `data.relationships` existe antes de intentar acceder a relaciones anidadas, ya que si no se pasaron en el `include`, el objeto `relationships` será `undefined`.
2. **Exclusiones de campos**: Algunos campos sensibles (como contraseñas) son eliminados automáticamente de los `attributes` gracias a la serialización interna de la API.
3. **Paginación**: En endpoints como `GET /users`, los datos vendrán en `response.data`, y la metainformación de la paginación vendrá en `response.meta`.
