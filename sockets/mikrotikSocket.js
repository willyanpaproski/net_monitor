const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const MikrotikSNMP = require('../SNMP/mikrotikSNMP');

io.on('connection', (socket) => {
    
});