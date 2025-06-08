## Docker Setup for RabbitMQ (Exchange-Direct Branch)

RabbitMQ ko Docker ke saath chalane ke liye yeh steps follow karo, management plugin ke saath aur `admin:admin` credentials set karo. Yeh setup `exchange-direct` branch ke liye hai.

1. **RabbitMQ Image Pull Karo**:
   - Official RabbitMQ image with management plugin use karo:
     ```bash
     docker pull rabbitmq:3-management
     ```

2. **RabbitMQ Container Chalo**:
   - `admin` user aur `admin` password ke saath container start karo:
     ```bash
     docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 \
       -e RABBITMQ_DEFAULT_USER=admin \
       -e RABBITMQ_DEFAULT_PASS=admin \
       rabbitmq:3-management
     ```
   - **Samjhao**:
     - `-d`: Container ko background mein chalata hai.
     - `--name rabbitmq`: Container ka naam rakhta hai.
     - `-p 5672:5672`: AMQP port map karta hai (client connections ke liye).
     - `-p 15672:15672`: Management plugin ka port map karta hai (web UI ke liye).
     - `-e RABBITMQ_DEFAULT_USER=admin`: Default user `admin` set karta hai.
     - `-e RABBITMQ_DEFAULT_PASS=admin`: Password `admin` set karta hai (jo code mein use hua hai).
     - `rabbitmq:3-management`: Management plugin wala RabbitMQ image.

3. **Check Karo RabbitMQ Chal Raha Hai**:
   - Container chal raha hai ya nahi dekho:
     ```bash
     docker ps
     ```
   - RabbitMQ management UI ko `http://localhost:15672` pe access karo, `admin:admin` credentials se.
   - Confirm karo AMQP connection `amqp://localhost:5672` pe available hai.

4. **Container Stop ya Remove Karo** (optional):
   - Container stop karne ke liye:
     ```bash
     docker stop rabbitmq
     ```
   - Container remove karne ke liye:
     ```bash
     docker rm rabbitmq
     ```

# 📢 Fanout Exchange in RabbitMQ with Node.js (Hinglish)

Ye README file explain karti hai **Fanout Exchange** ko RabbitMQ ke saath Node.js mein. Yeh exchange type broadcasting ke liye perfect hoti hai — ek message bhejo, aur jitne bhi consumers bound hain, sabko milega!

---

## 🧠 Fanout Exchange Kya Hai?

Fanout exchange ka kaam hota hai message ko **broadcast** karna sabhi queues me jo us exchange se **bind** hain, bina kisi routing key ke.

### 🪄 Key Points:

* Routing key matter nahi karti.
* Exchange se bind hui har queue ko message milta hai.
* Perfect for: **Logs**, **Notifications**, **Real-time updates**

---

## 🔧 Producer Example

```js
const amqplib = require('amqplib');

const sendFanoutMail = async () => {
    const connection = await amqplib.connect('amqp://admin:admin@localhost');
    const channel = await connection.createChannel();

    const exchange = 'mail_exchange_fanout';

    const message = {
        title: 'Fanout Mail',
        body: 'This mail goes to every consumer bound to the fanout exchange'
    };

    await channel.assertExchange(exchange, 'fanout', { durable: true });

    channel.publish(exchange, '', Buffer.from(JSON.stringify(message)));

    console.log('📨 Fanout mail broadcasted');
    await channel.close();
    await connection.close();
};

sendFanoutMail();
```

### ✨ Kya Ho Raha Hai Yahan?

* Ek fanout exchange create ho raha hai.
* Message sab queues tak jaata hai jo is exchange se bind hain.
* Routing key blank hai kyunki fanout mein zarurat nahi hoti.

---

## 📨 Consumer Example

```js
const amqplib = require('amqplib');

const receiveFanoutMail = async () => {
    const connection = await amqplib.connect('amqp://admin:admin@localhost');
    const channel = await connection.createChannel();

    const exchange = 'mail_exchange_fanout';

    await channel.assertExchange(exchange, 'fanout', { durable: true });

    const { queue } = await channel.assertQueue('', { exclusive: true });

    await channel.bindQueue(queue, exchange, '');

    channel.consume(queue, (msg) => {
        if (msg) {
            console.log('📬 Fanout Received:', JSON.parse(msg.content.toString()));
            channel.ack(msg);
        }
    });

    console.log('🔄 Waiting for fanout messages...');
};

receiveFanoutMail();
```

### 🧾 Kya Seekha?

* **Exclusive queue** sirf ek consumer ke liye hoti hai.
* RabbitMQ khud ek random queue name generate karta hai.
* Jab consumer disconnect hota hai, queue auto-delete ho jaati hai.

---

## 📌 Summary

| Feature                 | Value                       |
| ----------------------- | --------------------------- |
| Exchange Type           | `fanout`                    |
| Routing Key Required    | ❌ No                        |
| Broadcast to All Queues | ✅ Yes                       |
| Use Case                | Logs, Notifications, Events |

---

## 🛠 Run Karne ke Steps

### 1. Install dependencies

```bash
npm install amqplib
```

### 2. RabbitMQ Docker se chalayein

```bash
docker run -d --hostname rabbit --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

* Dashboard: [http://localhost:15672](http://localhost:15672)
  Username: `guest`, Password: `guest`

### 3. Run producer

```bash
node admin.js
```

### 4. Run one or more consumers

```bash
node user-mail/consumer.js
node user-sms/consumer.js
```

---