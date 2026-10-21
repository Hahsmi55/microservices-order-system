const prisma = require("../../config/prisma.config")

async function inventoryFailed(params) {
    
    const id = params.id;

    const canceledOrder = await prisma.order.update({
        where : {
            id : id
        },

        data : {
            status : "CANCELED"
        }    
    })
}


async function inventoryReserved(params) {
    
    const id = params.id;

    const updateStatus = await prisma.order.update({
        where : {
            id : id
        },

        data : {
            status : "INVENTORY_RESERVED"
        }    
    })
}


module.exports = { inventoryFailed , inventoryReserved }