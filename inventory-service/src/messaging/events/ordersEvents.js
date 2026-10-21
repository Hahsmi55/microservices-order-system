const { publishEvent } = require("../producers/producer")
const { INVENTORY_EXCHANGE, INVENTORY_CANCELED_KEY, INVENTORY_RESERVED_KEY } = require("../topology/exchanges")
const { INVENTORY_CANCELED, INVENTORY_RESERVED } = require("../topology/events")

async function publishInventoryCanceled(params) {

    params.events = INVENTORY_CANCELED;

    await publishEvent(INVENTORY_EXCHANGE, INVENTORY_CANCELED_KEY, Buffer.from(JSON.stringify(params)));
}

async function publishInventoryReserved(params) {

    params.events = INVENTORY_RESERVED;

    await publishEvent(INVENTORY_EXCHANGE, INVENTORY_RESERVED_KEY, Buffer.from(JSON.stringify(params)));
}

module.exports = {
    publishInventoryCanceled,
    publishInventoryReserved
}