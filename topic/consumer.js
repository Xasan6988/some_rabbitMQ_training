const amqp = require('amqplib/callback_api');

const args = ['*.info', '*.error', '*.success', '*.warning']

if (args.length == 0) {
  console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
  process.exit(1);
}

amqp.connect('amqp://localhost', (err0, connection) => {
  if (err0) throw err0;

  connection.createChannel((err1, channel) => {
    if (err1) throw err1;

    const exchange = 'topic_logs';

    channel.assertExchange(exchange, 'topic', {
      durable: false
    });

    channel.assertQueue('', {
      exclusive: true
    }, (err2, q) => {
      if (err2) throw err2

      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C");

      args.forEach(key => {
        channel.bindQueue(q.queue, exchange, key);
      });

      channel.consume(q.queue, msg => {
        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
      }, {
        noAck: true
      });
    });
  });
});
