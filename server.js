const expressServer = require('./app').app;
const mongoDbConnection = require('./db/connection');
require('dotenv').config();

const app_port = process.env.APP_PORT || 8989;

expressServer.listen(app_port, () => {
    mongoDbConnection();
    console.log(`Servidor rodando na porta ${app_port}`);
});