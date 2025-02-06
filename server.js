const expressServer = require('./app').app;
const mongoDbConnection = require('./db/connection');
require('dotenv').config();
const MikrotikSocket = require('./sockets/mikrotikSocket');
const JuniperSocket = require('./sockets/juniperSocket');

const app_port = process.env.APP_PORT || 8989;

expressServer.listen(app_port, async () => {
    await MikrotikSocket();
    await JuniperSocket();
    await mongoDbConnection();
    console.log(`Servidor rodando na porta ${app_port}`);
});