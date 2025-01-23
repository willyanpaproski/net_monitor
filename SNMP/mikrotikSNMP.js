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

    async getUsedMemory() {
        if (!this.mikrotikSession) {
            throw new Error("Sessão SNMP não foi criada!");
        }

        return new Promise((resolve, reject) => {
            this.mikrotikSession.get([mikrotikOids.MikrotikUsedMemoryOid], (error, varbinds) => {
                if (error) {
                    reject(`Erro ao buscar a quantidade de memória usada: ${error.message}`);
                } else {
                    if (SNMP.isVarbindError(varbinds[0])) {
                        console.log(SNMP.varbindError(varbinds[0]));
                    } else {
                        const systemUsedMemory = (varbinds[0].value / 1024).toFixed(1);
                        resolve({ systemUsedMemory: systemUsedMemory });
                    }
                }
            });
        });
    }

    async getTotalMemory() {
        if (!this.mikrotikSession) {
            throw new Error("Sessão SNMP não foi criada!");
        }

        return new Promise((resolve, reject) => {
            this.mikrotikSession.get([mikrotikOids.MikrotikTotalMemoryOid], (error, varbinds) => {
                if (error) {
                    reject(`Erro ao buscar a quantidade de memória total: ${error.message}`);
                } else {
                    if (SNMP.isVarbindError(varbinds[0])) {
                        console.log(SNMP.varbindError(varbinds[0]));
                    } else {
                        const systemTotalMemory = (varbinds[0].value / 1024).toFixed(1);
                        resolve({ systemTotalMemory: systemTotalMemory });
                    }
                }
            });
        });
    }

    async getFreeMemory() {
        if (!this.mikrotikSession) {
            throw new Error("Sessão SNMP não foi criada!");
        }

        return new Promise((resolve, reject) => {
            this.mikrotikSession.get([mikrotikOids.MikrotikTotalMemoryOid, mikrotikOids.MikrotikUsedMemoryOid], (error, varbinds) => {
                if (error) {
                    console.log(error);
                } else {
                    for (var i = 0; i < varbinds.length; i++) {
                        if (SNMP.isVarbindError(varbinds[i])) {
                            console.log(SNMP.varbindError(varbinds[i]));
                        }
                    }

                    const systemTotalMemory = varbinds[0].value / 1024;
                    const systemUsedMemory = varbinds[1].value / 1024;
                    const systemFreeMemory = (systemTotalMemory - systemUsedMemory).toFixed(1);

                    resolve({ systemFreeMemory: systemFreeMemory });
                }
            });
        });
    }

    async getFirmwareVersion() {
        if (!this.mikrotikSession) {
            throw new Error("Sessão SNMP não foi criada!");
        }

        return new Promise((resolve, reject) => {
            this.mikrotikSession.get([mikrotikOids.MikrotikFirmwareVersionOid], (error, varbinds) => {
                if (error) {
                    console.log(error);
                } else {
                    if (SNMP.isVarbindError(varbinds[0])) {
                        console.log(SNMP.varbindError(varbinds[0]));
                    } else {
                        const systemFirmwareVersion = new TextDecoder().decode(varbinds[0].value);
                        resolve({ systemFirmwareVersion: systemFirmwareVersion });
                    }
                }
            });
        });
    }

    async getCpuFrequency() {
        if (!this.mikrotikSession) {
            throw new Error("Sessão SNMP não foi criada!");
        }

        return new Promise((resolve, reject) => {
            this.mikrotikSession.get([mikrotikOids.MikrotikCpuFrequencyOid], (error, varbinds) => {
                if (error) {
                    console.log(error);
                } else {
                    if (SNMP.isVarbindError(varbinds[0])) {
                        console.log(SNMP.varbindError(varbinds[0]));
                    } else {
                        const systemCpuFrequency = varbinds[0].value;
                        resolve({ systemCpuFrequency: systemCpuFrequency });
                    }
                }
            });
        });
    }

    async getCpuUtilizationPercent() {
        if (!this.mikrotikSession) {
            throw new Error("Sessão SNMP não foi criada!");
        }

        return new Promise((resolve, reject) => {
            this.mikrotikSession.get([mikrotikOids.MikrotikCpuUtilizationPercent], (error, varbinds) => {
                if (error) {
                    console.log(error);
                } else {
                    if (SNMP.isVarbindError(varbinds[0])) {
                        console.log(SNMP.varbindError(varbinds[0]));
                    } else {
                        const systemCpuUtilizationPercent = varbinds[0].value;
                        resolve({ systemCpuUtilizationPercent: systemCpuUtilizationPercent });
                    }
                }
            });
        });
    }

}

module.exports = MikrotikSNMP;