const express = require('express');
const router = express.Router();
const product_controller = require('../controllers/user.controller');

router.get('/getRecords', product_controller.getRecords);


module.exports = router;