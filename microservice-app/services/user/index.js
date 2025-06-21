import amqp from 'amqplib';

async function connectRabbit() {
  let retries = 5;
  while (retries) {
    try {
      const connection = await amqp.connect('amqp://rabbitmq');
      const channel = await connection.createChannel();
      await channel.assertQueue('user_created');
      console.log('✅ Connected to RabbitMQ from USER service');
      return channel;
    } catch (err) {
      console.error('❌ RabbitMQ not ready, retrying...', retries);
      retries--;
      await new Promise(res => setTimeout(res, 5000)); // зачекай 5 сек
    }
  }
  throw new Error('📛 Failed to connect to RabbitMQ after retries');
}

async function startServer() {
  const channel = await connectRabbit();

  // тут решта логіки (наприклад Express)
  console.log('User service listening on port 3000');
}

startServer();

