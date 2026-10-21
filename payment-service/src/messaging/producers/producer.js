const { getChannel } = require("../rabbitmq/connection");

async function publishEvent(exchange, routingkey, data) {
    
    let { channel, connection } = await getChannel();

    channel.publish(exchange, routingkey, data,{ persistent : true, contentType : "application/json"});

    await channel.waitForConfirms();

}

module.exports = {
    publishEvent
}