package com.chatapp.kafka;


import com.chatapp.model.Message;
import com.chatapp.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class MessageListener {

    @Autowired
    private MessageService messageService;

    @KafkaListener(topics = "chat-topic", groupId = "chat-group")
    public void listen(String messageContent) {
        // Deserialize message content
        String[] parts = messageContent.split(":", 3);
        String sender = parts[0];
        String receiver = parts[1];
        String content = parts[2];

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
//        messageService.saveMessage(message);
    }
}

