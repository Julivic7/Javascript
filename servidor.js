// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Materia = require('./models/materias');
const sequelize = require('./db'); // Asegúrate de que la ruta sea correcta
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

// Crear una nueva materia
app.post('/agregar-registro', async (req, res) => {
    const { nombre, cantidadAlumnos } = req.body;

    // Validación de datos
    if (!nombre || !cantidadAlumnos) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        const nuevaMateria = await Materia.create({ nombre, cantidadAlumnos });
        res.status(201).json(nuevaMateria);
    } catch (error) {
        console.error('Error al crear la materia:', error);
        res.status(500).json({ error: 'Error al crear la materia' });
    }
});

// Actualizar una materia por ID
app.put('/actualizar-registro/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, cantidadAlumnos } = req.body;

    try {
        const materia = await Materia.findByPk(id);
        if (!materia) {
            return res.status(404).json({ error: 'Materia no encontrada' });
        }

        materia.nombre = nombre || materia.nombre;
        materia.cantidadAlumnos = cantidadAlumnos || materia.cantidadAlumnos;

        await materia.save();
        res.json(materia);
    } catch (error) {
        console.error('Error al actualizar la materia:', error);
        res.status(500).json({ error: 'Error al actualizar la materia' });
    }
});

// Eliminar una materia por ID
app.delete('/eliminar-registro/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const materia = await Materia.findByPk(id);
        if (!materia) {
            return res.status(404).json({ error: 'Materia no encontrada' });
        }

        await materia.destroy();
        res.json({ message: `Materia con id ${id} eliminada` });
    } catch (error) {
        console.error('Error al eliminar la materia:', error);
        res.status(500).json({ error: 'Error al eliminar la materia' });
    }
});

// Eliminar todas las materias
app.delete('/eliminar-registros', async (req, res) => {
    try {
        await Materia.destroy({ where: {}, truncate: true });
        res.json({ message: 'Todas las materias han sido eliminadas' });
    } catch (error) {
        console.error('Error al eliminar todas las materias:', error);
        res.status(500).json({ error: 'Error al eliminar todas las materias' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
