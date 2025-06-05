const amqp = require('amqplib');

const receiveMails = async()=>{
    try {
        const connection = await amqp.connect('amqp://admin:admin@localhost');
        const channel = await connection.createChannel();

        // now creating the queue
        const mailQueue = 'mail_queue'; 

        await channel.assertQueue(mailQueue,{durable:false});
        channel.consume(mailQueue , (message)=>{
            if(message != null){
                console.log('Message > ', JSON.parse(message.content))
            }else{
                console.log('No message')
            }
        })



    } catch (error) {
        console.log('Error > ',error)
    }



}


module.exports = {receiveMails}