package com.chatapp.controller;


import com.chatapp.model.Friendship;
import com.chatapp.service.FriendshipService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/friendships")
public class FriendshipController {

    @Autowired
    private FriendshipService friendshipService;

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/pending")
    public List<Friendship> getPendingRequests(@RequestParam String email) {
        return friendshipService.getPendingRequests(email);
    }
    @PostMapping("/status")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> handleRequest(@RequestBody String payload, @RequestParam String action) {
        try {
            JSONObject jsonObject = new JSONObject(payload);
            Long id = jsonObject.getLong("id");
            friendshipService.updateFriendshipStatus(id, action);
            return ResponseEntity.ok().body("Request " + action + "ed successfully!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error");
        }
    }

    @PostMapping("/send")
    public ResponseEntity<Friendship> sendFriendRequest(@RequestParam Long id, @RequestBody Map<String, String> payload) {
        String friendUsername = payload.get("username");
        Friendship friendship = friendshipService.sendFriendRequest(id, friendUsername);
        return ResponseEntity.ok(friendship);
    }

}

