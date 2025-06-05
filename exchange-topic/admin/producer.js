const amqplib = require('amqplib')


const sendMail = async()=>{
    try {
        const connection = await amqplib.connect('amqp://admin:admin@localhost')
        const channel = await connection.createChannel();

        // Giving the name to exchange
        const exchange = 'mail_exchange_topic';
        const routingKey = 'mail.info.sucess';

        const message = {
            to: '',
            from: 'admin@gmail.com',
            subject: 'Congrats!',
            body: 'Welcome to topic exchange mail'
        };

        message['to'] = Math.random(4)
        
        await channel.assertExchange(exchange , 'topic' , {durable : true});
        await channel.publish(exchange , routingKey, Buffer.from(JSON.stringify(message)));

        console.log('Topic mail send')
    } catch (error) {
        console.log(error)
    }
}

module.exports = {sendMail}