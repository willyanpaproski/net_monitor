class RouterDTO {
    constructor({
        updatedAt,
        integration,
        name, 
        description, 
        accessUsername, 
        accessPassword,
        accessIP,
        snmpCommunity
    }) {
        this.updatedAt = updatedAt,
        this.integration = integration,
        this.name = name,
        this.description = description,
        this.accessUsername = accessUsername,
        this.accessPassword = accessPassword,
        this.accessIP = accessIP,
        this.snmpCommunity = snmpCommunity
    }
}

module.exports = RouterDTO;