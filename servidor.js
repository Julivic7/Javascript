const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

let materias = []; // Lista para almacenar las materias

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const parsedUrl = url.parse(req.url, true);
    const id = parsedUrl.pathname.split('/')[2]; // Extrae el ID de la URL si está presente

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Servir la página HTML principal
    if (req.method === 'GET' && parsedUrl.pathname === '/') {
        const filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al cargar la página');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });

    // Obtener el listado de todas las materias
    } else if (req.method === 'GET' && parsedUrl.pathname === '/ver-registros') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(materias));

    // Obtener información de una materia en particular (GET/id)
    } else if (req.method === 'GET' && parsedUrl.pathname.startsWith('/ver-registros/') && id) {
        const materia = materias.find(m => m.id === parseInt(id));
        if (materia) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(materia));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Materia no encontrada' }));
        }

    // Manejar el registro de materias (POST)
    } else if (req.method === 'POST' && parsedUrl.pathname === '/agregar-registro') {
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
