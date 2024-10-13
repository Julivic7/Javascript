// Importar el módulo 'mysql2'
const mysql = require('mysql2');
// Crear la conexión a la base de datos
const connection = mysql.createConnection({
host: 'localhost',
database: 'JS.JasarevicSotomayor',
user: 'root',
password: '1234',

});

// Conectar a la base de datos
connection.connect((err) => {
if (err) {
console.error('Error conectando a la base de datos:', err);
return;
}
console.log('Conexión exitosa a MySQL');
});
// Cerrar la conexión
connection.end();