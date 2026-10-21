const { getChannel } = require("../rabbitmq/connection")
const { INVENTORY_CANCELED, INVENTORY_RESERVED, PAYMENT_SUCCEDED,  } = require("../topology/events")
const{ inventoryFailed , inventoryReserved } = require("../handlres/inventoryHandler")
const{ paymentFailed , paymentSucceeded } = require("../handlres/paymentHandler")

async function consumer(queue) {
    const { channel, connection } = await getChannel();

    channel.prefetch(5);

    channel.consume(queue, async (msg) => {
        try {
            const data = JSON.parse(msg.content.toString());

            const event = data.events;

            if (event === INVENTORY_CANCELED) {
                await inventoryFailed(data);
            }
            else if ( event === INVENTORY_RESERVED) {
                await inventoryReserved(data);
            }
            else if ( event === PAYMENT_SUCCEDED) {
                await paymentSucceeded(data);
            }
            else {
                await paymentFailed(data);
            }
            channel.ack(msg);

        } catch (error) {
            console.error("Consumer error:", error);

            channel.nack(msg, false, true);
        }
    });
}

module.exports = { consumer }