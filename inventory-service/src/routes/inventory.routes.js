const express = require("express");
const router = express.Router()
const { addInventory, addProduct, updateInventory } = require("../controllers/inventory.controllers")

// currently am focusing completely on rabbitmq and SAGA pattern , so am
//  not implementing RBAC
router.post('/admin/add-inventory', addInventory);
router.post('/admin/update-inventory', updateInventory);
router.post('/admin/add-product', addProduct);


module.exports = router;