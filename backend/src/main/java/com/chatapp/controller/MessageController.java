package com.chatapp.controller;

import com.chatapp.model.Message;
import com.chatapp.model.User;
import com.chatapp.service.MessageService;
import com.chatapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService; // Inject your UserService here

    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getMessagesBetweenUsers(
            @RequestParam("sender") String email,
            @RequestParam("receiver") String receiverUsername) {

        try {
            String senderUsername = userService.getUsernameByEmail(email);
            System.out.println(senderUsername);
            System.out.println(receiverUsername);

            List<Message> messages = messageService.getMessagesBetweenUsers(senderUsername, receiverUsername);
            System.out.println(messages);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(null);
        }


    }


    @GetMapping("/receiver")
    public ResponseEntity<List<Message>> getMessages(
            @RequestParam("sender") String senderUsername,
            @RequestParam("receiver") String email) {

        try {
            String receiverUsername = userService.getUsernameByEmail(email);


            List<Message> messages = messageService.getMessagesBetweenUsers(senderUsername, receiverUsername);
            System.out.println(messages);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(null);
        }

    }

}
