const expressServer = require('./app').app;
const mongoDbConnection = require('./db/connection');
require('dotenv').config();
const MikrotikSocket = require('./sockets/mikrotikSocket');

const app_port = process.env.APP_PORT || 8989;

expressServer.listen(app_port, '192.168.0.101', async () => {
    await MikrotikSocket();
    await mongoDbConnection();
    console.log(`Servidor rodando na porta ${app_port}`);
});