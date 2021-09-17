// modulo para definir las rutas de acceso de la aplicacion
// volvemos a requerir a Express, pero ahora a usar su metodo Router
const express = require('express');
const router = express.Router();

// Al metodo le asignamos un proceso asincrono, partiendo de la raiz y llamando al Index.js
router.get('/', async (req, res) => {
    res.render('index');
});

module.exports = router; // exportamos la salida de este modulo al index.js principal