const Router = require('express').Router;
const router = Router();
const RouterController = require('../Controllers/roteadorController');

router.get('/nas/getAllNas', RouterController.getAll);
router.get('/nas/getNasById/:id', RouterController.getById);
router.post('/nas/createNas', RouterController.create);
router.put('/nas/updateNas/:id', RouterController.update);
router.delete('/nas/deleteNas/:id', RouterController.delete);

router.get('/views/router', RouterController.getRouterView);
router.get('/views/testeSNMP', RouterController.getTesteView);

module.exports = router;