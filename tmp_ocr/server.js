const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const baseDir = 'F:\\as写作';

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let reqPath = decodeURIComponent(parsedUrl.pathname);

    if (req.method === 'POST' && reqPath === '/save-ocr') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                fs.writeFileSync(path.join(baseDir, 'tmp_ocr', data.filename), data.text);
                res.writeHead(200);
                res.end('OK');
            } catch (e) {
                res.writeHead(500);
                res.end(e.toString());
            }
        });
        return;
    }
    
    let filePath = path.join(baseDir, reqPath === '/' ? '/tmp_ocr/ocr.html' : reqPath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404);
            res.end('Not found: ' + filePath);
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        let contentType = 'text/plain';
        if (ext === '.html') contentType = 'text/html; charset=utf-8';
        if (ext === '.js') contentType = 'text/javascript';
        if (ext === '.pdf') contentType = 'application/pdf';

        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(8080, () => {
    console.log('Server running on http://localhost:8080/');
});
