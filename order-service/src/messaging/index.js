const { getChannel } = require("../messaging/rabbitmq/connection")
const { consumer } = require("../messaging/consumers/consumer")
const { PAYMENT_QUEUE, INVENTORY_QUEUE, ORDER_QUEUE } = require("../messaging/topology/queues")
const { ORDER_EXCHANGE, INVENTORY_EXCHANGE, PAYMENT_EXCHANGE, INVENTORY_CANCELED_KEY, PAYMENT_FAILED_KEY, INVENTORY_RESERVED_KEY, PAYMENT_SUCCEDED_KEY } = require("../messaging/topology/exchanges")
const { ORDER_CREATED_KEY, ORDER_CANCELED_KEY } = require("../messaging/topology/exchanges")

async function startRabbit() {
    
    let { channel, connection } = await getChannel();


    await channel.assertQueue( INVENTORY_QUEUE , { durable : true })
    await channel.assertQueue( ORDER_QUEUE , { durable : true })
    await channel.assertQueue( PAYMENT_QUEUE , { durable : true })

    await channel.assertExchange( ORDER_EXCHANGE , 'topic', { durable : true })
    await channel.assertExchange( INVENTORY_EXCHANGE , 'topic', { durable : true })
    await channel.assertExchange( PAYMENT_EXCHANGE , 'topic', { durable : true })

    await channel.bindQueue( INVENTORY_QUEUE , ORDER_EXCHANGE, ORDER_CREATED_KEY )
    await channel.bindQueue( INVENTORY_QUEUE , ORDER_EXCHANGE, ORDER_CANCELED_KEY )
    await channel.bindQueue ( PAYMENT_QUEUE , ORDER_EXCHANGE, ORDER_CANCELED_KEY)
    await channel.bindQueue( PAYMENT_QUEUE, INVENTORY_EXCHANGE, INVENTORY_RESERVED_KEY )
    await channel.bindQueue( ORDER_QUEUE, INVENTORY_EXCHANGE, INVENTORY_CANCELED_KEY )
    await channel.bindQueue( INVENTORY_QUEUE, PAYMENT_EXCHANGE, PAYMENT_FAILED_KEY )
    await channel.bindQueue( ORDER_QUEUE, PAYMENT_EXCHANGE, PAYMENT_FAILED_KEY )
    await channel.bindQueue( ORDER_QUEUE, PAYMENT_EXCHANGE, PAYMENT_SUCCEDED_KEY )

    consumer(ORDER_QUEUE);
}

module.exports = { startRabbit }




