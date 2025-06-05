# RabbitMQ Email Messaging System

This project demonstrates a simple email messaging system using **RabbitMQ**, a message broker, to enable communication between a producer (admin) and a consumer (user). It consists of two Node.js applications:

1. **Admin (Producer)**: Sends email messages to a RabbitMQ queue.
2. **User (Consumer)**: Receives and processes messages from the queue.

**Exchange Type**: This project uses a **direct** exchange type. A direct exchange routes messages to a queue only if the routing key exactly matches the queue’s binding key. This ensures fast and precise message delivery to the intended queue.

The applications use the `amqplib` library to interact with RabbitMQ, `express` for creating a basic server, and `nodemon` for development.

## Docker Setup for RabbitMQ

To run RabbitMQ using Docker, follow these steps to set up a container with the management plugin enabled and configure the `admin:admin` credentials used in the code.

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
     - `--name rabbitmq`: Names the container for easy reference.
     - `-p 5672:5672`: Maps the AMQP port for client connections (used by `amqplib`).
     - `-p 15672:15672`: Maps the management plugin port for the web UI.
     - `-e RABBITMQ_DEFAULT_USER=admin`: Sets the default user to `admin`.
     - `-e RABBITMQ_DEFAULT_PASS=admin`: Sets the password to `admin` (matches the code’s connection string).
     - `rabbitmq:3-management`: Uses the RabbitMQ image with the management plugin.

3. **Verify RabbitMQ is Running**:
   - Check if the container is running:
     ```bash
     docker ps
     ```
   - Access the RabbitMQ management UI at `http://localhost:15672` using `admin:admin` credentials.
   - Confirm the AMQP connection is available at `amqp://localhost:5672`.

4. **Stop or Remove the Container** (optional):
   - To stop the container:
     ```bash
     docker stop rabbitmq
     ```
   - To remove the container:
     ```bash
     docker rm rabbitmq
     ```

## RabbitMQ Setup (Non-Docker)

