const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err0, connection) => {
  if (err0) throw err0;

  connection.createChannel((err1, channel) => {
    if (err1) throw err1;

    const queue = 'task_queue';

    channel.assertQueue(queue, {
      durable: true
    })

    // This param set limit for noAck msg
    channel.prefetch(1);

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, msg => {
      const secs = msg.content.toString().split('.').length - 1;

      console.log(" [*] Received %s", msg.content.toString);

      setTimeout(() => {
        console.log(' [*] Done');
        // After msg processed - we need send ack
        channel.ack(msg);
      }, 5000);
    })
  }, {
    noAck: false
  })
})
