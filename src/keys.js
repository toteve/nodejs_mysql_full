// EXPORTA ESTE modulo una propiedad u objeto database que contiene el nombre de la base de datos db_links
// aparte otros datos como limite de conexiones, host, user y password
module.exports = {

    database: {
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'db_links'
    }

};