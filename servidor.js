// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Materia = require('./models/materias');
const sequelize = require('./db');
const path = require('path');

const app = express();
const PORT = 5500;


app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada.');
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });



//Servir la página HTML principal
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

