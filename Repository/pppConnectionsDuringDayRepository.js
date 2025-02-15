const PppConnectionsDuringDay = require('../models/pppConnectionsDuringDay');

class PppConnectionsDuringDayRepository {

    async create(pppConnectionsData) {
        const pppConnections = new PppConnectionsDuringDay(pppConnectionsData);
        return await pppConnections.save();
    }

}

module.exports = new PppConnectionsDuringDayRepository();