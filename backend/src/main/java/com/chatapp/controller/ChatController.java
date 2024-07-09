package com.chatapp.controller;

import com.chatapp.model.Message;
import com.chatapp.service.MessageService;
import com.chatapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final UserService userservice;

    @Autowired
    public ChatController(SimpMessagingTemplate messagingTemplate, MessageService messageService, UserService userservice) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
        this.userservice=userservice;
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public Message sendMessage(Message message) {
        LocalDateTime localDateTime = LocalDateTime.parse(message.getTimestamp(), DateTimeFormatter.ISO_DATE_TIME);
        long timestampInMillis = localDateTime.toInstant(ZoneOffset.UTC).toEpochMilli();
        message.setTimestamp(String.valueOf(timestampInMillis));
        String sender= userservice.getUsernameByEmail(message.getSender());
        System.out.println(sender);
        message.setSender(sender);
        messageService.processMessage(message);

        return message;
    }

    public void sendMessageToUser(String user, Message message) {
        messagingTemplate.convertAndSendToUser(user, "/queue/messages", message);
    }
}
