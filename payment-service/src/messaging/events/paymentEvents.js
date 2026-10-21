const { publishEvent } = require("../producers/producer")
const { PAYMENT_FAILED_KEY, PAYMENT_SUCCEDED_KEY } = require("../topology/exchanges")
const { PAYMENT_EXCHANGE } = require("../topology/exchanges")
const { PAYMENT_FAILED, PAYMENT_SUCCEDED } = require("../topology/events")

async function publishPaymentFailed(params) {

    params.events = PAYMENT_FAILED;

    await publishEvent(PAYMENT_EXCHANGE, PAYMENT_FAILED_KEY, Buffer.from(JSON.stringify(params)));
}


async function publishPaymentSucceded(params) {

    params.events = PAYMENT_SUCCEDED;
    
    await publishEvent(PAYMENT_EXCHANGE, PAYMENT_SUCCEDED_KEY, Buffer.from(JSON.stringify(params)));
}


module.exports = {
    publishPaymentFailed,
    publishPaymentSucceded
}