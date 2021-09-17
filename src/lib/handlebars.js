// Para exportar e´la propieda para usar Timeago par transformar Timestamp

// const timeago = require('timeago.js'); // ya no soporta esta forma
const { format } = require('timeago.js'); // usando EcmaScript 6
// const timeagoInstance = timeago();

// const timeagoInstance = timeago();

const helpers = {};

// construccion del metodo timeago del objeto helpers para convertir el timestamp a ago days 
helpers.timeago = (savedTimestamp) => {
    return format(savedTimestamp);
};

module.exports = helpers; // exportando el objeto helpers