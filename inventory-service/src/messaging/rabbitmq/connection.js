const amqp = require("amqplib")

async function getChannel() {
    
    let connection , channel;

    try {
        
        connection = await amqp.connect(process.env.RABBIT_URL);
        channel = await connection.createConfirmChannel();
        

        return { channel, connection }
        
    } catch (error) {
        console.log("Rabbit connection error ", error )
    }
}

module.exports = { getChannel };