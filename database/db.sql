-- este es un script que puede ejecutarse en la linea de comandos de MySql

-- Crear la BD principal del proyecto
CREATE DATABASE db_links;

-- usamos o activamos la BD creada
USE db_links;

-- TABLE USERS instrucciones para crear la Tabla Users
-- 4 campos id, username, password y fullname, entero el primero y string los demas
-- all pasword wil be encrypted using SHA1 (antes de almacenar)
CREATE TABLE users (
  id INT(11) NOT NULL,
  username VARCHAR(16) NOT NULL,
  password VARCHAR(60) NOT NULL,
  fullname VARCHAR(100) NOT NULL
);


-- alteramos Users para definir campo id como Primary Key
ALTER TABLE users
  ADD PRIMARY KEY (id);

-- alteramos Users para definir campo id como auto_increment y de 2 en 2 iniciando en 0
ALTER TABLE users
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

-- ver estructura de tabla Users
DESCRIBE users;

-- insertar un registro en Tabla Users
INSERT INTO users (id, username, password, fullname) 
  VALUES (0, 'toteve', 'toteve1234', 'Frank Totesaut');

-- Mostrar contenido de toda la tabla Users
SELECT * FROM users;

-- LINKS TABLE instrucciones para crear la Tabla Links
-- 6 campos id, title, url, description, user_id, created_at (este ultimo tipo fecha)
-- definir user_id como clave foranea y relacional con campo id de tabla users
CREATE TABLE links (
  id INT(11) NOT NULL,
  title VARCHAR(150) NOT NULL,
  url VARCHAR(255) NOT NULL,
  description TEXT,
  user_id INT(11),
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);

-- definir Id como clave primaria
ALTER TABLE links
  ADD PRIMARY KEY (id);

-- definir Id como auto_incremental de 2 en 2 nicia en 0
ALTER TABLE links
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

-- MOSTRAR estructura TABLA Links
DESCRIBE links;