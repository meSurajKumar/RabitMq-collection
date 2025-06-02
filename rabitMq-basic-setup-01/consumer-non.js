const amqp = require('amqplib');


async function recMail() {
    try {
        // First step is create the connection
        const connection = await amqp.connect('amqp://admin:admin@localhost');
        // second step create channel
        const channel = await connection.createChannel();

        const nonNubsMailQueue = 'non_sub_mail_queue'

        await channel.assertQueue(nonNubsMailQueue, {durable : false});

        channel.consume(nonNubsMailQueue, (message)=>{
            if(message != null){
                console.log('Message : ', JSON.parse(message.content))
            }else{
                console.log('no messgage')
            }
        })


    } catch (error) {
        console.log('Error > ', error)
    }



}

recMail();