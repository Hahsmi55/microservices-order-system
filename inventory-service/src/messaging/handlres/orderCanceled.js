const prisma = require("../../config/prisma.config")

async function orderCanceled(params) {

    const productId = params.productId;
    const quantity = params.quantity;
    

    const incrementedStock = await prisma.inventory.update({
        where : {
            productId : productId
        },
        data : {
            stock : {
                increment : quantity
            } 
        }
    })

    console.log("Stock increment successfully")
}


module.exports = { orderCanceled }