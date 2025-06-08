const amqplib = require('amqplib');


const sendFanoutMail = async()=>{
    const connection = await amqplib.connect('amqp://admin:admin@localhost');
    const channel = await connection.createChannel();

    // create exchnage name
    const exchange = 'mail_exchnage_fanout';
    const message = {
        title : 'This message is to all the user in this platform',
        body : 'Thanks for using our platform'
    }

    // creating the exchange 
    await channel.assertExchange(exchange , 'fanout', {durable : true});

    // fanout me routing key ki required ni hoti hai
    channel.publish(exchange,'',Buffer.from(JSON.stringify(message)));

    console.log('message broadcast to all users');

    await channel.close();
    await connection.close();
}


module.exports = {sendFanoutMail};