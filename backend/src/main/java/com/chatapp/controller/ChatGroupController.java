package com.chatapp.controller;

import com.chatapp.model.ChatGroup;
import com.chatapp.model.GroupUsers;
import com.chatapp.service.ChatGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@Controller
public class ChatGroupController {
    @Autowired
    private ChatGroupService chatGroupService;

    @GetMapping("/groups")
    public List<ChatGroup> getGroups() {
        System.out.println(chatGroupService.getAllChatGroups());
        return chatGroupService.getAllChatGroups();
    }

    @PostMapping("/create")
    public ResponseEntity<ChatGroup> createGroup(@RequestBody Map<String, Object> requestBody) {
        Map<String, String> groupData = (Map<String, String>) requestBody.get("groupData");
        List<String> groupUsersDataList = (List<String>) requestBody.get("groupUsersData");

        ChatGroup group = chatGroupService.createGroup(groupData, groupUsersDataList);
        return ResponseEntity.ok(group);
    }
}
