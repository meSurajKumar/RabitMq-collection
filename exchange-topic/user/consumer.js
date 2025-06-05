const amqplib = require('amqplib')


const recieveMail = async()=>{
    try {
        const connection = await amqplib.connect('amqp://admin:admin@localhost');
        const channel = await connection.createChannel();
        const exchange = 'mail_exchange_topic';
        const queue = 'mail_topic_queue';


        await channel.assertExchange(exchange,'topic',{durable : true});
        await channel.assertQueue(queue , {durable:true});

        // Bind with a pattern const routingKey = 'mail.info.sucess';

        await channel.bindQueue(queue , exchange , 'mail.*.sucess.#');

        await channel.consume(queue , (message)=>{
            console.log(`Received > `, JSON.parse(message.content))
            channel.ack(message)
        })


    } catch (error) {
        console.log(error)
    }

}

module.exports = {recieveMail};