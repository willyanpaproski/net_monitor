const PppActiveConnectionsDuringDayRepository = require('../Repository/pppConnectionsDuringDayRepository');

class PppActiveConnectionsDuringDayController {
    async getRouterActiveConnectionsData(req, res) {
        const routerActiveConnectionsData = await PppActiveConnectionsDuringDayRepository.getRouterActiveConnectionsData(req.params.routerId);

        res.json({ routerActiveConnectionsDuringDay: routerActiveConnectionsData });
    }
}

module.exports = new PppActiveConnectionsDuringDayController();