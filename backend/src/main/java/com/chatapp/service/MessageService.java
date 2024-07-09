package com.chatapp.service;

import com.chatapp.model.Message;
import com.chatapp.model.User;
import com.chatapp.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {
    RedisTemplate<String, Object> redisTemplate;
    private final MessageRepository messageRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    public MessageService(MessageRepository messageRepository,
                          RedisTemplate<String, Object> redisTemplate,
                          KafkaTemplate<String, String> kafkaTemplate) {
        this.messageRepository = messageRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.redisTemplate = redisTemplate;
    }

    public void processMessage(Message message) {
        // Send message to Kafka topic
        String key = "chat:" + message.getSender() + ":" + message.getReceiver();
        redisTemplate.opsForList().leftPush(key, message);
        kafkaTemplate.send("chat-topic", message.getSender() + ":" + message.getReceiver() + ":" + message.getContent() + ":" + message.getTimestamp());
    }

    @KafkaListener(topics = "chat-topic", groupId = "chat-consumer-group")
    public void handleMessageFromKafka(String messageString) {
        // Convert the messageString to Message object
        String[] parts = messageString.split(":");
        String sender = parts[0];
        String receiver = parts[1];
        String content = parts[2];
        String timestamp=parts[3];
        Message message = new Message(sender, receiver, content, timestamp);

        // Simulate asynchronous processing with a separate thread
        new Thread(() -> {
            // Introduce a delay (e.g., 5 seconds) before persisting to the database
            try {
                Thread.sleep(8000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Interrupted while waiting to persist message", e);
            }

            // Persist the message to the database
            messageRepository.save(message);
        }).start();
    }

//    public void saveMessage(Message message) {
//        message.setTimestamp(System.currentTimeMillis());  // Set timestamp as long
//    }



    public List<Message> getMessagesBetweenUsers(String sender, String receiver) {

        return messageRepository.findBySenderAndReceiver(sender, receiver);
    }

}