# 🔐 Guía de Seguridad Actualizada - AdoptMeBack

## ¿Qué se implementó?

### 1. **Hasheo de Contraseñas con bcryptjs** ✅
- Contraseñas se hashean automáticamente al registrarse
- Al hacer login, se compara el hash (NO se guarda contraseña en texto plano)
- 10 salt rounds para mayor seguridad

### 2. **JWT Authentication** ✅
- Token que expira en 24h
- Incluye: id, email, rol
- Se valida en todos los endpoints protegidos
- Manejo de tokens expirados

### 3. **Control de Acceso por Roles** ✅
Ahora puedes:
```javascript
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), Controller.eliminar);
```
- `usuario`: permisos básicos
- `admin`: permisos para crear/editar/eliminar datos sensibles

### 4. **Validación de Inputs con Express-Validator** ✅
- Valida emails, contraseñas, longitudes, tipos de datos
- Mensajes de error descriptivos
- Protege contra MalICIOUS inputs

### 5. **CORS Configurado** ✅
- Permite requests desde cualquier origen
- Solo métodos HTTP permitidos
- Headers controlados

### 6. **Rate Limiting** ✅
- 100 requests máximo por 15 minutos
- Protege contra fuerza bruta y DDoS

### 7. **Validación de Variables de Entorno** ✅
- Falla si falta una variable crítica
- Mensaje claro de qué configurar

### 8. **Logging con Morgan** ✅
- Registra todas las requests
- Método, URL, status, tiempo de respuesta

---

## 🚀 Cómo Usar la API

### Paso 1: Registrarse
```bash
POST /api/usuarios
Content-Type: application/json

{
  "email": "usuario@example.com",
  "contrasena": "MiPassword123",
  "nombre_usuario": "miusername",
  "telefono": "1234567890",
  "ciudad": "Madrid",
  "tipo_vivienda": "Apartamento",
  "tiene_patio": false
}
```

**Respuesta (201 Created):**
```json
{
  "id": 1,
  "email": "usuario@example.com",
  "nombre_usuario": "miusername",
  "rol": "usuario"
}
```

### Paso 2: Hacer Login
```bash
POST /api/usuarios/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "contrasena": "MiPassword123"
}
```

**Respuesta (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "email": "usuario@example.com",
    "nombre_usuario": "miusername",
    "rol": "usuario"
  }
}
```

### Paso 3: Usar el Token
Incluir el token en todos los requests protegidos:
```bash
GET /api/usuarios
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📋 Endpoints Protegidos

### Públicos (sin autenticación)
- `POST /api/usuarios` - Registrarse
- `POST /api/usuarios/login` - Hacer login
- `GET /health` - Health check

### Requieren Autenticación
Todos estos requieren header `Authorization: <token>`

**Usuarios:**
- `GET /api/usuarios` - Ver todos
- `GET /api/usuarios/:id` - Ver un usuario
- `PUT /api/usuarios/:id` - Actualizar propio perfil
- `DELETE /api/usuarios/:id` - Solo admin

**Mascotas:**
- `GET /api/mascotas` - Ver todas
- `GET /api/mascotas/:id` - Ver una mascota
- `POST /api/mascotas` - Solo admin
- `PUT /api/mascotas/:id` - Solo admin
- `DELETE /api/mascotas/:id` - Solo admin

**Solicitudes:**
- `GET /api/solicitudes` - Ver todas
- `GET /api/solicitudes/:id` - Ver una
- `POST /api/solicitudes` - Crear solicitud
- `PUT /api/solicitudes/:id` - Solo admin
- `DELETE /api/solicitudes/:id` - Solo admin

**Citas:**
- `GET /api/citas` - Ver todas
- `GET /api/citas/:id` - Ver una
- `POST /api/citas` - Crear cita
- `PUT /api/citas/:id` - Solo admin
- `DELETE /api/citas/:id` - Solo admin

**Mensajes:**
- `GET /api/mensajes` - Ver todos
- `GET /api/mensajes/:id` - Ver uno
- `POST /api/mensajes` - Crear mensaje
- `PUT /api/mensajes/:id` - Editar propio
- `DELETE /api/mensajes/:id` - Solo admin

---

