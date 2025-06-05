const amqp = require('amqplib');


const  sendMail= async()=>{
    try {
        const connection = await amqp.connect('amqp://admin:admin@localhost');

        // creating channel
        const channel = await connection.createChannel();

        // Currently we are using the "Direct" exchange Type 
        const exchange = 'mail_exchange';
        // Creating the routing key
        const mailRoutingKey = 'mail_routing_key'
        // now creating the queue
        const mailQueue = 'mail_queue';

        const randomNumber = Math.random(6)

        const message = {
            to : '',
            from : 'admin@gmail.com',
            subject : 'This is the congrratulation mail',
            body : "Greeting from admin"
        }

        message['to'] = randomNumber

        // now creting the exchange
        await channel.assertExchange(exchange , "direct" , {durable : false});
        await channel.assertQueue(mailQueue , {durable:false});
        await channel.bindQueue(mailQueue , exchange , mailRoutingKey);
        channel.publish(exchange , mailRoutingKey , Buffer.from(JSON.stringify(message)))
        console.log('Your mail was sent')

        

    } catch (error) {
        console.log('Error > ',error)
    }

}

module.exports = {sendMail}