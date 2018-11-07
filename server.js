const http = require('http');
const app = require('./app');

//assigns port number for the server, can be hard coded or else use an environment variable
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);