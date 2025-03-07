const PppConnectionsDuringDay = require('../models/pppConnectionsDuringDay');
const moment = require('moment');

class PppConnectionsDuringDayRepository {

    async create(pppConnectionsData) {
        const pppConnections = new PppConnectionsDuringDay(pppConnectionsData);
        return await pppConnections.save();
    }

    async getRouterActiveConnectionsData(routerId) {

        const startOfDay = moment.utc().startOf('day').toDate();
        const endOfDay = moment.utc().endOf('day').toDate();

        const connections = await PppConnectionsDuringDay.find({
            nasId: routerId,
            monitoringTime: { $gte: startOfDay, $lte: endOfDay }
        });

        return connections;
    }

}

module.exports = new PppConnectionsDuringDayRepository();