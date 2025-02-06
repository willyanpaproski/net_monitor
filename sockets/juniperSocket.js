const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer();
const RouterRepository = require('../Repository/roteadorRepository');
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    },
    transports: ['websocket', 'polling']
});

const JuniperSNMP = require('../SNMP/juniperSNMP');

const initializeJuniperInstances = async () => {
    const JuniperDevices = await RouterRepository.getJuniperRouters();

    return JuniperDevices.map(({ accessIP, snmpCommunity }) => {
        const juniper = new JuniperSNMP(accessIP, snmpCommunity);
        juniper.createSession();
        return juniper;
    });
}

io.on('connection', async (socket) => {
    const JuniperInstances = await initializeJuniperInstances();

    const sendJuniperSystemUptime = async () => {
        const results = [];

        for (const juniper of JuniperInstances) {
            try {
                const systemUptimeData = await juniper.getUptime();
                results.push({
                    ip: juniper.juniperAcessIP,
                    systemUptime: systemUptimeData
                });
            } catch (error) {
                console.error(`Erro ao buscar dados do Juniper ${juniper.juniperAcessIP}:`, error);
                results.push({
                    ip: juniper.juniperAcessIP,
                    error: error.message,
                });
            }
        }

        socket.emit('juniperSystemUptime', results);
    }

    sendJuniperSystemUptime();
    const sendJuniperUptimeInterval = setInterval(sendJuniperSystemUptime, 1000);

    const sendJuniperSystemHostname = async () => {
        const results = [];

        for (const juniper of JuniperInstances) {
            try {
                const systemHostnameData = await juniper.getHostname();
                results.push({
                    ip: juniper.juniperAcessIP,
                    systemHostname: systemHostnameData
                });
            } catch (error) {
                console.error(`Erro ao buscar dados do Juniper ${juniper.juniperAcessIP}:`, error);
                results.push({
                    ip: juniper.juniperAcessIP,
                    error: error.message,
                });
            }
        }

        socket.emit('juniperSystemHostname', results)
    }
    sendJuniperSystemHostname();
    const sendJuniperSystemHostnameInterval = setInterval(sendJuniperSystemHostname, 5000);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado.');
        clearInterval(sendJuniperUptimeInterval);
        clearInterval(sendJuniperSystemHostnameInterval);
    });
});

const initializeJuniperSocket = async () => {
    server.listen(9091, () => {
        console.log('Servidor WebSocket rodando na porta 9091.');
    });
}

module.exports = initializeJuniperSocket;