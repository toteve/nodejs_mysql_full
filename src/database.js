// modulo para habilitar la conexion a la BD MySql 

// invoca la dependencia mysql
const mysql = require('mysql');

// modulo que permite procesos async funcionen con promesas
const { promisify }= require('util');

// REQUIERE A el JS keys DEL directorio principal, se trae de ese JS la propiedad {database}
const { database } = require('./keys');

// creando el pool de conexion a la BD, varios hilos en secuencia de conexion
const pool = mysql.createPool(database);


// para evaluar que ocurre al conectar con la BD db_links=database, en casos de 3 
// errores predefnidos en MySql, son 2 parametros err y connection, evaluamos si 
// recibimos err, evito tener que usar getconnection cada vez que lo necesite de diversos sitios
// sino que llamo a este modulo database.js del directorio SRC
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection FUE CERRADA.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database tiene muchas conexiones');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection fue rechazada');
    }
  }

  // que pasa si recibimos connection, quiere decir que todo bien 
  if (connection) connection.release();
  console.log('DB esta Conectada');

  return;
});

// Promisify Pool Querys aplicando el modulo de promesas que fue requerido
pool.query = promisify(pool.query);

module.exports = pool; // exportamos el resultado del pool 
