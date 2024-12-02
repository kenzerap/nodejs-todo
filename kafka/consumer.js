const { Kafka } = require('kafkajs');
const axios = require('axios');

// Initialize Kafka client
const kafka = new Kafka({
  clientId: 'nodejs-consumer',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'express-consumer-group' });

const runConsumer = async () => {
  try {
    await consumer.connect();
    console.log('Kafka Consumer connected');

    // Subscribe to a Kafka topic
    await consumer.subscribe({ topic: 'FileUploaded', fromBeginning: true });

    // Run the consumer to process messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          value: message.value.toString(),
        });

        // Process the message and call the API
        const productData = JSON.parse(message.value.toString());
        try {
          const response = await axios.post(
            `http://localhost:${process.env.PORT || 3002}/product/import`,
            { products: productData },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('Product imported:', new Date());
        } catch (error) {
          console.error(
            'Error creating product:',
            error.response ? error.response.data : error.message
          );
        }
      },
    });
  } catch (error) {
    console.error('Error in Kafka consumer:', error);
  }
};

// Handle graceful shutdown
const shutdownConsumer = async () => {
  try {
    await consumer.disconnect();
    console.log('Kafka Consumer disconnected');
  } catch (error) {
    console.error('Error during Kafka consumer shutdown:', error);
  }
};

module.exports = { runConsumer, shutdownConsumer };
