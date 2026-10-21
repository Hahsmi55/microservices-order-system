const { getChannel } = require("../rabbitmq/connection")
const { PAYMENT_CANCELED, ORDER_CREATED } = require("../topology/events")
const{ orderCreated } = require("../handlres/orderCreated")
const{ orderCanceled } = require("../handlres/orderCanceled")
const{ paymentFailed } = require("../handlres/paymentFailed")

async function consumer(queue) {
    const { channel, connection } = await getChannel();

    channel.prefetch(5);

    channel.consume(queue, async (msg) => {
        try {
            const data = JSON.parse(msg.content.toString());

            const event = data.events;

            if (event === PAYMENT_CANCELED) {
                await paymentFailed(data);
            } 
            else if (event === ORDER_CREATED) {
                await orderCreated(data);
            } 
            else {
                await orderCanceled(data);
            }
            channel.ack(msg);

        } catch (error) {
            console.error("Consumer error:", error);

            channel.nack(msg, false, true);
        }
    });
}

module.exports = { consumer }