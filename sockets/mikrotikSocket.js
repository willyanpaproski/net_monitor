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
                const systemUptimeData = await mikrotik.getUptime();
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    systemUptime: systemUptimeData.systemUptime
                });
            } catch (error) {
                console.error(`Erro ao buscar dados do Mikrotik ${mikrotik.mikrotikAcessIP}:`, error);
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    error: error.message,
                });
            }
        }

        socket.emit('mikrotikSystemUptime', results);
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

    const sendMikrotikUsedMemory = async () => {
        const results = [];

        for (const mikrotik of MikrotikInstances) {
            try {
                const systemUsedMemoryData = await mikrotik.getUsedMemory();
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    systemUsedMemory: systemUsedMemoryData.systemUsedMemory
                });
            } catch (error) {
                console.error(`Erro ao buscar dados do Mikrotik ${mikrotik.mikrotikAcessIP}:`, error);
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    error: error.message,
                });
            }
        }

        socket.emit('mikrotikSystemUsedMemory', results);
    }
    sendMikrotikUsedMemory();
    const sendMikrotikUsedMemoryInterval = setInterval(sendMikrotikUsedMemory, 3000);

    const sendMikrotikTotalMemory = async () => {
        const results = [];

        for (const mikrotik of MikrotikInstances) {
            try {
                const systemTotalMemoryData = await mikrotik.getTotalMemory();
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    systemTotalMemory: systemTotalMemoryData.systemTotalMemory
                });
            } catch (error) {
                console.error(`Erro ao buscar dados do Mikrotik ${mikrotik.mikrotikAcessIP}:`, error);
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    error: error.message,
                });
            }
        }

        socket.emit('mikrotikSystemTotalMemory', results);
    }
    sendMikrotikTotalMemory();
    const sendMikrotikTotalMemoryInterval = setInterval(sendMikrotikTotalMemory, 600000);

    const sendMikrotikFreeMemory = async () => {
        const results = [];

        for (const mikrotik of MikrotikInstances) {
            try {
                const systemFreeMemoryData = await mikrotik.getFreeMemory();
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    systemFreeMemory: systemFreeMemoryData.systemFreeMemory
                });
            } catch (error) {
                console.error(`Erro ao buscar dados do Mikrotik ${mikrotik.mikrotikAcessIP}:`, error);
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    error: error.message,
                });
            }
        }

        socket.emit('mikrotikSystemFreeMemory', results);
    }
    sendMikrotikFreeMemory();
    const sendMikrotikFreeMemoryInterval = setInterval(sendMikrotikFreeMemory, 5000);

    const sendMikrotikMemoryResources = async () => {
        const results = [];

        for (const mikrotik of MikrotikInstances) {
            try {
                const systemUsedMemoryData = await mikrotik.getUsedMemory();
                const systemFreeMemoryData = await mikrotik.getFreeMemory();
                const systemTotalMemoryData = await mikrotik.getTotalMemory();
                const systemUsedMemoryPercent = ((systemUsedMemoryData.systemUsedMemory / systemTotalMemoryData.systemTotalMemory) * 100).toFixed(2);
                const systemFreeMemoryPercent = ((systemFreeMemoryData.systemFreeMemory / systemTotalMemoryData.systemTotalMemory) * 100).toFixed(2);
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    systemUsedMemory: systemUsedMemoryData.systemUsedMemory,
                    systemFreeMemory: systemFreeMemoryData.systemFreeMemory,
                    systemTotalMemory: systemTotalMemoryData.systemTotalMemory,
                    systemUsedMemoryPercent: systemUsedMemoryPercent,
                    systemFreeMemoryPercent: systemFreeMemoryPercent
                });
            } catch (error) {
                console.error(`Erro ao buscar dados do Mikrotik ${mikrotik.mikrotikAcessIP}:`, error);
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    error: error.message,
                });
            }
        }

        socket.emit('mikrotikMemoryResources', results);
    }
    sendMikrotikMemoryResources();
    const sendMikrotikMemoryResourcesInterval = setInterval(sendMikrotikMemoryResources, 3000)

    const sendMikrotikFirmwareVersion = async () => {
        const results = [];

        for (const mikrotik of MikrotikInstances) {
            try {
                const systemFirmwareVersionData = await mikrotik.getFirmwareVersion();
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    systemFirmwareVersion: systemFirmwareVersionData.systemFirmwareVersion
                });
            } catch (error) {
                console.error(`Erro ao buscar dados do Mikrotik ${mikrotik.mikrotikAcessIP}:`, error);
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    error: error.message,
                });
            }
        }

        socket.emit('mikrotikFirmwareVersion', results);
    }
    sendMikrotikFirmwareVersion();
    const sendMikrotikFirmwareVersionInterval = setInterval(sendMikrotikFirmwareVersion, 600000);

    const sendMikrotikCpuFrequency = async () => {
        const results = [];

        for (const mikrotik of MikrotikInstances) {
            try {
                const systemCpuFrequencyData = await mikrotik.getCpuFrequency();
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    systemCpuFrequency: systemCpuFrequencyData.systemCpuFrequency
                });
            } catch (error) {
                console.error(`Erro ao buscar dados do Mikrotik ${mikrotik.mikrotikAcessIP}:`, error);
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    error: error.message,
                });
            }
        }

        socket.emit('mikrotikCpuFrequency', results);
    }
    sendMikrotikCpuFrequency();
    const sendMikrotikCpuFrequencyInterval = setInterval(sendMikrotikCpuFrequency, 600000);

    const sendMikrotikCpuUtilizationPercent = async () => {
        const results = [];

        for (const mikrotik of MikrotikInstances) {
            try {
                const systemCpuUtilizationPercentData = await mikrotik.getCpuUtilizationPercent();
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    systemCpuUtilizationPercent: systemCpuUtilizationPercentData.systemCpuUtilizationPercent
                });
            } catch (error) {
                console.error(`Erro ao buscar dados do Mikrotik ${mikrotik.mikrotikAcessIP}:`, error);
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    error: error.message,
                });
            }
        }

        socket.emit('mikrotikCpuUtilizationPercent', results);
    }
    sendMikrotikCpuUtilizationPercent();
    const sendMikrotikCpuUtilizationPercentInterval = setInterval(sendMikrotikCpuUtilizationPercent, 3000);

    const sendMikrotikSystemTime = async () => {
        const results = [];

        for (const mikrotik of MikrotikInstances) {
            try {
                const systemTimeData = await mikrotik.getMikrotikTime();
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    systemDateTime: systemTimeData.systemDateTime
                });
            } catch (error) {
                console.error(`Erro ao buscar dados do Mikrotik ${mikrotik.mikrotikAcessIP}:`, error);
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    error: error.message,
                });
            }
        }

        socket.emit('mikrotikSystemTime', results);
    }
    sendMikrotikSystemTime();
    const sendMikrotikSystemTimeInterval = setInterval(sendMikrotikSystemTime, 1000);

    const sendMikrotikSystemTotalDisk = async () => {
        const results = [];

        for (const mikrotik of MikrotikInstances) {
            try {
                const systemTotalDiskData = await mikrotik.getTotalDisk();
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    systemTotalDisk: systemTotalDiskData.systemTotalDisk
                });
            } catch (error) {
                console.error(`Erro ao buscar dados do Mikrotik ${mikrotik.mikrotikAcessIP}:`, error);
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    error: error.message,
                });
            }
        }

        socket.emit('mikrotikSystemTotalDisk', results);
    }
    sendMikrotikSystemTotalDisk();
    const sendMikrotikSystemTotalDiskInterval = setInterval(sendMikrotikSystemTotalDisk, 600000);

    const sendMikrotikSystemUsedDisk = async () => {
        const results = [];

        for (const mikrotik of MikrotikInstances) {
            try {
                const systemUsedDiskData = await mikrotik.getUsedDisk();
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    systemUsedlDisk: systemUsedDiskData.systemUsedDisk
                });
            } catch (error) {
                console.error(`Erro ao buscar dados do Mikrotik ${mikrotik.mikrotikAcessIP}:`, error);
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    error: error.message,
                });
            }
        }

        socket.emit('mikrotikSystemUsedDisk', results);
    }
    sendMikrotikSystemUsedDisk();
    const sendMikrotikSystemUsedDiskInterval = setInterval(sendMikrotikSystemUsedDisk, 3000);

    const sendMikrotikSystemFreeDisk = async () => {
        const results = [];

        for (const mikrotik of MikrotikInstances) {
            try {
                const systemFreeDiskData = await mikrotik.getFreeDisk();
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    systemFreeDisk: systemFreeDiskData.systemFreeDisk
                });
            } catch (error) {
                console.error(`Erro ao buscar dados do Mikrotik ${mikrotik.mikrotikAcessIP}:`, error);
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    error: error.message,
                });
            }
        }

        socket.emit('mikrotikSystemFreeDisk', results);
    }
    sendMikrotikSystemFreeDisk();
    const sendMikrotikSystemFreeDiskInterval = setInterval(sendMikrotikSystemFreeDisk, 3000);

    const sendMikrotikSystemDiskResources = async () => {
        const results = [];

        for (const mikrotik of MikrotikInstances) {
            try {
                const systemFreeDiskData = await mikrotik.getFreeDisk();
                const systemUsedDiskData = await mikrotik.getUsedDisk();
                const systemTotalDiskData = await mikrotik.getTotalDisk();
                const systemUsedDiskPercent = ((systemTotalDiskData.systemTotalDisk / systemUsedDiskData.systemUsedDisk) * 100).toFixed(1);
                const systemFreeDiskPercent = ((systemTotalDiskData.systemTotalDisk / systemFreeDiskData.systemFreeDisk) * 100).toFixed(1);

                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    systemFreeDisk: systemFreeDiskData.systemFreeDisk,
                    systemUsedDisk: systemUsedDiskData.systemUsedDisk,
                    systemTotalDisk: systemTotalDiskData.systemTotalDisk,
                    systemUsedDiskPercent: systemUsedDiskPercent,
                    systemFreeDiskPercent: systemFreeDiskPercent
                });
            } catch (error) {
                console.error(`Erro ao buscar dados do Mikrotik ${mikrotik.mikrotikAcessIP}:`, error);
                results.push({
                    ip: mikrotik.mikrotikAcessIP,
                    error: error.message,
                });
            }
        }

        socket.emit('mikrotikSystemDiskResources', results);
    }
    sendMikrotikSystemDiskResources();
    const sendMikrotikSystemDiskResourcesInterval = setInterval(sendMikrotikSystemDiskResources, 3000);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado.');
        clearInterval(sendMikrotikUptimeInterval);
        clearInterval(sendMikrotikSystemIdentityInterval);
        clearInterval(sendMikrotikUsedMemoryInterval);
        clearInterval(sendMikrotikTotalMemoryInterval);
        clearInterval(sendMikrotikFreeMemoryInterval);
        clearInterval(sendMikrotikFirmwareVersionInterval);
        clearInterval(sendMikrotikCpuFrequencyInterval);
        clearInterval(sendMikrotikCpuUtilizationPercentInterval);
        clearInterval(sendMikrotikSystemTimeInterval);
        clearInterval(sendMikrotikMemoryResourcesInterval);
        clearInterval(sendMikrotikSystemTotalDiskInterval);
        clearInterval(sendMikrotikSystemUsedDiskInterval);
        clearInterval(sendMikrotikSystemFreeDiskInterval);
        clearInterval(sendMikrotikSystemDiskResourcesInterval);
    });

});

const initializeMikrotikSocket = async () => {
    server.listen(9090, () => {
        console.log('Servidor WebSocket rodando na porta 9090.');
    });
}

module.exports = initializeMikrotikSocket;