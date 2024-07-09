package com.chatapp.service;

import com.chatapp.model.GroupUsers;
import com.chatapp.repository.GroupUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupUserService {
    @Autowired
    private GroupUserRepository userRepository;

    public List<GroupUsers> getAllUsers() {
        return userRepository.findAll();
    }
}
