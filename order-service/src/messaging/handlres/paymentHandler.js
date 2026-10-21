const prisma = require("../../config/prisma.config")


async function paymentFailed(payload) {
    
    const orderId = payload.orderId

    const orderConfirmed = await prisma.order.update({
        where : {
            id : orderId
        }, 
        data : {
            status : "CONFIRMED"
        }
    })

    return orderConfirmed
}

async function paymentSucceeded(payload) {
    
    const orderId = payload.orderId

    const orderCanceled = await prisma.order.update({
        where : {
            id : orderId
        }, 
        data : {
            status : "CANCELED"
        }
    })

    return orderCanceled
}

module.exports = { paymentFailed , paymentSucceeded }