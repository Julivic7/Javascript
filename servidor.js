const http = require('http');
const url = require('url');

let materias = []; // Lista para almacenar las materias

const server = http.createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');  
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');  
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  

    const parsedUrl = url.parse(req.url, true);

  
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

  
    if (req.method === 'GET' && parsedUrl.pathname === '/ver-registros') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(materias)); // Devuelve todos los registros en formato JSON


    } else if (req.method === 'POST' && parsedUrl.pathname === '/agregar-registro') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString(); 
        });

        req.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);
              
                if (!parsedBody.nombre || !parsedBody.cantidadAlumnos) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Faltan datos' }));
                    return;
                }

                // Crear una nueva entrada de materia
                const nuevaMateria = {
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

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const port = 5500;
server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
