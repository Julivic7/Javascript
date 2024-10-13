// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Materia = require('./models/materia');
const sequelize = require('./database'); // Asegúrate de que la ruta sea correcta
const path = require('path');

const app = express();
const PORT = 5500;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Asegúrate de que 'public' contenga tu index.html y otros archivos estáticos

// Sincronizar la base de datos
sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada.');
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });

// Rutas

// Servir la página HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Obtener todas las materias
app.get('/ver-registros', async (req, res) => {
    try {
        const materias = await Materia.findAll();
        res.json(materias);
    } catch (error) {
        console.error('Error al obtener materias:', error);
        res.status(500).json({ error: 'Error al obtener materias' });
    }
});

// Obtener una materia por ID
app.get('/ver-registros/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const materia = await Materia.findByPk(id);
        if (materia) {
            res.json(materia);
        } else {
            res.status(404).json({ error: 'Materia no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener la materia:', error);
        res.status(500).json({ error: 'Error al obtener la materia' });
    }
});

    // Manejar el registro de materias (POST)
    else if (req.method === 'POST' && parsedUrl.pathname === '/agregar-registro') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);

                // Validación de datos
                if (!parsedBody.nombre || !parsedBody.cantidadAlumnos) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Faltan datos' }));
                    return;
                }

                // Crear una nueva entrada de materia con un ID único
                const nuevaMateria = {
                    id: materias.length + 1, // Generar ID automáticamente
                    nombre: parsedBody.nombre,
                    cantidadAlumnos: parsedBody.cantidadAlumnos
                };

                // Agregar la materia a la lista
                materias.push(nuevaMateria);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(nuevaMateria));

            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Datos inválidos' }));
            }
        });

    // Eliminar todas las materias (DELETE)
    } else if (req.method === 'DELETE' && parsedUrl.pathname === '/eliminar-registros') {
        materias = []; // Vaciar la lista de materias
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Todas las materias han sido eliminadas' }));

    // Eliminar una materia en particular (DELETE/id)
    } else if (req.method === 'DELETE' && parsedUrl.pathname.startsWith('/eliminar-registro/') && id) {
        const materiaIndex = materias.findIndex(m => m.id === parseInt(id));
        if (materiaIndex !== -1) {
            materias.splice(materiaIndex, 1); // Eliminar la materia de la lista
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `Materia con id ${id} eliminada` }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Materia no encontrada' }));
        }

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const port = 5500;
server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
