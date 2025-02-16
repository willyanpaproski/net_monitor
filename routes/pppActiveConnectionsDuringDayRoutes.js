const Router = require('express').Router;
const router = Router();
const pppActiveConnectionsDuringDayController = require('../Controllers/pppActiveConnectionsDuringDayController');

router.get('/pppConnectionsDuringDay/:routerId', pppActiveConnectionsDuringDayController.getRouterActiveConnectionsData);

module.exports = router;