const express = require('express');
const controller = require('../controllers/payment.controller');

const router = express.Router();

// Webhook from SafePay (or your frontend success callback)
router.post('/webhook', controller.handleWebhook);
router.get('/checkoutUrl/:orderId', controller.getCheckoutUrl)


module.exports = router;