If you prefer not to use Docker, install RabbitMQ manually:
- Follow the [official RabbitMQ installation guide](https://www.rabbitmq.com/download.html).
- Ensure RabbitMQ is running and accessible at `amqp://admin:admin@localhost`. If credentials differ, update the connection string in `producer.js` and `consumer.js`.

## Prerequisites

To run this project, ensure the following are installed:

1. **Node.js**: Version 14 or higher recommended.
2. **RabbitMQ Server**: Set up via Docker (above) or manual installation.
3. **Docker** (optional): Required for running RabbitMQ in a container. Install from the [official Docker guide](https://docs.docker.com/get-docker/).
4. **Dependencies** (listed in both `package.json` files):
   - `amqplib`: RabbitMQ client library for Node.js.
   - `express`: Web framework for creating the server.
   - `nodemon`: Automatically restarts the server during development.

## Project Structure

- **Admin (Producer)**:
  - `package.json`: Defines dependencies and scripts.
  - `producer.js`: Contains logic to connect to RabbitMQ and send email messages.
  - `index.js`: Sets up an Express server and calls `sendMail` every second.

- **User (Consumer)**:
  - `package.json`: Defines dependencies and scripts.
  - `consumer.js`: Contains logic to connect to RabbitMQ and consume messages.
  - `index.js`: Sets up an Express server and starts message consumption.

## Setup Instructions (Node.js Applications)

1. **Set Up the Project**:
   - Create two separate directories: `admin` and `user`.
   - Place the respective `package.json`, `index.js`, and `producer.js`/`consumer.js` files in each directory.

2. **Install Dependencies**:
   - Navigate to the `admin` directory and run:
     ```bash
     npm install
     ```
   - Navigate to the `user` directory and run:
     ```bash
     npm install
     ```

3. **Run the Applications**:
   - Start the admin (producer) application:
     ```bash
     npm run dev
     ```
     This starts the Express server on port `3000` and sends messages every second.
   - Start the user (consumer) application:
     ```bash
     npm run dev
     ```
     This starts the Express server on port `3001` and listens for messages.

## Code Explanation

### Exchange Type: Direct

This project uses a **direct exchange** (`mail_exchange`). A direct exchange delivers messages to a queue only if the message’s routing key exactly matches the queue’s binding key. This ensures efficient, targeted delivery to a specific queue.

**Direct Exchange Explanation**:
- **How It Works**: When the producer sends a message, it includes a routing key (`mail_routing_key`). The exchange checks which queue is bound to this exact routing key and routes the message there.
- **Benefit**: Provides fast and precise message delivery, ideal for scenarios where messages need to go to a specific queue without complex routing.
- **In This Project**: The `mail_exchange` (direct type) routes messages with the `mail_routing_key` to the `mail_queue`, which is bound to this key.

### Admin (Producer) Application

#### `package.json`
- Defines dependencies: `amqplib`, `express`, `nodemon`.
- The `dev` script runs `nodemon index.js` to start the server with auto-reload.

#### `producer.js`
- **Purpose**: Connects to RabbitMQ, creates a direct exchange and queue, binds them with a routing key, and publishes email messages.
- **Key Components**:
  - **Connection**: Uses `amqp.connect('amqp://admin:admin@localhost')` to connect to RabbitMQ.
  - **Channel**: Creates a channel for communication.
  - **Exchange and Queue**:
    - Creates a direct exchange (`mail_exchange`) with `durable: false` (non-persistent).
    - Declares a queue (`mail_queue`) with `durable: false`.
    - Binds the queue to the exchange using `mail_routing_key`.
  - **Message**: Creates a message object with `to`, `from`, `subject`, and `body` fields. The `to` field is set to a random number (using `Math.random(6)`, which is incorrect—see Notes).
  - **Publishing**: Publishes the message as a JSON string using `channel.publish`.
- **Execution**: The `sendMail` function is exported and called every second by `index.js`.

#### `index.js`
- Sets up an Express server on port `3000`.
- Uses `setInterval` to call `sendMail` every second for periodic message sending.

### User (Consumer) Application

#### `package.json`
- Similar to the admin’s, defines dependencies and the `dev` script.

#### `consumer.js`
- **Purpose**: Connects to RabbitMQ, listens to `mail_queue`, and logs received messages.
- **Key Components**:
  - **Connection**: Connects to RabbitMQ using the same credentials as the producer.
  - **Channel**: Creates a channel for communication.
  - **Queue**: Asserts `mail_queue` with `durable: false`.
  - **Consumption**: Uses `channel.consume` to listen for messages and logs their parsed JSON content.
- **Note**: The consumer doesn’t acknowledge messages (`noAck` defaults to `false`), so messages stay in the queue until acknowledged. Add `channel.ack(message)` for proper handling.

#### `index.js`
- Sets up an Express server on port `3001`.
- Calls `receiveMails` to start consuming messages.

## How It Works

1. The **admin** (producer) sends email messages to RabbitMQ:
   - Messages are published to `mail_exchange` (direct exchange) with `mail_routing_key`.
   - The exchange routes messages to `mail_queue` based on the routing key.
2. The **user** (consumer) listens to `mail_queue`:
   - Consumes messages and logs their content (parsed from JSON).
3. The **direct exchange** ensures messages are delivered only to the queue with a matching routing key.

## Notes and Potential Improvements

1. **Random Number Issue**:
   - In `producer.js`, `Math.random(6)` is incorrect as `Math.random()` takes no arguments and returns a value between 0 and 1. Use `Math.floor(Math.random() * 6) + 1` for a range (e.g., 1-6).
   - Setting the `to` field to a random number isn’t practical for an email system. Use a valid email address or dynamic value.

2. **Message Acknowledgment**:
   - The consumer doesn’t acknowledge messages, risking queue buildup. Add `channel.ack(message)` in the `channel.consume` callback.

3. **Connection Handling**:
   - Neither application closes connections/channels, which may cause resource leaks. Add `connection.close()` in a `finally` block or handle errors gracefully.

4. **Error Handling**:
   - Basic error logging exists. Consider adding retry logic for robust error handling.

5. **Durable Queues/Exchanges**:
   - Queues and exchanges are non-durable (`durable: false`), so they’re deleted on RabbitMQ restart. Set `durable: true` for persistence.

6. **Express Server Usage**:
   - Servers are minimal, used only to keep processes running. Add API endpoints (e.g., for sending messages) for more functionality.

## Running the System

1. Start RabbitMQ using Docker or manual installation.
2. In one terminal, navigate to the `admin` directory and run:
   ```bash
   npm run dev
   ```
3. In another terminal, navigate to the `user` directory and run:
   ```bash
   npm run dev
   ```
4. Observe the console output:
   - Admin logs `Your mail was sent` every second.
   - User logs received messages (e.g., `Message > { to: <random_number>, from: 'admin@gmail.com', ... }`).

## Troubleshooting

- **Connection Errors**: Ensure RabbitMQ is running and credentials (`admin:admin@localhost`) are correct. For Docker, verify the container is running and ports `5672` and `15672` are accessible. Check the management console at `http://localhost:15672`.
- **No Messages Received**: Verify exchange, queue, and routing key names match exactly between producer and consumer.
- **Dependency Issues**: Run `npm install` in both directories to ensure dependencies are installed.
- **Docker Issues**: Ensure Docker is running and the RabbitMQ image is pulled correctly. Check container logs with `docker logs rabbitmq`.

This project is a basic example of RabbitMQ’s publish/subscribe pattern using a direct exchange. It can be extended with message acknowledgment, multiple queues, or a more robust email system.