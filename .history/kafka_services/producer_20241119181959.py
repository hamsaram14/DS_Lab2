from kafka import KafkaProducer
import json

# Initialize the Kafka producer
producer = KafkaProducer(
    bootstrap_servers='my-kafka.default.svc.cluster.local:9092',  # Replace with your Kafka service name
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def send_order(order):
    """Send order details to the Kafka topic"""
    topic = 'order-topic'  # Replace with your Kafka topic
    producer.send(topic, order)
    print(f"Order sent: {order}")

if __name__ == "__main__":
    # Example: Sending a sample order
    sample_order = {"order_id": 1, "customer_id": 123, "items": ["pizza", "coke"], "total": 20.5}
    send_order(sample_order)

producer = KafkaProducer(bootstrap_servers='127.0.0.1:9092')

producer.send('test-topic', b'Hello, Kafka!')
producer.close()
