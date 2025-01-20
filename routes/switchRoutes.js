const Router = require('express').Router;
const router = Router();
const SwitchController = require('../Controllers/switchController');

router.get('/switch/getAllSwitches', SwitchController.getAll);
router.get('/switch/getSwitchById/:id', SwitchController.getById);
router.post('/switch/createSwitch', SwitchController.create);
router.put('/switch/updateSwitch/:id', SwitchController.update);
router.delete('/switch/deleteSwitch/:id', SwitchController.delete);

router.get('/views/switch', SwitchController.getSwitchView);

module.exports = router;