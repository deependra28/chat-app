package com.chatapp.controller;


import com.chatapp.model.GroupUsers;
import com.chatapp.service.GroupUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class GroupUserController {
    @Autowired
    private GroupUserService userService;

    @GetMapping("/users")
    public List<GroupUsers> getUsers() {
        return userService.getAllUsers();
    }
}
