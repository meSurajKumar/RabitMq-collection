# RabbitMQ Email Messaging System (Hinglish)

Yeh project ek simple email messaging system hai jo **RabbitMQ** (ek message broker) use karta hai admin (producer) aur user (consumer) ke beech communication ke liye. Ismein do Node.js applications hain:

1. **Admin (Producer)**: Email messages ko RabbitMQ queue mein bhejta hai.
2. **User (Consumer)**: Queue se messages receive karta hai aur process karta hai.

**Exchange Type**: Is project mein **direct** exchange type use kiya gaya hai. Direct exchange ka matlab hai ki message sirf usi queue mein jata hai jiska routing key exact match karta hai. Yeh fast aur specific message routing ke liye useful hai, kyunki message direct us queue tak jata hai jiska routing key message ke routing key se milta hai.

Dono apps `amqplib` library use karti hain RabbitMQ se connect karne ke liye, `express` server banane ke liye, aur `nodemon` development ke liye.

## Docker Setup for RabbitMQ

RabbitMQ ko Docker ke saath chalane ke liye yeh steps follow karo, management plugin ke saath aur `admin:admin` credentials set karo.

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

## RabbitMQ Setup (Agar Docker Nahi Use Kar Rahe)

Agar Docker nahi use karna chahte, toh RabbitMQ ko manually install karo:
- [Official RabbitMQ installation guide](https://www.rabbitmq.com/download.html) follow karo.
- Ensure karo ki RabbitMQ `amqp://admin:admin@localhost` pe chal raha hai. Agar credentials alag hain, toh `producer.js` aur `consumer.js` mein connection string update karo.

## Prerequisites (Jaruri Cheezein)

Is project ko chalane ke liye yeh chahiye:

1. **Node.js**: Version 14 ya usse upar recommended.
2. **RabbitMQ Server**: Upar bataye Docker steps ya local installation se setup karo.
3. **Docker** (optional): Agar RabbitMQ container mein chalana hai, toh Docker install karo ([official guide](https://docs.docker.com/get-docker/)).
4. **Dependencies** (dono `package.json` mein hain):
   - `amqplib`: RabbitMQ ke liye Node.js library.
   - `express`: Server banane ka framework.
   - `nodemon`: Development ke waqt server auto-restart ke liye.

## Project Structure

- **Admin (Producer)**:
  - `package.json`: Dependencies aur scripts define karta hai.
  - `producer.js`: RabbitMQ se connect aur email messages bhejne ka logic.
  - `index.js`: Express server set karta hai aur har second `sendMail` call karta hai.

- **User (Consumer)**:
  - `package.json`: Dependencies aur scripts define karta hai.
  - `consumer.js`: RabbitMQ se connect aur messages receive karne ka logic.
  - `index.js`: Express server set karta hai aur message consume start karta hai.

## Setup Instructions (Node.js Apps)

1. **Project Setup Karo**:
   - Do alag directories banao: `admin` aur `user`.
   - Har directory mein respective `package.json`, `index.js`, aur `producer.js`/`consumer.js` files rakho.

2. **Dependencies Install Karo**:
   - `admin` directory mein jao aur run karo:
     ```bash
     npm install
     ```
   - `user` directory mein jao aur run karo:
     ```bash
     npm install
     ```

3. **Apps Chalo**:
   - Admin (producer) app start karo:
     ```bash
     npm run dev
     ```
     Yeh port `3000` pe server chalayega aur har second message bhejega.
   - User (consumer) app start karo:
     ```bash
     npm run dev
     ```
     Yeh port `3001` pe server chalayega aur messages listen karega.

## Code Samjhao

# Exchange Type: Direct

Is project mein **direct exchange** (`mail_exchange`) use kiya gaya hai. Direct exchange ka kaam hai message ko us queue mein bhejna jiska routing key exact match karta hai. Yani, `mail_routing_key` wala message sirf `mail_queue` mein jayega kyunki queue is routing key se bind hai. Yeh efficient hai jab aapko specific queue mein message bhejna ho bina kisi complex routing ke.

**Direct Exchange ka Explanation**:
- **Kaise Kaam Karta Hai**: Jab producer message bhejta hai, woh exchange ke saath routing key deta hai (`mail_routing_key`). Exchange check karta hai ki kaunsa queue is routing key se bind hai, aur message usi queue mein bhejta hai.
- **Fayda**: Fast aur targeted message delivery, kyunki message sirf ek hi queue mein jata hai.
- **Is Project Mein**: `mail_exchange` direct type ka hai, jo `mail_queue` ko `mail_routing_key` ke saath bind karta hai, aur messages direct is queue mein jate hain.

### Admin (Producer) Application

#### `package.json`
- Dependencies: `amqplib`, `express`, `nodemon`.
- `dev` script: `nodemon index.js` server ko auto-reload ke saath chalata hai.

#### `producer.js`
- **Kaam**: RabbitMQ se connect karta hai, direct exchange aur queue banata hai, unhe routing key se bind karta hai, aur email messages publish karta hai.
- **Main Parts**:
  - **Connection**: `amqp.connect('amqp://admin:admin@localhost')` se RabbitMQ se connect.
  - **Channel**: Communication ke liye channel banata hai.
  - **Exchange aur Queue**:
    - Direct exchange (`mail_exchange`) banata hai, `durable: false` (non-persistent).
    - Queue (`mail_queue`) banata hai, `durable: false`.
    - Queue ko `mail_routing_key` se exchange se bind karta hai.
  - **Message**: `to`, `from`, `subject`, aur `body` fields ka message object banata hai. `to` mein random number daalta hai (`Math.random(6)` galat hai—neeche Notes dekho).
  - **Publishing**: Message ko JSON string mein convert karke `channel.publish` se bhejta hai.
- **Execution**: `sendMail` function export hota hai aur `index.js` se har second call hota hai.

#### `index.js`
- Port `3000` pe Express server set karta hai.
- `setInterval` se `sendMail` ko har 1 second mein call karta hai.

### User (Consumer) Application

#### `package.json`
- Admin ke jaisa, dependencies aur `dev` script define karta hai.

#### `consumer.js`
- **Kaam**: RabbitMQ se connect, `mail_queue` se messages sunta hai, aur log karta hai.
- **Main Parts**:
  - **Connection**: Producer ke same credentials se connect.
  - **Channel**: Communication ke liye channel.
  - **Queue**: `mail_queue` ko `durable: false` ke saath assert karta hai.
  - **Consumption**: `channel.consume` se messages sunta hai aur JSON parse karke log karta hai.
- **Note**: Messages acknowledge nahi hote, isliye queue mein reh sakte hain. `channel.ack(message)` add karo.

#### `index.js`
- Port `3001` pe Express server set karta hai.
- `receiveMails` call karta hai taaki queue se messages consume ho.

## Kaise Kaam Karta Hai

1. **Admin** (producer) messages RabbitMQ ko bhejta hai:
   - Messages `mail_exchange` (direct exchange) pe `mail_routing_key` ke saath publish hote hain.
   - Exchange messages ko `mail_queue` mein bhejta hai.
2. **User** (consumer) `mail_queue` se messages sunta hai:
   - Messages consume karta hai aur JSON parse karke log karta hai.
3. **Direct Exchange**: Messages sirf us queue mein jate hain jiska routing key match karta hai.

## Notes aur Improvements

1. **Random Number Issue**:
   - `producer.js` mein `Math.random(6)` galat hai (koi argument nahi leta). Use `Math.floor(Math.random() * 6) + 1` for 1-6 range.
   - `to` field mein random number email system ke liye practical nahi. Valid email address use karo.

2. **Message Acknowledgment**:
   - Consumer messages acknowledge nahi karta, isse queue buildup ho sakta hai. `channel.ack(message)` add karo.

3. **Connection Handling**:
   - Connection/channel close nahi hote, resource leak ho sakta hai. `connection.close()` add karo `finally` block mein.

4. **Error Handling**:
   - Basic error logging hai. Retry logic jaise robust handling add karo.

5. **Durable Queues/Exchanges**:
   - `durable: false` se queue/exchange RabbitMQ restart pe delete ho jate hain. `durable: true` set karo agar chahiye.

6. **Express Server**:
   - Servers minimal hain. API endpoints add kar sakte ho (jaise message bhejne ke liye).

## System Chalao

1. RabbitMQ Docker ya local installation se start karo.
2. Ek terminal mein `admin` directory mein:
   ```bash
   npm run dev
   ```
3. Dusre terminal mein `user` directory mein:
   ```bash
   npm run dev
   ```
4. Console output dekho:
   - Admin: `Your mail was sent` har second.
   - User: Messages log karega (jaise `Message > { to: <random_number>, from: 'admin@gmail.com', ... }`).

## Troubleshooting

- **Connection Errors**: RabbitMQ chal raha hai aur credentials (`admin:admin@localhost`) sahi hain check karo. Docker mein container aur ports `5672`, `15672` check karo. Management console `http://localhost:15672` pe dekho.
- **No Messages**: Exchange, queue, aur routing key names match karo.
- **Dependencies**: Dono directories mein `npm install` chala do.
- **Docker Issues**: Docker chalu ho aur image sahi pull hua ho. `docker logs rabbitmq` se logs dekho.

Yeh project RabbitMQ ke direct exchange ka basic example hai. Ise message acknowledgment, multiple queues, ya robust email system se extend kar sakte ho.