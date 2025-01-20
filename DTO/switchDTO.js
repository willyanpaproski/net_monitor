class SwitchDTO {
    constructor({
        integration,
        name,
        description,
        accessUsername,
        accessPassword,
        accessIP,
        snmpCommunity,
        createdAt,
        updatedAt
    }) {
        this.integration = integration,
        this.name = name,
        this.description = description,
        this.accessUsername = accessUsername,
        this.accessPassword = accessPassword,
        this.accessIP = accessIP,
        this.snmpCommunity = snmpCommunity,
        this.createdAt = createdAt,
        this.updatedAt = updatedAt
    }
}

module.exports = SwitchDTO;