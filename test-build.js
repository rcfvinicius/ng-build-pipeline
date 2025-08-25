const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;


const server = http.createServer((req, res) => {
    console.log(req.method)
    if(req.url === '/') {
        const route = path.join(__dirname, 'index.html');
        return returnFile(res, route, 'index.html não encontrado!');
    }
    if(req.url.startsWith('/assets/')){
        const pathSegmented = req.url.split('/');
        pathSegmented.unshift(__dirname);
        const route = path.join(...pathSegmented);
        const assetName = req.url.split('/').pop();

        return returnFile(res, route, `Asset "${assetName}" não encontrado!`);
    }
    if(req.url === '/favicon.ico' || req.url.includes('/main') || req.url.includes('/styles')){
        const route = path.join(__dirname, req.url);
        let headers;
        if(req.url === '/favicon.ico') headers = {'Content-Type':'image/x-icon'};
        if(req.url.includes('/main')) headers = {'Content-Type':'application/javascript'};
        if(req.url.includes('/styles')) headers = {'Content-Type':'text/css'};

        res.writeHead(200, headers);
        return returnFile(res, route, `Recurso "${req.url}" não encontrado!`);
    }

    res.writeHead(404);
    res.end(`Rota "${req.url}" não encontrada`);
});

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});


function returnFile(res, pathUrl, notFoundMessage){
    if (fs.existsSync(pathUrl)) {
        fs.readFile(pathUrl, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end(`Erro ao ler o arquivo: ${err}`);
                return;
            }
            res.write(data);
            res.end()
        });
        return;
    }
    
    res.writeHead(404);
    res.end(notFoundMessage);
}