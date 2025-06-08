const amqplib = require('amqplib');

const receiveBroadCastSms = async()=>{
    const connection = await amqplib.connect('amqp://admin:admin@localhost');
    const channel = await connection.createChannel();

    const exchange = 'mail_exchnage_fanout';

    await channel.assertExchange(exchange , 'fanout' , {durable : true});

    // now the temp queue

    // exclusive: true in RabbitMQ
    // When you declare a queue with { exclusive: true }, it means:
    
    // ✅ Only the current connection can use this queue.
    // ✅ The queue will be deleted automatically when the connection is closed.
    const {queue} = await channel.assertQueue('', {exclusive:true});

    await channel.bindQueue(queue , exchange , '');

    channel.consume(queue , (msg)=>{
        if(msg){
            console.log('Fanout boradcast msg' , JSON.parse(msg.content));
            channel.ack(msg);
        }
    });

};

module.exports = {receiveBroadCastSms};