const Router = require('express').Router;
const router = Router();
const TransmissorController = require('../Controllers/transmissorController');

router.get('/transmissor/getAllTransmissors', TransmissorController.getAll);
router.get('/transmissor/getTransmissorById/:id', TransmissorController.getById);
router.post('/transmissor/createTranmissor', TransmissorController.create);
router.put('/transmissor/updateTransmissor/:id', TransmissorController.update);
router.delete('/transmissor/deleteTransmissor/:id', TransmissorController.delete);

router.get('/views/transmissor', TransmissorController.getTransmissorView);

module.exports = router;