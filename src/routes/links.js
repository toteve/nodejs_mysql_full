// invoca el Express y luego el metodo Router
const express = require('express');
const router = express.Router();

// Invoca  subir 2 niveles y ejecutar database.js de SRC para conexion a BD 
const pool = require('../database');

// Proceso que hacer con los links de cada usuario IsLoggedIn toma la propiedad generada desde
// el auth.js que esta en la carpeta LIB
const { isLoggedIn } = require('../lib/auth');

// Que hacer al recibir una peticion Get en links/add (esta ruta links creada en Index.js de SRC)
router.get('/add', (req, res) => {
    res.render('links/add');  // llamada a la plantilla add.hbs, renderizando
});

// Que hacer al recibir una peticion Post en links/add (esta ruta links creada en Index.js de SRC)
router.post('/add', async (req, res) => {
    const { title, url, description } = req.body; // req.body recibe los campos del formulario add.hbs
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id // toma el id del usuario y lo graba en registro de tabla links
                            // es la clave foranea
                            
    }; // construye datos del enlace agregando el user.id como clave foranea

    await pool.query('INSERT INTO links set ?', [newLink]); //proceso asincrono agrega async en funcion 
                                                            // y el prefijo await, se puede usar callback
                                                            // o promesas con el .then, con este proceso
                                                            // indicamos que lo de comillas se completa
                                                            // con el objeto newLink (campos de tabla)

    req.flash('success', 'Link Saved Successfully'); // con req invocar modulo Flash de connect-flash
                                                     // Parametros tipo msg y texto mensaje

    res.redirect('/links'); //al terminar de añadir, redirecciona a la ruta /links
});


// Get para ver links de usuario almacenados en la ruta /links, recuerde el prefijo links se añade a 
// todas las consultas
router.get('/', isLoggedIn, async (req, res) => {
    // se establece un proceso asincrono y se construye un Select condicionado para el user.id
    // que se loguee, luego la salida se habilita en la ruta /links/list
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list', { links }); // llamado a list.hbs en ruta links/list, renderizando
});

// Get para borrar enlaces de un usuario
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params; // obtener de los parametros de req solo el id
    await pool.query('DELETE FROM links WHERE ID = ?', [id]); // asincrono para eliminar sitio con ese Id
    req.flash('success', 'Link Removed Successfully'); // con req invocar modulo Flash de connect-flash
                                                       // Parametros tipo msg y texto mensaje

    res.redirect('/links'); //al terminar de eliminar, redirecciona a la ruta /links
});

// Get para mostrar enlaces de un usuario y editarlos
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params; // obtenermos el ID desde req.params
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]); // consulta asincrona de ese ID
    console.log(links); // MOSTRAR ENLACE
    res.render('links/edit', {link: links[0]}); // RENDERIZAR en ruta links/edit, concatenando con el parametro
                                                // {link: links[0]} que son los datos a editar que es un objeto
                                                // con los campos de la Bd del registro accesado
});

// Post para actualizar enlaces de un usuario una vez ya editados
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body; 
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]); // asincrono de actualizacion con 
                                                                        // la observacion que al haber 2 ?
                                                                        // indica 2 parametros a sustituir
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/links'); //al terminar de actualizar, redirecciona a la ruta /links
});

module.exports = router; // exportar resultado del Modulo
