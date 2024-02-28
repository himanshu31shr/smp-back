const amqplib = require('amqplib');

let _mq_client;

module.exports = class QueueService {

    #_channelInstance;

    queue = 'image-processor';

    constructor(queue) {
        this.queue = queue;
    }

    async #_setup() {
        if (!_mq_client) {
            _mq_client = await amqplib.connect('amqp://' + process.env.MQ_HOST);
        }
        const ch1 = await _mq_client.createChannel();
        this.#_channelInstance = ch1;
    }

    async enqueue(data) {
        await this.#_setup();
        await this.#_channelInstance.assertQueue(this.queue, {
            durable: false
        });
        return this.#_channelInstance.sendToQueue(this.queue, Buffer.from(JSON.stringify(data)), {
            durable: false
        });
    }

}   