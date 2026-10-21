const prisma  = require("../config/prisma.config")
const { publishOrderCreated, publishOrderCanceled } = require("../messaging/events/ordersEvents")

async function orderCreated(req,res) {
    let { productId , price, quantity } = req.body;

    const amount = price * quantity
    
    let createdOrder =  await prisma.order.create({
        data : {
            productId : productId,
            price : price,
            quantity : quantity,
            amount : amount
        }
    })

    await publishOrderCreated(createdOrder);

    res.json({ createdOrder })
}

async function orderCanceled(req,res) {
    let id = parseInt(req.params.id);

    let updateStatus = await prisma.order.update({
        where : {
            id : id
        },
        data : {
            status : "CANCELED"
        }
    })

    await publishOrderCanceled(updateStatus);
    
    res.json({ updateStatus })
}

module.exports = {
    orderCanceled,
    orderCreated
}