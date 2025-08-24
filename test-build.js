const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;


const server = http.createServer((req, res) => {
    console.log(req.method)
    if(req.url === '/') {
        const pathUrl = path.join(__dirname, 'index.html');
        return returnFile(res,pathUrl,'index.html não encontrado!');
    }
    if(req.url.startsWith('/assets/')){
        const pathSegmented = req.url.split('/');
        pathSegmented.unshift(__dirname);
        const pathUrl = path.join(...pathSegmented);
        const assetName = req.url.split('/').pop();

        return returnFile(res,pathUrl, `asset "${assetName}" não encontrado!`);
    }
    if(req.url === 'FIXME: favicon'){
        
        return;
    }


    return res.end('Rota não encontrada');
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