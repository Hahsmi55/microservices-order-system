const prisma = require("../../config/prisma.config")
const { publishInventoryCanceled, publishInventoryReserved } = require("../events/ordersEvents") 

async function orderCreated(params) {

    
    const { quantity, productId } = params;

    const foundProduct = await prisma.inventory.findUnique({
        select : {
            productId : true,
            stock : true
        }, 
        where : {
            productId : productId
        }
    })

    if (foundProduct.stock < params.quantity) {
        
        publishInventoryCanceled(params);

        return;
    }

    const updatedProduct = await prisma.inventory.update({
        where: {
            productId: productId,
        },
        data: {
            stock: {
                decrement: quantity,
            },
        },
    });

    if (updatedProduct.stock > 0) {
        await publishInventoryReserved(params);
    }
}


module.exports = { orderCreated }