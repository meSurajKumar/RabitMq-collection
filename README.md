# RabbitMQ Email Messaging System - Exchange-Topic Branch (Hinglish)

Yeh project ek simple email messaging system hai jo **RabbitMQ** ke **topic** exchange type ka use karta hai admin (producer) aur user (consumer) ke beech messages bhejne ke liye. Ismein do Node.js applications hain:

1. **Admin (Producer)**: Email messages ko RabbitMQ queue mein bhejta hai `topic` exchange ke through.
2. **User (Consumer)**: Queue se messages receive karta hai aur process karta hai.

**Exchange Type**: Yeh project **topic** exchange type use karta hai (`mail_exchange_topic`). Topic exchange messages ko routing key ke pattern ke basis pe queues mein bhejta hai, jaise `mail.info.*` ya `mail.*.success`. Yeh flexible routing ke liye useful hai jab aapko multiple queues mein messages bhejna ho based on patterns.

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

## Project Setup (Exchange-Direct Branch)

Yeh setup `exchange-direct` branch ke liye hai. Ismein RabbitMQ ke saath Node.js applications set up karna hai jo topic exchange ke saath kaam karti hain.

1. **Project Setup Karo**:
   - Do alag directories banao: `admin` aur `user`.
   - `admin` mein `package.json`, `index.js`, aur `producer.js` rakho.
   - `user` mein `package.json`, `index.js`, aur `consumer.js` rakho.
   - Dono `package.json` mein dependencies hona chahiye: `amqplib`, `express`, `nodemon`.

2. **Dependencies Install Karo**:
   - `admin` directory mein jao aur run karo:
     ```bash
     npm install
     ```
   - `user` directory mein jao aur run karo:
     ```bash
     npm install
     ```

## Exchange Type: Topic (Code ke Hisaab se)

Is project mein **topic** exchange (`mail_exchange_topic`) use kiya gaya hai. Topic exchange messages ko routing key ke pattern ke basis pe queues mein bhejta hai. Yeh flexible hai jab aapko ek se zyada queues mein messages route karna ho based on specific patterns.

**Topic Exchange ka Explanation (Code ke Hisaab se)**:
- **Kaise Kaam Karta Hai**:
  - Producer (`producer.js`) ek message bhejta hai `mail_exchange_topic` pe with routing key `mail.info.success`.
  - Topic exchange is routing key ko check karta hai aur us queue mein message bhejta hai jiska binding key pattern match karta hai, jaise `mail.info.*` (jahan `*` ek word ko represent karta hai).
  - Consumer (`consumer.js`) ek queue se messages sunta hai jo `mail_exchange_topic` se bind hai, likely `mail.info.*` pattern ke saath, toh woh `mail.info.success` wale messages receive karta hai.
- **Code mein**:
  - **Producer.js**: 
    - Exchange `mail_exchange_topic` banata hai, type `topic`, aur `durable: true` (persistent).
    - Message (email object) ko `mail.info.success` routing key ke saath publish karta hai.
    - Message mein `to`, `from`, `subject`, aur `body` fields hain. `to` field mein random number daalta hai (`Math.random(4)`, jo galat hai—neeche Notes dekho).
  - **Consumer.js** (assumed, kyunki code nahi diya):
    - Queue banata hai (jaise `mail_queue`) aur usse `mail_exchange_topic` se bind karta hai with pattern `mail.info.*`.
    - Messages consume karta hai aur unka content log karta hai.
- **Fayda**: Topic exchange multiple queues mein messages bhej sakta hai based on patterns, jaise `mail.info.*` ya `mail.*.success`, jo flexible routing deta hai.
- **Is Project Mein**: Producer `mail.info.success` routing key use karta hai, aur consumer likely `mail.info.*` pattern se messages sunta hai, jisse woh success-related messages receive karta hai.

## System Chalao

1. **RabbitMQ Start Karo**:
   - Docker se RabbitMQ chalo (upar bataye steps) ya local installation use karo.
   - Ensure karo RabbitMQ `amqp://admin:admin@localhost` pe chal raha hai.

2. **Admin (Producer) Chalo**:
   - `admin` directory mein jao aur run karo:
     ```bash
     npm run dev
     ```
   - Yeh Express server port `3000` pe chalayega aur har second message bhejega (`index.js` mein `setInterval` ke through `sendMail` call hota hai).

3. **User (Consumer) Chalo**:
   - `user` directory mein jao aur run karo:
     ```bash
     npm run dev
     ```
   - Yeh Express server port `3001` pe chalayega aur `mail_queue` se messages listen karega.

4. **Output Dekho**:
   - Admin console mein har second `Topic mail send` dikhega.
   - User console mein received messages dikhega, jaise `Message > { to: <random_number>, from: 'admin@gmail.com', subject: 'Congrats!', body: 'Welcome to topic exchange mail' }`.

## Notes aur Improvements

1. **Random Number Issue**:
   - `producer.js` mein `Math.random(4)` galat hai kyunki `Math.random()` koi argument nahi leta aur 0 se 1 ke beech value deta hai. Iske bajay `Math.floor(Math.random() * 4) + 1` use karo for 1-4 range.
   - `to` field mein random number email system ke liye practical nahi. Valid email address ya dynamic value use karo.

2. **Message Acknowledgment**:
   - Consumer messages acknowledge nahi karta (assumed code ke basis pe). `channel.ack(message)` add karo taaki messages queue se remove ho.

3. **Connection Handling**:
   - Connection/channel close nahi hota, resource leak ho sakta hai. `connection.close()` ko `finally` block mein add karo.

4. **Error Handling**:
   - Basic error logging hai. Retry logic ya robust error handling add karo.

5. **Durable Exchange**:
   - Exchange `durable: true` hai, jo good hai for persistence, lekin queue bhi durable hona chahiye agar data loss nahi chahiye.

## Troubleshooting

- **Connection Errors**: Ensure karo RabbitMQ chal raha hai aur credentials (`admin:admin@localhost`) sahi hain. Docker mein ports `5672` aur `15672` check karo. Management UI `http://localhost:15672` pe dekho.
- **No Messages**: Exchange (`mail_exchange_topic`), queue, aur routing key pattern (`mail.info.*`) match karo producer aur consumer mein.
- **Dependencies**: Dono directories mein `npm install` chala do.
- **Docker Issues**: Docker chalu ho aur image sahi pull hua ho. `docker logs rabbitmq` se logs check karo.

Yeh project RabbitMQ ke topic exchange ka basic example hai. Ise multiple queues, complex routing patterns, ya robust email system ke saath extend kar sakte ho.