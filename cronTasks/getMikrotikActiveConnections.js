const nodeCron = require('node-cron');
const MikrotikSNMP = require('../SNMP/mikrotikSNMP');
const PppConnectionsDuringDayRepository = require('../Repository/pppConnectionsDuringDayRepository');
const RouterRepository = require('../Repository/roteadorRepository');

const initializeMikrotikInstances = async () => {
    const MikrotikDevices = await RouterRepository.getMikrotikRouters();

    return MikrotikDevices.map(({ accessIP, snmpCommunity, _id }) => {
        const mikrotik = new MikrotikSNMP(accessIP, snmpCommunity, _id);
        mikrotik.createSession();
        return mikrotik;
    });
}

async function getMikrotikActiveConnections() {
    const MikrotikInstances = await initializeMikrotikInstances();

    for(const mikrotik of MikrotikInstances) {
        const activeConnectionsData = await mikrotik.getPPPActiveConnections();
        const data = {
            nasId: mikrotik.mikrotikId,
            monitoringTime: Date.now(),
            numberOfConnections: activeConnectionsData.totalPPPActiveConnections
        };
        await PppConnectionsDuringDayRepository.create(data);
    }
}

nodeCron.schedule("0,30 * * * *", async () => {
    getMikrotikActiveConnections();
    console.log('Active salvos');
});