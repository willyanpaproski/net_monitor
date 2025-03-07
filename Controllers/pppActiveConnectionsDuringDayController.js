const PppActiveConnectionsDuringDayRepository = require('../Repository/pppConnectionsDuringDayRepository');

class PppActiveConnectionsDuringDayController {
    async getRouterActiveConnectionsData(req, res) {
        const routerActiveConnectionsData = await PppActiveConnectionsDuringDayRepository.getRouterActiveConnectionsData(req.params.routerId);

        const sanitizedData = routerActiveConnectionsData.map(item => ({
            ...item.toObject(),
            monitoringTime: new Date(item.monitoringTime),
            numberOfConnections: Number(item.numberOfConnections)
        }));

        res.json({ routerActiveConnectionsDuringDay: sanitizedData });
    }
}

module.exports = new PppActiveConnectionsDuringDayController();