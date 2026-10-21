const express = require("express")
const router = express.Router()

const {orderCreated, orderCanceled} = require("../controllers/orders.controllers")

router.post('/created', orderCreated)
router.get('/canceled/:id', orderCanceled)


module.exports = router;


















