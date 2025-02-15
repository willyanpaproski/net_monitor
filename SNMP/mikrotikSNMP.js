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
    MikrotikCpuUtilizationPercent: "1.3.6.1.2.1.25.3.3.1.2.1",
    MikrotikTime: "1.3.6.1.2.1.25.1.2.0",
    MikrotikActivePPPUsername: "1.3.6.1.4.1.9.9.150.1.1.3.1.2",
    MikrotikActivePPPIpAddresses: "1.3.6.1.4.1.9.9.150.1.1.3.1.3",
    MikrotikActivePPPMacAddresses: "1.3.6.1.4.1.14988.1.1.11.1.1.3"
}

class MikrotikSNMP {

    constructor (accessIP, snmpCommunity, _id) {
        this.mikrotikSession = null;
        this.mikrotikAcessIP = accessIP;
        this.mikrotikSnmpCommunity = snmpCommunity;
        this.mikrotikId = _id;
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
                        resolve({ systemUptime: formattedUptime });
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

    async getMikrotikTime() {
        if (!this.mikrotikSession) {
            throw new Error("Sessão SNMP não foi criada!");
        }

        return new Promise((resolve, reject) => {
            this.mikrotikSession.get([mikrotikOids.MikrotikTime], (error, varbinds) => {
                if (error) {
                    console.log(error);
                } else {
                    if (SNMP.isVarbindError(varbinds[0])) {
                        console.log(SNMP.varbindError(varbinds[0]));
                    } else {
                        const systemTimeBuffer = varbinds[0].value;
                        const currentTime = new Date();

                        const year = currentTime.getFullYear();

                        const month = systemTimeBuffer[2];
                        const day = systemTimeBuffer[3];

                        const hour = systemTimeBuffer[4];
                        const minute = systemTimeBuffer[5];
                        const second = systemTimeBuffer[6];

                        const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
                        const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;

                        const systemDateTime = `${formattedDate}, ${formattedTime}`
                        
                        resolve({ systemDateTime: systemDateTime });
                    }
                }
            });
        });
    }

    async getUsedDisk() {
        if (!this.mikrotikSession) {
            throw new Error("Sessão SNMP não foi criada!");
        }

        return new Promise((resolve, reject) => {
            this.mikrotikSession.get([mikrotikOids.MikrotikUsedHddSpace], (error, varbinds) => {
                if (error) {
                    console.log(error);
                } else {
                    if (SNMP.isVarbindError(varbinds[0])) {
                        console.log(SNMP.varbindError(varbinds[0]));
                    } else {
                        const systemUsedDisk = (varbinds[0].value / (1024)).toFixed(1);
                        resolve({systemUsedDisk: systemUsedDisk});
                    }
                }
            });
        });
    }

    async getTotalDisk() {
        if (!this.mikrotikSession) {
            throw new Error("Sessão SNMP não foi criada!");
        }

        return new Promise((resolve, reject) => {
            this.mikrotikSession.get([mikrotikOids.MikrotikTotalHddSpace], (error, varbinds) => {
                if (error) {
                    console.log(error);
                } else {
                    if (SNMP.isVarbindError(varbinds[0])) {
                        console.log(SNMP.varbindError(varbinds[0]));
                    } else {
                        const systemTotalDisk = (varbinds[0].value / (1024)).toFixed(1);
                        resolve({systemTotalDisk: systemTotalDisk});
                    }
                }
            });
        });
    }

    async getFreeDisk() {
        if (!this.mikrotikSession) {
            throw new Error("Sessão SNMP não foi criada!");
        }

        return new Promise((resolve, reject) => {
            this.mikrotikSession.get([mikrotikOids.MikrotikTotalHddSpace, mikrotikOids.MikrotikUsedHddSpace], (error, varbinds) => {
                if (error) {
                    console.log(error);
                } else {
                    for (var i = 0; i < varbinds.length; i++) {
                        if (SNMP.isVarbindError(varbinds[i])) {
                            console.log(SNMP.varbindError(varbinds[i]));
                        }
                    }

                    const systemTotalDisk = varbinds[0].value / 1024;
                    const systemUsedDisk = varbinds[1].value / 1024;
                    const systemFreeDisk = (systemTotalDisk - systemUsedDisk).toFixed(1);

                    resolve({ systemFreeDisk: systemFreeDisk });
                }
            });
        });
    }

    async getPPPActiveConnections() {
        if (!this.mikrotikSession) {
            throw new Error("Sessão SNMP não foi criada!");
        }

        const users = [];
        var totalPPPActiveConnections = 0;
        var totalPPPActiveConnectionsWithoutIP = 0;
        var totalPPPActiveConnectionsWithIP = 0;

        return new Promise((resolve, reject) => {
            try {
                this.mikrotikSession.subtree(mikrotikOids.MikrotikActivePPPUsername, (varbinds) => {
                    varbinds.forEach(varbind => {
                        users.push({user: varbind.value.toString()});
                    });
                }, (error) => {
                    if (error) {
                        reject(error);
                    }
                });

                this.mikrotikSession.subtree(mikrotikOids.MikrotikActivePPPIpAddresses, (varbinds) => {
                    varbinds.forEach(varbind => {
                        if (varbind.value == '0.0.0.0') {
                            totalPPPActiveConnectionsWithoutIP ++;
                        } else {
                            totalPPPActiveConnectionsWithIP ++;
                        }
                        users[totalPPPActiveConnections].ip = varbind.value;
                        totalPPPActiveConnections ++;
                    });
                }, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ 
                            PPPActiveUsers: users, 
                            totalPPPActiveConnections: totalPPPActiveConnections,
                            totalPPPActiveConnectionsWithoutIP: totalPPPActiveConnectionsWithoutIP,
                            totalPPPActiveConnectionsWithIP: totalPPPActiveConnectionsWithIP
                        });
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = MikrotikSNMP;