const { publishEvent } = require("../producers/producer")
const { ORDER_EXCHANGE, ORDER_CREATED_KEY, ORDER_CANCELED_KEY } = require("../topology/exchanges")
const { ORDER_CREATED, ORDER_CANCELED } = require("../topology/events")

async function publishOrderCreated(params) {

    params.events = ORDER_CREATED;

    await publishEvent(ORDER_EXCHANGE, ORDER_CREATED_KEY, Buffer.from(JSON.stringify(params)));
}

async function publishOrderCanceled(params) {

    params.events = ORDER_CANCELED;
    
    await publishEvent(ORDER_EXCHANGE, ORDER_CANCELED_KEY, Buffer.from(JSON.stringify(params)));
}

module.exports = {
    publishOrderCanceled,
    publishOrderCreated
}