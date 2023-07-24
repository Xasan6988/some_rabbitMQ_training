const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err0, connection) => {
  if (err0) throw err0;

  connection.createChannel((err1, channel) => {
    if (err1) throw err1;


    const exchange = 'logs';

    const msg = process.argv.slice(2).join(' ') || 'Hello World!';

    // Second param - type of exchange
    channel.assertExchange(exchange, 'fanout', {
      durable: false
    });

    channel.publish(exchange, '', Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0);
  }, 500);
});
