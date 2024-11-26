from kafka import KafkaConsumer
import json

# Initialize the Kafka consumer
consumer = KafkaConsumer(
    'order-topic',  # Replace with your Kafka topic
    bootstrap_servers='my-kafka.default.svc.cluster.local:9092',  # Replace with your Kafka service name
    value_deserializer=lambda v: json.loads(v.decode('utf-8')),
    group_id='order-group',  # Consumer group ID
    auto_offset_reset='earliest'  # Start reading from the earliest message
)

def consume_orders():
    """Consume messages from the Kafka topic"""
    print("Listening for orders...")
    for message in consumer:
        print(f"Received order: {message.value}")

if __name__ == "__main__":
    consume_orders()