const express =  require('express');
const router = express.Router();

const productControllers = require('../controllers/product.controller');

router.get('/findAll', productControllers.findAll);
router.get('/findOne/:product', productControllers.findOne);
router.post('/create', productControllers.create);
router.patch('/update/', productControllers.update);
router.delete('/delete/:product', productControllers.delete);

module.exports = router;
