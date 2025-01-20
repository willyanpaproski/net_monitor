class TransmissorDTO {
    constructor({
        integration,
        name,
        description,
        accessUsername,
        accessPassword,
        accessIP,
        snmpCommunity
    }) {
        this.integration = integration,
        this.name = name,
        this.description = description,
        this.accessUsername = accessUsername,
        this.accessPassword = accessPassword,
        this.accessIP = accessIP,
        this.snmpCommunity = snmpCommunity
    }
}

module.exports = TransmissorDTO;