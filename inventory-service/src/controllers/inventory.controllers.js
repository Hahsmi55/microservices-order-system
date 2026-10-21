const e = require("express");
const prisma = require("../config/prisma.config")

async function addInventory(req, res) {
    
    const { stock , productId} = req.body;

    try {
        
        const addedInventory = await prisma.inventory.create({
        data : {
            productId,
            stock
        }
    })

    res.json({ addedInventory })

    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }
}


async function addProduct(req, res) {
    
    const { name, description } = req.body;
    try {

        const addedProduct = await prisma.products.create({
        data : {
            name ,
            description
        }
    })

    res.json({ addedProduct })

    } catch (error) {
        console.log("error", error)
    }
}

async function updateInventory(req, res) {
    
    const { inventoryId , stock} = req.body;

    const updatedInventory = await prisma.inventory.update({
        where: {
            iID : inventoryId,
        },
        data: {
            stock: {
                increment : stock,
            },
        },
    });

    res.json(updatedInventory)
}

module.exports = { addInventory , addProduct ,  updateInventory };