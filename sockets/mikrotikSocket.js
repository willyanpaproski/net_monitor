const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer();
const RouterRepository = require('../Repository/roteadorRepository');
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'], // Cabeçalhos permitidos
        credentials: true, // Permitir cookies
    },
    transports: ['websocket', 'polling']
});

const MikrotikSNMP = require('../SNMP/mikrotikSNMP');

const initializeMikrotikInstances = async () => {
    const MikrotikDevices = await RouterRepository.getMikrotikRouters();

    return MikrotikDevices.map(({ accessIP, snmpCommunity }) => {
        const mikrotik = new MikrotikSNMP(accessIP, snmpCommunity);
        mikrotik.createSession();
        return mikrotik;
    });
}

io.on('connection', async (socket) => {

    const MikrotikInstances = await initializeMikrotikInstances();

    const sendMikrotikUptime = async () => {
        const results = [];

        for (const mikrotik of MikrotikInstances) {
            try {
                const uptimeData = await mikrotik.getUptime();
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    uptime: uptimeData.uptime
                });
            } catch (error) {
                console.error(`Erro ao buscar dados do Mikrotik ${mikrotik.mikrotikAcessIP}:`, error);
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    error: error.message,
                });
            }
        }

        socket.emit('mikrotikUptime', results);
    }
    sendMikrotikUptime();
    const sendMikrotikUptimeInterval = setInterval(sendMikrotikUptime, 1000);

    const sendMikrotikSystemIdentity = async () => {
        const results = [];

        for (const mikrotik of MikrotikInstances) {
            try {
                const systemIdentityData = await mikrotik.getSystemIdentity();
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    systemIdentity: systemIdentityData.systemIdentity
                });
            } catch (error) {
                console.error(`Erro ao buscar dados do Mikrotik ${mikrotik.mikrotikAcessIP}:`, error);
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    error: error.message,
                });
            }
        }

        socket.emit('mikrotikSystemIdentity', results);
    }
    sendMikrotikSystemIdentity();
    const sendMikrotikSystemIdentityInterval = setInterval(sendMikrotikSystemIdentity, 600000);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado.');
        clearInterval(sendMikrotikUptimeInterval);
        clearInterval(sendMikrotikSystemIdentityInterval);
    });

});

const initializeMikrotikSocket = async () => {
    server.listen(9090, () => {
        console.log('Servidor WebSocket rodando na porta 9090.');
    });
}

module.exports = initializeMikrotikSocket;