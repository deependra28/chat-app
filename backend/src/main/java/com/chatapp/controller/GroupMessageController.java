package com.chatapp.controller;

import com.chatapp.model.GroupMessage;
import com.chatapp.service.GroupMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
public class GroupMessageController {
    @Autowired
    private GroupMessageService groupMessageService;

    @GetMapping("/groups/{groupId}/messages")
    public List<GroupMessage> getMessages(@PathVariable Long groupId) {
        return groupMessageService.getMessagesByGroupId(groupId);
    }


    @PostMapping("/{groupId}/messages")
    public GroupMessage sendGroupMessage(@PathVariable String groupId, @RequestBody GroupMessage message) {
        message.setId(Long.valueOf(groupId));
        LocalDateTime localDateTime = LocalDateTime.parse(message.getTimestamp(), DateTimeFormatter.ISO_DATE_TIME);
        long timestampInMillis = localDateTime.toInstant(ZoneOffset.UTC).toEpochMilli();
        message.setTimestamp(String.valueOf(timestampInMillis));
        groupMessageService.processGroupMessage(message);
        return message;
    }


    @MessageMapping("/group.sendMessage")
    @SendTo("/topic/group")
    public GroupMessage sendMessage(GroupMessage message) {
        LocalDateTime localDateTime = LocalDateTime.parse(message.getTimestamp(), DateTimeFormatter.ISO_DATE_TIME);
        long timestampInMillis = localDateTime.toInstant(ZoneOffset.UTC).toEpochMilli();
        message.setTimestamp(String.valueOf(timestampInMillis));
        groupMessageService.processGroupMessage(message);
        return message;
    }
}
