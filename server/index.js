import http from 'http';
import { handleRequest } from './controller/requestController.js';

import { Server as IOServer } from 'socket.io';
import IOController from './controller/ioController.js';


const server = http.createServer(handleRequest);

const io = new IOServer(server);
const ioController = new IOController(io);
io.on('connection', socket => ioController.registerSocket(socket));



server.listen(3000, () => console.log('Server running on http://localhost:3000'));
