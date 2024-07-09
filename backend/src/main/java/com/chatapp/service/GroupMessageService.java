package com.chatapp.service;

import com.chatapp.model.ChatGroup;
import com.chatapp.model.GroupMessage;
import com.chatapp.repository.GroupMessageRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GroupMessageService {
    @Autowired
    private GroupMessageRepository groupMessageRepository;
    private ChatGroupService groupService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public GroupMessageService(GroupMessageRepository groupMessageRepository, ChatGroupService groupService, RedisTemplate<String, Object> redisTemplate, KafkaTemplate<String, String> kafkaTemplate) {
        this.groupMessageRepository = groupMessageRepository;
        this.groupService = groupService;
        this.redisTemplate = redisTemplate;
        this.kafkaTemplate = kafkaTemplate;
    }


    public void processGroupMessage(GroupMessage message) {

        String key = "group:" + message.getId();
        redisTemplate.opsForList().leftPush(key, message);

        // Send message to Kafka topic
        String kafkaMessage = message.getSender() + ":" + message.getId() + ":" + message.getContent() + ":" + message.getTimestamp();
        kafkaTemplate.send("group-chat-topic", kafkaMessage);
    }

    @KafkaListener(topics = "group-chat-topic", groupId = "group-chat-consumer-group")
    public void handleGroupMessageFromKafka(String messageString) {
        // Convert the messageString to Message object
        String[] parts = messageString.split(":");
        String sender = parts[0];
        Long groupId = Long.valueOf(parts[1]);
        String content = parts[2];
        String timestamp = parts[3];

// Create a new GroupMessage object and set its properties
        GroupMessage message = new GroupMessage();
        message.setSender(sender);
        message.setContent(content);
        message.setTimestamp(timestamp);
System.out.println(groupId);
        ChatGroup group=groupService.findChatGroupById(groupId);
        message.setGroup(group);
//        message.setId(Long.valueOf(groupId));

        // Simulate asynchronous processing with a separate thread
        new Thread(() -> {
            try {
                Thread.sleep(8000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Interrupted while waiting to persist message", e);
            }

            // Persist the message to the database
            groupMessageRepository.save(message);
        }).start();

    }
        public List<GroupMessage> getMessagesByGroupId(Long groupId) {
        return groupMessageRepository.findByGroupId(groupId);
    }


}
