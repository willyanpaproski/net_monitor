const SNMP = require('net-snmp');

const juniperOids = {
    JuniperSystemUptimeOid: "1.3.6.1.2.1.1.3.0",
    JuniperSystemHostnameOid: "1.3.6.1.4.1.2636.3.1.2"
}

class JuniperSNMP {
    constructor (accessIP, snmpCommunity) {
        this.juniperSession = null;
        this.juniperAcessIP = accessIP;
        this.juniperSnmpCommunity = snmpCommunity;
    }

    createSession() {
        this.juniperSession = SNMP.createSession(this.juniperAcessIP, this.juniperSnmpCommunity);
        console.log(`Sessão com o Juniper ${this.juniperAcessIP} ${this.juniperSnmpCommunity} criada com sucesso`);
    }

    async getUptime() {
        if (!this.juniperSession) {
            throw new Error("Sessão SNMP não foi criada!");
        }

        return new Promise((resolve, reject) => {
            this.juniperSession.get([juniperOids.JuniperSystemUptimeOid], (error, varbinds) => {
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
                        console.log(formattedUptime);
                    }
                }
            });
        });
    }

    async getHostname() {
        if (!this.juniperSession) {
            throw new Error("Sessão SNMP não foi criada!");
        }

        return new Promise((resolve, reject) => {
            this.juniperSession.get([juniperOids.JuniperSystemHostnameOid], (error, varbinds) => {
                if (error) {
                    reject(`Erro ao buscar o hostname: ${error}`);
                } else {
                    if (SNMP.isVarbindError) {
                        console.log(SNMP.varbindError(varbinds[0]));
                    } else {
                        let hostname = varbinds[0].value;

                        // Se for um Buffer, converte para string
                        if (Buffer.isBuffer(hostname)) {
                            hostname = hostname.toString();
                        }

                        console.log(`Hostname: ${hostname}`);
                    }
                }
            });
        });
    }
}

module.exports = JuniperSNMP;