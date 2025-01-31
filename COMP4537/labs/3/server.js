const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const utils = require('./modules/utils');
const greetingMessage = require('./lang/en/en.json').greeting;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const basePath = '/COMP4537/labs/3';

    // Part B: Get server time and greet the user
    if (parsedUrl.pathname === `${basePath}/getDate/` && req.method === 'GET') {
        const name = parsedUrl.query.name || 'Guest'; 
        const currentDate = new Date().toLocaleString('en-US', { timeZone: 'America/Vancouver' });
        const message = greetingMessage.replace('%1', name) + ' ' + currentDate;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`<p style="color: blue;">${message}</p>`);
        res.end();
    }

    // Part C.1: Write to file
    else if (parsedUrl.pathname === `${basePath}/writeFile/` && req.method === 'GET') {
        const text = parsedUrl.query.text || '';
        if (!text) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Error: No text provided in the query string.');
            return;
        }

        const filePath = path.join(__dirname, 'file.txt');
        fs.appendFile(filePath, `${text}\n`, (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error: Unable to write to file.');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`Text "${text}" appended to file.txt`);
            }
        });
    }

    // Part C.2: Read from file (dynamic filename)
    else if (parsedUrl.pathname.startsWith(`${basePath}/readFile/`) && req.method === 'GET') {
        const fileName = parsedUrl.pathname.split('/').pop(); // 获取文件名
        const filePath = path.join(__dirname, fileName);

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end(`Error: File "${fileName}" not found.`);
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error: Unable to read file.');
                }
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(data);
            }
        });
    }

    // Handle invalid endpoints
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});