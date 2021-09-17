// EXPORTA ESTE modulo una propiedad u objeto isLoggedIn que contiene si esta logueado o no
// el usuario con sus datos, esto se verifica por cada ruta que se desea acceder y req se le 
// agregan nuevos metodos al invocar a passport en el index.js, uno de ellos es req.isAuthenticated()
// que devuelve un boolean para indicar si la sesion esta autenticada o no en cada ruta accesada
module.exports = {
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next(); // continua con tus codigo porque esta logueado
        }
        return res.redirect('/signin'); // redirecciona a Signin.hbs para Ingresar sino esta logueado
    }
};