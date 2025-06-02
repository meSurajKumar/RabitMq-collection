const amqp = require('amqplib');

async function sendMail(){
    try {
        // First step is create the connection
        const connection = await amqp.connect('amqp://admin:admin@localhost');
        // second step create channel
        const channel = await connection.createChannel();

        // Create a Exchange name
        const exchange = 'mail_exchange';
        // Create Routing key
        const routingKey = 'sub_send_mail';
        const unsubsRoutingKey = 'unsub_send_mail'

        const subsMailQueue = 'sub_mail_queue'
        const nonNubsMailQueue = 'non_sub_mail_queue'


        // For now this is hard coded message
        const message = {
            to : 'recharge kr le@gmail.com',
            from :'reciver@gmail.com',
            subject : 'This message for the consumer',
            body : 'Hi ,kb tk thanks for subscribing',
        }
        // const message_num_subs = {
        //     to : 'grib@gmail.com',
        //     from :'reciver@gmail.com',
        //     subject : 'This message for the consumer',
        //     body : 'Hi , Please subscribe',
        // }

        // now We will create exchange
        await channel.assertExchange(exchange , "direct", {durable : false});
        await channel.assertQueue(subsMailQueue, {durable:false}); // creating Queue
        await channel.assertQueue(nonNubsMailQueue, {durable:false}); // creating Queue
        await channel.bindQueue(subsMailQueue , exchange , routingKey); // for subcribe user
        await channel.bindQueue(nonNubsMailQueue , exchange , unsubsRoutingKey); // for subcribe non user

        // channel.publish(exchange , routingKey , Buffer.from(JSON.stringify(message_subs)));


        /// Here just change the routing key to send the meesagse to sub and ub subs users
        channel.publish(exchange , unsubsRoutingKey , Buffer.from(JSON.stringify(message)));
        console.log('Mail data was sent  ', message)
        // console.log('Mail data was sent message_num_subs> ', message_num_subs)

        setTimeout(()=>{
            channel.close()
        },500)


    } catch (error) {
        console.log('Error > ', error)
    }

};

sendMail();