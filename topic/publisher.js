const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err0, connection) => {
  if (err0) throw err0;

  connection.createChannel((err1, channel) => {
    if (err1) throw err1;


    const exchange = 'topic_logs';
    const args = ['info', 'error', 'success', 'warning']
    const msg = 'Hello World!';
    const key = `anonymoys.${args[Math.floor(Math.random() * (3 + 1))]}`


    channel.assertExchange(exchange, 'topic', {
      durable: false
    });

    channel.publish(exchange, key, Buffer.from(msg));
    console.log(" [x] Sent %s", key, msg);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0);
  }, 500);
});
