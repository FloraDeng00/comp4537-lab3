const http = require('http');
const url = require('url');
const utils = require('./modules/utils');
const greetingMessage = require('./lang/en/en.json').greeting;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    if (parsedUrl.pathname === '/COMP4537/labs/3/getDate/' && req.method === 'GET') {
        const name = parsedUrl.query.name || 'Guest';
        const currentDate = utils.getDate();
        const message = `${greetingMessage.replace('Flora Deng', name)} ${currentDate}`;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`<p style="color: blue;">${message}</p>`);
        res.end();
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
