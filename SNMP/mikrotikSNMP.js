const SNMP = require('net-snmp');

const mikrotikOids = {
    MikrotikUptimeOid: "1.3.6.1.2.1.1.3.0",
    MikrotikSystemIdentityOid: "1.3.6.1.2.1.1.5.0",
    MikrotikTotalMemoryOid: "1.3.6.1.2.1.25.2.3.1.5.65536",
    MikrotikUsedMemoryOid: "1.3.6.1.2.1.25.2.3.1.6.65536",
    MikrotikCpuFrequencyOid: "1.3.6.1.4.1.14988.1.1.3.14.0",
    MikrotikFirmwareVersionOid: "1.3.6.1.4.1.14988.1.1.4.4.0",
    MikrotikTotalHddSpace: "1.3.6.1.2.1.25.2.3.1.5.131073",
    MikrotikUsedHddSpace: "1.3.6.1.2.1.25.2.3.1.6.131073",
    MikrotikCpuUtilizationPercent: "1.3.6.1.2.1.25.3.3.1.2.1"
}

class MikrotikSNMP {

    constructor (accessIP, snmpCommunity) {
        this.mikrotikSession = null;
        this.mikrotikAcessIP = accessIP;
        this.mikrotikSnmpCommunity = snmpCommunity;
    }

    createSession() {
        this.mikrotikSession = SNMP.createSession(this.mikrotikAcessIP, this.mikrotikSnmpCommunity);
        console.log(`Sessão com o Mikrotik ${this.mikrotikAcessIP} ${this.mikrotikSnmpCommunity} criada com sucesso`);
    }

    async getUptime() {
        if (!this.mikrotikSession) {
            throw new Error("Sessão SNMP não foi criada!");
        }

        return new Promise((resolve, reject) => {
            this.mikrotikSession.get([mikrotikOids.MikrotikUptimeOid], (error, varbinds) => {
                if (error) {
                    reject(`Erro ao buscar o Uptime: ${error.message}`);
                } else {
                    if (SNMP.isVarbindError(varbinds[0])) {
                        console.log(SNMP.varbindError(varbinds[0]));
                    } else {
                        const uptimeCentiSeconds = varbinds[0].value;
                        const uptimeSeconds = Math.floor(uptimeCentiSeconds / 100);

                        const hours = Math.floor(uptimeSeconds / 3600);
                        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
                        const seconds = uptimeSeconds % 60;

                        const formattedUptime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                        resolve({ uptime: formattedUptime });
                    }
                }
            });
        });
    }

    async getSystemIdentity() {
        if (!this.mikrotikSession) {
            throw new Error("Sessão SNMP não foi criada!");
        }

        return new Promise((resolve, reject) => {
            this.mikrotikSession.get([mikrotikOids.MikrotikSystemIdentityOid], (error, varbinds) => {
                if (error) {
                    reject(`Erro ao buscar o System Identity: ${error.message}`);
                } else {
                    if (SNMP.isVarbindError(varbinds[0])) {
                        console.log(SNMP.varbindError(varbinds[0]));
                    } else {
                        const systemIdentityBuffer = varbinds[0].value;
                        const systemIdentity = new TextDecoder().decode(systemIdentityBuffer);
                        resolve({ systemIdentity: systemIdentity });
                    }
                }
            });
        });
    }

}

module.exports = MikrotikSNMP;