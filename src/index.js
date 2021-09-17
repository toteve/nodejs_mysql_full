// Inicializacion de constantes en base a los modulos previamente instalados con Npm
// y que son dependencias de nuestro proyecto
const express = require('express'); // aqui enlaza a framework de Express
const morgan = require('morgan'); // aqui a morgan para mostrar cada solicitud http
const path = require('path'); // este es para mostrar rutas o caminos accesados (directorios)
const exphbs = require('express-handlebars'); // control de plantillas
const session = require('express-session'); // almacenar sesion de Express en Servidor, al menos Flash de 
                                            // connect-flash lo necesita
// const validator = require('express-validator'); // validar datos enviados desde FE, al parecer no soporta asi
const { body, validationResult } = require('express-validator');
const validator = {
  body,
  validationResult  
};


const passport = require('passport'); // requiere el modulo para autenticacion de datos de usuario
const flash = require('connect-flash'); // mensajes entre vistas enlace a connect-flash
const MySQLStore = require('express-mysql-session')(session); // permite guardar sesion de MySql en BD
                                                              // aparte de Mysql lo requiere Flash
const bodyParser = require('body-parser');


const { database } = require('./keys'); // indica el objeto database que esta contenido en KEYS.JS de SRC

// Iniciando el Express Framework que fue requerido
const app = express();
require('./lib/passport'); // invocando archivo passport.js de autenticacion de usuario
                           // en la ruta /src/lib

// Configuraciones del servidor, rutas de las vistas y plantillas hbs usadas en proyecto
app.set('port', process.env.PORT || 4000); // indica use un puerto si esta asignado, sino default 4000

app.set('views', path.join(__dirname, 'views')); // Indicar la ruta de Views o sea src/views/*.*

// aqui define lo siguiente la aplicacion app usara plantilas hbs en la variable definida exphbs que 
// requiere al express-handlebars, a partir de ahi en la carpeta Views en Layouts se define la plantilla
// por defecto main.hbs, y las plantillas parciales
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'), // directorio Views/layouts
  partialsDir: path.join(app.get('views'), 'partials'), // directorio Views/partials
  extname: '.hbs', // extension de los archivos que requiero de esas carpeta
  helpers: require('./lib/handlebars') // llama a handlebars.js dentro de carpeta LIB para usar
                                       // timeago con cambio a ES6

})) 

app.set('view engine', '.hbs'); // Activar el motor configurado con app.engine

// Middlewares, ejecuciones de solicitudes del cliente o FronEnd
app.use(morgan('dev')); // usar Morgan para mostrar por pantalla lo que ocurre
app.use(bodyParser.urlencoded({extended: false})); // aceptar strings desde el cliente
app.use(bodyParser.json()); // aceptar json desde el cliente

// Manejo de Sesiones de Express y MySql
app.use(session({  // session requiere express-session 
  secret: 'faztmysqlnodemysql', // puede ser cualquier texto
  resave: false,  // evita se este reinicializando las sesiones
  saveUninitialized: false, // complementa lo anterior
  store: new MySQLStore(database) // define almacenar la session en la BD,  requiere express-session-mysql
}));

app.use(flash()); // funcion middleware para hacer uso de connect-flash
app.use(passport.initialize()); // Inicializacion de passport que fue requerido
app.use(passport.session()); // Inicializacion de session de passport que fue requerido
// app.use(validator.validationResult); // asi invoco correctamente a la funcion de express-validator



// Global variables que pueden accederse desde cualquier vista message, success y user
app.use((req, res, next) => {
  app.locals.message = req.flash('message'); // Relacionado con el tipo MESSAGE de cada Flash invocado
  app.locals.success = req.flash('success'); // Relacionado con el tipo SUCCESS de cada Flash invocado
  app.locals.user = req.user; // Para uso del campo user como variable global a ser registrada en modulo
                              // passport.js con passport.serializeUser((user, done))
  next();
});

// Routes del servidor que seran utilizadas  (o sea los archivos JS)
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));

// Public ACCESO A DIRECTORIO PUBLICO DONDE ESTARAN CSS E IMG
app.use(express.static(path.join(__dirname, 'public')));

// Starting EL server EN EL PUERTO QUE SE TOMA SEGUN APP.GET(´PORT´)
app.listen(app.get('port'), () => {
  console.log('Servidor escucha en Puerto: ', app.get('port'));
});
