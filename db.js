// database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('js.jasarevicsotomayor', 'root', '1234', {

    host: 'localhost',
    dialect: 'mysql'
});

// Probar la conexión
sequelize.authenticate()
    .then(() => {
        console.log('Conexión exitosa a la base de datos MySQL.');
    })
    .catch(err => {
        console.error('No se pudo conectar:', err);
    });

module.exports = sequelize;
