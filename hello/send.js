const amqp = require('amqplib/callback_api');


// Create connection
amqp.connect('amqp://localhost', (err0, connection) => {
  if (err0) throw err0;

  // Create channel
  connection.createChannel((err1, channel) => {
    if (err1) throw err1;

    // Create queue's name
    const queue = 'hello';
    const msg = 'Hello World';

    channel.assertQueue(queue, {
      durable: false
    });

    // Send to declared above queue message and console it
    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(() => {
  connection.close();
  process.exit(0)
  }, 500);
});