## 🧪 Testing con Postman

### 1. Crear variables de colección
Estructura de la colección:
```
- variable: token (string)
- variable: base_url (default: http://localhost:3006)
```

### 2. Script de post-login (automático)
Después de hacer login, la variable `token` se actualiza automáticamente:

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.collectionVariables.set('token', response.token);
}
```

### 3. Usar el token en otros requests
En el header `Authorization`, usar: `{{token}}`

---

## 🔍 Validaciones Implementadas

### Usuarios
```
✓ Email: debe ser válido (user@example.com)
✓ Contraseña: mínimo 6 caracteres
✓ Nombre usuario: mínimo 3 caracteres
✓ Teléfono: formato móvil válido (opcional)
✓ Ciudad: string (opcional)
```

### Mascotas
```
✓ Nombre: mínimo 2 caracteres
✓ Raza: requerido
✓ Edad: requerido
✓ Tamaño: debe ser Pequeño/Mediano/Grande
```

### Solicitudes
```
✓ ID usuario y mascota: enteros válidos
✓ Ocupación: requerida
✓ Edad: número positivo
✓ Motivo adopción: mínimo 10 caracteres
```

### Citas
```
✓ ID usuario y mascota: enteros válidos
✓ Fecha: formato ISO8601 (YYYY-MM-DD)
✓ Hora: formato HH:MM
```

### Mensajes
```
✓ ID remitente/destinatario: enteros válidos
✓ Contenido: 1-5000 caracteres
```

---

## ⚠️ Errores Comunes

### Error 401 - Unauthorized
```json
{"error": "Acceso denegado. No se proporcionó un token."}
```
**Solución:** Incluir header `Authorization: <token>`

### Error 401 - Token expirado
```json
{"error": "Token expirado"}
```
**Solución:** Hacer login nuevamente

### Error 401 - Token inválido
```json
{"error": "Token inválido."}
```
**Solución:** Usar el token correcto

### Error 403 - Forbidden
```json
{"error": "No tienes permiso para acceder a este recurso"}
```
**Solución:** Solo admin puede hacer esta acción

### Error 400 - Bad Request
```json
{
  "error": "Datos inválidos",
  "details": [
    {"field": "email", "message": "Email inválido"}
  ]
}
```
**Solución:** Revisar los datos enviados

### Error 429 - Too Many Requests
```json
{"error": "Demasiadas solicitudes desde esta IP..."}
```
**Solución:** Esperar 15 minutos o cambiar IP

---

## 📊 Status Codes HTTP

| Code | Significado | Ejemplo |
|------|-------------|---------|
| 200 | OK | GET exitoso |
| 201 | Created | Usuario registrado |
| 400 | Bad Request | Datos inválidos |
| 401 | Unauthorized | Token faltante/inválido |
| 403 | Forbidden | No tienes permisos |
| 404 | Not Found | Recurso no existe |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Server Error | Error del servidor |

---

## 🔒 Tips de Seguridad

1. **Nunca** compartas tu JWT_SECRET
2. **Nunca** guardes tokens en localStorage (usa httpOnly cookies)
3. **Usa HTTPS** en producción (no HTTP)
4. **Cambia JWT_SECRET** regularmente en producción
5. **Limpia logs** periódicamente
6. **Valida inputs** siempre en el servidor
7. **Usa HTTPS** para todas las requests
8. **Implementa 2FA** para admin

---

## 🛠️ Scripts Disponibles

```bash
# Iniciar servidor en producción
npm start

# Iniciar en modo desarrollo (auto-reload con nodemon)
npm run dev

# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch

# Chequear auditoría de vulnerabilidades
npm audit

# Reparar vulnerabilidades automáticamente
npm audit fix
```

---

## 📈 Próximas Mejoras

- [ ] Refresh tokens (extender sesión sin re-login)
- [ ] 2FA (Two-Factor Authentication)
- [ ] Email de confirmación al registrar
- [ ] Reset de contraseña por email
- [ ] Logs persistentes en BD
- [ ] Dashboard de admin
- [ ] Soft delete (no eliminar, marcar como inactivo)

---

**Última actualización:** Marzo 27, 2026
**Versión:** 2.0 - Con Seguridad Completa ✅
