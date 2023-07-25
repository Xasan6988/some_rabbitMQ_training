const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err0, connection) => {
  if (err0) throw err0;

  connection.createChannel((err1, channel) => {
    if (err1) throw err1;

    const queue = 'rpc_queue';

    channel.assertQueue(queue, {
      durable: false
    });

    channel.prefetch(1);

    console.log(' [x] Awaiting RPC requests');

    channel.consume(queue, msg => {
      const n = parseInt(msg.content.toString());

      console.log(" [.] fib(%d)", n);

      const r = fibonacci(n);

      channel.sendToQueue(msg.properties.replyTo,
        Buffer.from(r.toString()), {
          correlationId: msg.properties.correlationId
        });

        channel.ack(msg);
    });
  });
});

const fibonacci = (n) => {
  if (n == 0 || n == 1) return n;
  else return fibonacci(n - 1) + fibonacci(n - 2);
}
