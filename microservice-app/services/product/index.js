import amqp from 'amqplib';

async function connectRabbit() {
  let retries = 5;
  while (retries) {
    try {
      const connection = await amqp.connect('amqp://rabbitmq');
      const channel = await connection.createChannel();
      await channel.assertQueue('user_created');
      console.log('✅ Connected to RabbitMQ');
      
      channel.consume('user_created', msg => {
        const user = JSON.parse(msg.content.toString());
        console.log('[PRODUCT] Received user:', user);
        channel.ack(msg);
      });

      break; // якщо підключення вдалося — виходимо
    } catch (err) {
      console.error('❌ Failed to connect to RabbitMQ, retrying...', retries);
      retries--;
      await new Promise(res => setTimeout(res, 5000)); // зачекати 5 сек
    }
  }
}

connectRabbit();


