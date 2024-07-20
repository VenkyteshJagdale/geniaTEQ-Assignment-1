const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

//Payment And Transfer Ammount Router
router.post('/processPayment', paymentController.processPayment);
router.post('/transferFunds', paymentController.transferFunds);

module.exports = router;