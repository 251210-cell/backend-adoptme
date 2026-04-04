CREATE DATABASE ADOPTME;
USE adoptme;

-- Tabla usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  contrasena VARCHAR(255),
  rol VARCHAR(50) DEFAULT 'usuario',
  nombre_usuario VARCHAR(100),
  foto_perfil VARCHAR(255),
  telefono VARCHAR(20),
  direccion VARCHAR(255),
  ciudad VARCHAR(100),
  biografia TEXT,
  tipo_vivienda VARCHAR(100),
  tiene_patio BOOLEAN DEFAULT FALSE,
  tiene_otras_mascotas BOOLEAN DEFAULT FALSE,
  experiencia_mascotas VARCHAR(255)
);

-- Tabla mascotas
CREATE TABLE mascotas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  raza VARCHAR(100),
  edad VARCHAR(50), -- corregido (string -> VARCHAR)
  refugio VARCHAR(100),
  tamano VARCHAR(50),
  estado_salud VARCHAR(100),
  condicion_especial VARCHAR(255),
  descripcion TEXT,
  imagen VARCHAR(255),
  estado VARCHAR(50) DEFAULT 'DISPONIBLE',
  fecha_publicacion DATE
);

-- Tabla solicitudes
CREATE TABLE solicitudes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  id_mascota INT,
  ocupacion VARCHAR(100),
  edad_usuario INT,
  motivo_adopcion TEXT,
  tiene_mascotas_actuales VARCHAR(100),
  permiso_casero VARCHAR(50),
  espacio_suficiente VARCHAR(50),
  estado VARCHAR(50) DEFAULT 'PENDIENTE',
  fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
  FOREIGN KEY (id_mascota) REFERENCES mascotas(id)
);

-- Tabla citas
CREATE TABLE citas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  id_mascota INT,
  fecha_visita DATE,
  hora_visita TIME,
  notas_adicionales TEXT,
  estado VARCHAR(50) DEFAULT 'PROGRAMADA',
  
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
  FOREIGN KEY (id_mascota) REFERENCES mascotas(id)
);

-- Tabla mensajes
CREATE TABLE mensajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_remitente INT,
  id_destinatario INT,
  id_mascota INT,
  contenido TEXT,
  leido BOOLEAN DEFAULT FALSE,
  fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (id_remitente) REFERENCES usuarios(id),
  FOREIGN KEY (id_destinatario) REFERENCES usuarios(id),
  FOREIGN KEY (id_mascota) REFERENCES mascotas(id)
);