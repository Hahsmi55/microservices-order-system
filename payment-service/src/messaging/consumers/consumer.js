const { getChannel } = require("../rabbitmq/connection")
const { ORDER_CANCELED, INVENTORY_RESERVED } = require("../topology/events")
const { inventoryHandler } = require("../handlres/inventoryHandler")


async function consumer(queue) {
    const { channel, connection } = await getChannel();

    channel.prefetch(5);

    channel.consume(queue, async (msg) => {
        try {
            const data = JSON.parse(msg.content.toString());

            const event = data.events;
            
            if (event === INVENTORY_RESERVED){
                await inventoryHandler(data);
            }

            channel.ack(msg);

        } catch (error) {
            console.error("Consumer error:", error);

            channel.nack(msg, false, true);
        }
    });
}

module.exports = { consumer }