const http = require('http');
const fs = require('fs');
const url = require('url');


const nuestro_server = http.createServer((req, res) =>{

    const parsedUrl = url.pase(req.url, true);
    if( req.method == "GET" && parsedUrl.pathname == "/ver-registros"){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write("Codigo HTML");
        res.end;

    }
    //HACER UN SERVIDOR NODE QUE PEGUE ALGUNAS RUTAS 
});

nuestro_server.listen(3000, () =>{
    console.log("Corriendo");
});


