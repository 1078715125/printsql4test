package rabbitmq;

import java.io.IOException;

import org.junit.Test;

import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Consumer;
import com.rabbitmq.client.DefaultConsumer;
import com.rabbitmq.client.Envelope;

public class TestRabbitmq {

	private final static String QUEUE_NAME = "hello";
	
	

	@Test
	public void test() throws Exception {
		
	}
	
	@Test
	public void testRecv() throws Exception {
		ConnectionFactory factory = new ConnectionFactory();
		factory.setHost("10.234.40.179");
		factory.setUsername("gyx");
		factory.setPassword("aa");
		Connection connection = factory.newConnection();
		Channel channel = connection.createChannel();
		channel.queueDeclare(QUEUE_NAME, true, false, false, null);
		channel.exchangeDeclare("mytopic", "topic");
		channel.queueBind(QUEUE_NAME, "mytopic", "wohaha.#");
		
		System.out.println(" [*] Waiting for messages. To exit press CTRL+C");

		Consumer consumer = new DefaultConsumer(channel) {
			@Override
			public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties,
					byte[] body) throws IOException {
				String message = new String(body, "UTF-8");
				System.out.println(" [x] Received '" + message + "'");
			}
		};
		channel.basicConsume(QUEUE_NAME, true, consumer);
	}

	@Test
	public void testSend() throws Exception {
		ConnectionFactory factory = new ConnectionFactory();
		factory.setHost("10.234.40.179");
		factory.setUsername("gyx");
		factory.setPassword("aa");
		Connection connection = factory.newConnection();
		Channel channel = connection.createChannel();

		channel.queueDeclare(QUEUE_NAME, true, false, false, null);
		channel.exchangeDeclare("mytopic", "topic");
		channel.queueBind(QUEUE_NAME, "mytopic", "wohaha.#");
		String message = "你好!";
		channel.basicPublish("mytopic", "wohaha.1.1", null, message.getBytes());
		System.out.println(" [x] Send '" + message + "'");

		channel.close();
		connection.close();
	}

}
