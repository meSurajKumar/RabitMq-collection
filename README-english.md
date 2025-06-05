# RabbitMQ Email Messaging System - Exchange-Direct Branch

This project demonstrates a simple email messaging system using **RabbitMQ** with a **topic** exchange type to facilitate communication between a producer (admin) and a consumer (user). It consists of two Node.js applications:

1. **Admin (Producer)**: Sends email messages to a RabbitMQ queue via a topic exchange.
2. **User (Consumer)**: Receives and processes messages from the queue.

**Exchange Type**: This project uses a **topic** exchange (`mail_exchange_topic`). A topic exchange routes messages to queues based on pattern matching of the routing key, such as `mail.info.*` or `mail.*.success`, allowing flexible and scalable message distribution.

The applications use the `amqplib` library for RabbitMQ interactions, `express` for a basic server, and `nodemon` for development.

## Docker Setup for RabbitMQ (Exchange-Direct Branch)

To run RabbitMQ using Docker for the `exchange-direct` branch, follow these steps to set up a container with the management plugin and `admin:admin` credentials.

1. **Pull the RabbitMQ Image**:
   - Use the official RabbitMQ image with the management plugin:
     ```bash
     docker pull rabbitmq:3-management
     ```

2. **Run RabbitMQ Container**:
   - Start a container with the default user `admin` and password `admin`:
     ```bash
     docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 \
       -e RABBITMQ_DEFAULT_USER=admin \
       -e RABBITMQ_DEFAULT_PASS=admin \
       rabbitmq:3-management
     ```
   - **Explanation**:
     - `-d`: Runs the container in detached mode.
     - `--name rabbitmq`: Names the container for reference.
     - `-p 5672:5672`: Maps the AMQP port for client connections.
     - `-p 15672:15672`: Maps the management plugin port for the web UI.
     - `-e RABBITMQ_DEFAULT_USER=admin`: Sets the default user to `admin`.
     - `-e RABBITMQ_DEFAULT_PASS=admin`: Sets the password to `admin` (matches the code).
     - `rabbitmq:3-management`: Uses the RabbitMQ image with the management plugin.

3. **Verify RabbitMQ is Running**:
   - Check if the container is running:
     ```bash
     docker ps
     ```
   - Access the RabbitMQ management UI at `http://localhost:15672` using `admin:admin` credentials.
   - Confirm the AMQP connection is available at `amqp://localhost:5672`.

4. **Stop or Remove the Container** (optional):
   - Stop the container:
     ```bash
     docker stop rabbitmq
     ```
   - Remove the container:
     ```bash
     docker rm rabbitmq
     ```

## Project Setup (Exchange-Direct Branch)

This setup is for the `exchange-direct` branch, configuring Node.js applications to work with RabbitMQ’s topic exchange.

1. **Set Up the Project**:
   - Create two directories: `admin` and `user`.
   - Place `package.json`, `index.js`, and `producer.js` in the `admin` directory.
   - Place `package.json`, `index.js`, and `consumer.js` in the `user` directory.
   - Ensure both `package.json` files include dependencies: `amqplib`, `express`, `nodemon`.

2. **Install Dependencies**:
   - Navigate to the `admin` directory and run:
     ```bash
     npm install
     ```
   - Navigate to the `user` directory and run:
     ```bash
     npm install
     ```

## Exchange Type: Topic (Based on Code)

This project uses a **topic** exchange (`mail_exchange_topic`). A topic exchange routes messages to queues based on pattern matching of the routing key, enabling flexible message distribution to multiple queues.

**Topic Exchange Explanation (Based on Code)**:
- **How It Works**:
  - The producer (`producer.js`) sends a message to `mail_exchange_topic` with the routing key `mail.info.success`.
  - The topic exchange matches the routing key against queue bindings using patterns like `mail.info.*` (where `*` matches one word) or `mail.*.success`.
  - The consumer (`consumer.js`, assumed) listens to a queue bound to `mail_exchange_topic` with a pattern like `mail.info.*`, receiving messages with routing keys like `mail.info.success`.
- **In the Code**:
  - **Producer.js**:
    - Creates a topic exchange (`mail_exchange_topic`) with `durable: true` (persistent).
    - Publishes a message (email object) with the routing key `mail.info.success`.
    - The message includes `to`, `from`, `subject`, and `body` fields. The `to` field is set to a random number using `Math.random(4)` (incorrect—see Notes).
  - **Consumer.js** (assumed, adapted from previous):
    - Declares a queue (e.g., `mail_queue`) and binds it to `mail_exchange_topic` with a pattern like `mail.info.*`.
    - Consumes messages from the queue and logs their content.
- **Benefit**: Topic exchanges allow routing to multiple queues based on patterns, ideal for scenarios requiring categorized message delivery (e.g., success, error, or info messages).
- **In This Project**: The producer uses the routing key `mail.info.success`, and the consumer likely binds a queue with `mail.info.*` to receive success-related messages.

## Running the System

1. **Start RabbitMQ**:
   - Use Docker (steps above) or a local RabbitMQ installation.
   - Ensure RabbitMQ is running at `amqp://admin:admin@localhost`.

2. **Run the Admin (Producer)**:
   - Navigate to the `admin` directory and run:
     ```bash
     npm run dev
     ```
   - This starts the Express server on port `3000` and sends messages every second (via `setInterval` calling `sendMail` in `index.js`).

3. **Run the User (Consumer)**:
   - Navigate to the `user` directory and run:
     ```bash
     npm run dev
     ```
   - This starts the Express server on port `3001` and listens for messages on the queue.

4. **Check Output**:
   - The admin console logs `Topic mail send` every second.
   - The user console logs received messages, e.g., `Message > { to: <random_number>, from: 'admin@gmail.com', subject: 'Congrats!', body: 'Welcome to topic exchange mail' }`.

## Notes and Potential Improvements

1. **Random Number Issue**:
   - In `producer.js`, `Math.random(4)` is incorrect as `Math.random()` takes no arguments and returns a value between 0 and 1. Use `Math.floor(Math.random() * 4) + 1` for a 1-4 range.
   - The `to` field as a random number isn’t practical for an email system. Consider using a valid email address or dynamic value.

2. **Message Acknowledgment**:
   - The consumer (assumed) doesn’t acknowledge messages. Add `channel.ack(message)` in the `channel.consume` callback to remove messages from the queue.

3. **Connection Handling**:
   - Connections/channels aren’t closed, risking resource leaks. Add `connection.close()` in a `finally` block.

4. **Error Handling**:
   - Basic error logging exists. Add retry logic for robust error handling.

5. **Durable Exchange**:
   - The exchange is `durable: true`, which is good for persistence, but ensure queues are also durable to avoid data loss.

## Troubleshooting

- **Connection Errors**: Verify RabbitMQ is running and credentials (`admin:admin@localhost`) are corret. For Docker, check the container and ports `5672` and `15672`. Access the management UI at `http://localhost:15672`.
- **No Messages Received**: Ensure the exchange (`mail_exchange_topic`), queue, and routing key pattern (`mail.info.*`) match between producer and consumer.
- **Dependency Issues**: Run `npm install` in both directories.
- **Docker Issues**: Ensure Docker is running and the RabbitMQ image is pulled. Check logs with `docker logs rabbitmq`.

This project is a basic example of RabbitMQ’s topic exchange. It can be extended with multiple queues, complex routing patterns, or a robust email system.