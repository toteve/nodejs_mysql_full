// Aqui se define en conjunto la bateria de modulos que se van a requerir para la autenticacion
// passport, passport-local asi como acceso a 

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // para autenticacion local desde BD
                                                          // PASSPORT permite desde RRSS autenticacion

const pool = require('../database'); // llamada al pool en database.js desde /src
const helpers = require('./helpers'); // llamada a helpers.js desde /src/lib

// checar esta construccion desde la documentacion de uso de passport y passport-local
// la parte correspondiente al proceso de Ingresar (Signin)
passport.use('local.signin', new LocalStrategy({
  // estos 2 primeros campos son como estan definidos en el formulario signin.hbs
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true  // que permita recibir un Req y Callback  mas un objeto
}, async (req, username, password, done) => { // inicio del Callback y usa un callback llamado DONE
  
  console.log("Req. body en Local.Signin: ", req.body);
  console.log("Username :", username);
  console.log("Password :", password);

  if ( username.length === 0 ) { req.flash('message', 'Usernames is required, not blank') }

  if ( password.length === 0 ) { req.flash('message', 'Password is required, not blank') }

  // consulta de este usuario a la Tabla Users con proceso asincrono
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

  // if para ver que hacer si existe > 0 y en caso contrario
  if (rows.length > 0) {
    const user = rows[0]; // user tomalos campos de la tabla del arreglo rows[0] un json con campos
    
    // proceso asincrono para realizar validacion del password
    const validPassword = await helpers.matchPassword(password, user.password)
    
    // otro if para determinar que hacer si Password es valido o en caso contrario, EN AMBOS CASOS HACE 
    // USO de un callback interno llamado DONE
    if (validPassword) {
      done(null, user, req.flash('success', 'Welcome ' + user.username)); // Coincide y flash es success
    } else {
      done(null, false, req.flash('message', 'Incorrect Password')); // No coincide y flash es message
    }
  } else {

    return done(null, false, req.flash('message', 'The Username does not exists.')); // No exite este user

  }

}));

// checar esta construccion desde la documentacion de uso de passport y passport-local
// la parte correspondiente al proceso de Registrar (Signup)
passport.use('local.signup', new LocalStrategy({
  // estos 2 primeros campos son como estan definidos en el formulario signup.hbs
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true 
}, async (req, username, password, done) => {

  
  const { fullname } = req.body; // toma el fullname del req.body
  console.log("Datos del Signup para grabar antes de BD: ",fullname, username, password);

  let newUser = {
    fullname,
    username,
    password
  }; // objeto que contiene los 3 campos del formulario

  // proceso asincrono para encriptar los datos de password antes de grabar en la BD
  newUser.password = await helpers.encryptPassword(password);
  
  // Saving in the Database CON OTRO PROCESO ASINCRONO
  const result = await pool.query('INSERT INTO users SET ? ', newUser);

  newUser.id = result.insertId; // AGREGANDO CAMPO ID en el objeto newUser, TOMANDO DE UNA PROPIEDAD
                                // de result 

  return done(null, newUser);

}));


passport.serializeUser((user, done) => {
  done(null, user.id); // para guardar el usuario en la sesion al registrarlo, guardar el Id
});


passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]); // para buscar el usuario en la sesion con su ID
});

