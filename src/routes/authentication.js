// invoca el Express y luego el metodo Router, se crearan otros formularios a ejecutarse
// en otras rutas para la auntenticacion, se hara uso de SRC/VIEWS/AUTH para otros archivos .hbs
// entre ellos signin.hbs, signup.hbs, index.hbs y profile.hbs
const express = require('express');
const router = express.Router();

// invoca a passpport y toma de auth.js que esta en /SRC/LIB su propiedad isLoggedIn
// passport y passport-local trabajan junto con express-sesion y express-validator
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

// ruta SIGNUP proceso de servidor que permitira buscar en auth/signup, el formulario
// signup.hbs , aqui se renderiza la vista de signup.hbs con metodo GET para escribir los datos
router.get('/signup', (req, res) => {
  console.log("Datos del Signup para leer EN BLANCO: ", req.body);

  res.render('auth/signup'); // renderiza a la ruta indicada con el signup.hbs
});

// ruta SIGNUP proceso de servidor para RECIBIR datos del formulario que esta en auth/signup, el formulario
// signup.hbs , aqui se usa signup.hbs con metodo POST, para recibir los datos, y a la vez hace uso
// de la autenticacion creada llamada 'local.signup'
router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true // hABILITA el uso de flash desde Passport
})); // indica a donde redireccionar si esta bien a profile.hbs sino a signup.hbs


// ruta SIGNIN proceso de servidor que permitira buscar en auth/signIN, el formulario
// signin.hbs , aqui se renderiza la vista de signin.hbs con metodo GET
router.get('/signin', (req, res) => {
  
  console.log("Datos del Signin para leer EN BLANCO: ", req.body);
  
  res.render('auth/signin'); // renderiza a la ruta indicada con el signin.hbs
});

// ruta SIGNin proceso de servidor para RECIBIR datos del formulario que esta en auth/signip, el formulario
// signin.hbs , aqui se usa signin.hbs con metodo POST, codigo validator-express
// router.post('/signin', (req, res, next) => {
//  console.log("Datos del Signin para buscar: ", req.body);

//  req.check('username', 'Username is Required').notEmpty();
//  req.check('password', 'Password is Required').notEmpty();

//  const errors = req.validationErrors();
//  if (errors.length > 0) {
//    req.flash('message', errors[0].msg);
//    res.redirect('/signin');
//  }

  // ruta SIGNIN proceso de servidor para RECIBIR datos del formulario que esta en auth/signIN, el formulario
  // signIN.hbs , aqui se usa signIN.hbs para recibir los datos, y a la vez hace uso
  // de la autenticacion creada llamada 'local.signIN'
//  passport.authenticate('local.signin', {
//    successRedirect: '/profile',
//    failureRedirect: '/signin',
//    failureFlash: true
//  })(req, res, next); // indica a donde redireccionar si esta bien a profile.hbs sino a signin.hbs
// });

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true // hABILITA el uso de flash desde Passport
})); // indica a donde redireccionar si esta bien a profile.hbs sino a signin.hbs



// LOGOUT  proceso de servidor para Salir de Session, ejecuta el metodo logOut y redirect de passport
router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

// LOGOUT  proceso de servidor para ver el perfil
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

module.exports = router;
