package com.chatapp.service;

import com.chatapp.model.User;
import com.chatapp.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public User registerUser(User user) {
        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }

        return userRepository.save(user);
    }
    @Transactional
    public User loginUser(User user) {
        Optional<User> existingUser = Optional.ofNullable(userRepository.findByEmail(user.getEmail()));
        if (existingUser.isPresent() && existingUser.get().getPassword().equals(user.getPassword())) {
            return existingUser.get();
        } else {
            throw new RuntimeException("Invalid email or password");
        }
    }
    @Transactional
    public List<User> getAllUsersExceptCurrent(Long loggedInUserId) {
        System.out.println(loggedInUserId);
        List<User> friends = userRepository.findFriendsByUserId(loggedInUserId);

        return friends;
    }
@Transactional
    public String getUsernameByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            return user.getUsername();
        } else {
            throw new RuntimeException("User not found");
        }
    }
    @Transactional
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }
}
