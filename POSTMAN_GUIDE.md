# Guía de Prueba con Postman - AdoptMeBack

## Configuración Inicial

**URL Base**: `http://localhost:3006/api`

### Headers por defecto (para todas las requests):
```json
{
  "Content-Type": "application/json"
}
```

---

## Endpoints de Usuarios

### 1. Obtener todos los usuarios
- **Método**: GET
- **URL**: `http://localhost:3006/api/usuarios`
- **Body**: (ninguno)

**Respuesta esperada**: Array de usuarios

---

### 2. Obtener usuario por ID
- **Método**: GET
- **URL**: `http://localhost:3006/api/usuarios/1`
- **Body**: (ninguno)

**Respuesta esperada**: Objeto de un usuario

---

### 3. Crear nuevo usuario ⭐
- **Método**: POST
- **URL**: `http://localhost:3006/api/usuarios`
- **Headers**: `Content-Type: application/json`
- **Body** (JSON):
```json
{
  "email": "juan@example.com",
  "contrasena": "123456",
  "nombre_usuario": "juanperez",
  "telefono": "1234567890",
  "ciudad": "Madrid",
  "tipo_vivienda": "Apartamento",
  "tiene_patio": false
}
```

**Verificación DB**: Verifica en MySQL que se guardó:
```sql
SELECT * FROM usuarios WHERE email = 'juan@example.com';
```

---

### 4. Actualizar usuario
- **Método**: PUT
- **URL**: `http://localhost:3006/api/usuarios/1`
- **Body** (JSON):
```json
{
  "email": "nuevo@example.com",
  "ciudad": "Barcelona"
}
```

---

### 5. Eliminar usuario
- **Método**: DELETE
- **URL**: `http://localhost:3006/api/usuarios/1`
- **Body**: (ninguno)

---

## Endpoints de Mascotas

### 1. Crear mascota ⭐
- **Método**: POST
- **URL**: `http://localhost:3006/api/mascotas`
- **Body** (JSON):
```json
{
  "nombre": "Máx",
  "raza": "Labrador",
  "edad": "2 años",
  "tamano": "Grande",
  "estado_salud": "Excelente",
  "descripcion": "Perro muy amigable y energético",
  "refugio": "Refugio Central",
  "condicion_especial": "Ninguna"
}
```

**Nota**: La `fecha_publicacion` se asigna automáticamente al crear la mascota.

### 2. Obtener todas las mascotas
- **Método**: GET
- **URL**: `http://localhost:3006/api/mascotas`

### 3. Obtener mascota por ID
- **Método**: GET
- **URL**: `http://localhost:3006/api/mascotas/1`

### 4. Actualizar mascota
- **Método**: PUT
- **URL**: `http://localhost:3006/api/mascotas/1`
- **Body** (JSON):
```json
{
  "estado": "ADOPTADA"
}
```

### 5. Eliminar mascota
- **Método**: DELETE
- **URL**: `http://localhost:3006/api/mascotas/1`

---

## Endpoints de Solicitudes

### 1. Crear solicitud de adopción ⭐
- **Método**: POST
- **URL**: `http://localhost:3006/api/solicitudes`
- **Body** (JSON):
```json
{
  "id_usuario": 1,
  "id_mascota": 1,
  "ocupacion": "Ingeniero",
  "edad_usuario": 35,
  "motivo_adopcion": "Quiero un compañero en casa",
  "tiene_mascotas_actuales": "No",
  "permiso_casero": "Si",
  "espacio_suficiente": "Si"
}
```

### 2. Obtener todas las solicitudes
- **Método**: GET
- **URL**: `http://localhost:3006/api/solicitudes`

### 3. Obtener solicitud por ID
- **Método**: GET
- **URL**: `http://localhost:3006/api/solicitudes/1`

### 4. Actualizar solicitud
- **Método**: PUT
- **URL**: `http://localhost:3006/api/solicitudes/1`
- **Body** (JSON):
```json
{
  "estado": "APROBADA"
}
```

### 5. Eliminar solicitud
- **Método**: DELETE
- **URL**: `http://localhost:3006/api/solicitudes/1`

---

## Endpoints de Citas

### 1. Crear cita ⭐
- **Método**: POST
- **URL**: `http://localhost:3006/api/citas`
- **Body** (JSON):
```json
{
  "id_usuario": 1,
  "id_mascota": 1,
  "fecha_visita": "2026-04-15",
  "hora_visita": "14:30:00",
  "notas_adicionales": "Visitante interesado en adopción"
}
```

### 2. Obtener todas las citas
- **Método**: GET
- **URL**: `http://localhost:3006/api/citas`

### 3. Obtener cita por ID
- **Método**: GET
- **URL**: `http://localhost:3006/api/citas/1`

### 4. Actualizar cita
- **Método**: PUT
- **URL**: `http://localhost:3006/api/citas/1`
- **Body** (JSON):
```json
{
  "estado": "COMPLETADA"
}
```

### 5. Eliminar cita
- **Método**: DELETE
- **URL**: `http://localhost:3006/api/citas/1`

---

## Endpoints de Mensajes

### 1. Crear mensaje 
- **Método**: POST
- **URL**: `http://localhost:3006/api/mensajes`
- **Body** (JSON):
```json
{
  "id_remitente": 1,
  "id_destinatario": 2,
  "id_mascota": 1,
  "contenido": "Hola, estoy interesado en adoptar a esta mascota"
}
```

### 2. Obtener todos los mensajes
- **Método**: GET
- **URL**: `http://localhost:3006/api/mensajes`

### 3. Obtener mensaje por ID
- **Método**: GET
- **URL**: `http://localhost:3006/api/mensajes/1`

### 4. Actualizar mensaje
- **Método**: PUT
- **URL**: `http://localhost:3006/api/mensajes/1`
- **Body** (JSON):
```json
{
  "leido": true
}
```

### 5. Eliminar mensaje
- **Método**: DELETE
- **URL**: `http://localhost:3006/api/mensajes/1`

---

## Cómo Verificar en la Base de Datos

Después de crear datos en Postman, puedes verificarlos en MySQL:

```bash
# Conectarse a MySQL
C:\xampp\mysql\bin\mysql.exe -u root

# Usar la base de datos
USE adoptme;

# Ver datos de usuarios
SELECT * FROM usuarios;

# Ver datos de mascotas
SELECT * FROM mascotas;

# Ver datos de solicitudes
SELECT * FROM solicitudes;

# Ver datos de citas
SELECT * FROM citas;

# Ver datos de mensajes
SELECT * FROM mensajes;
```

---

## Flujo Completo de Prueba (Recomendado)

1. **Crea un usuario**:
   - POST `/api/usuarios` con datos del usuario

2. **Crea una mascota**:
   - POST `/api/mascotas` con datos de la mascota

3. **Obtén los IDs** (desde las respuestas anteriores):
   - `id_usuario` (ej: 1)
   - `id_mascota` (ej: 1)

4. **Crea una solicitud de adopción**:
   - POST `/api/solicitudes` usando los IDs obtenidos

5. **Crea una cita**:
   - POST `/api/citas` usando los IDs obtenidos

6. **Crea un mensaje**:
   - POST `/api/mensajes` entre dos usuarios

7. **Verifica en MySQL**:
   - Abre consola MySQL y ejecuta `SELECT * FROM [tabla];`

---

## Pasos para Descargar Postman

1. Ve a [www.postman.com/downloads/](https://www.postman.com/downloads/)
2. Descarga Postman para Windows
3. Instala y abre
4. Crea una nueva colección llamada "AdoptMeBack"
5. Crea requests usando la guía anterior
6. Exporta como JSON para reutilizar