// modulo para Encriptacion del Password antes de Grabar en BD

const bcrypt = require('bcryptjs'); // importamos la biblioteca bcryptjs para usarla

const helpers = {}; // definimos un objeto que luego rellenaremos

// funcion customizada para encriptar el password recibido y retornarlo en hash
helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;  // usa procesos asincronos
};

// funcion customizada para revisar si el password recibido coincide y retornar savedPassword
helpers.matchPassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword); // proceso asincrono
  } catch (e) {
    // console.log(e)  // pareja try/catch para manejar errores
    // Mostrar errores usando Flash
    req.flash('message', 'Password o clave Incorrecta');
  }
};

module.exports = helpers; // Exportando objeto construido con sus metodos
