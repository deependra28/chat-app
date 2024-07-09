package com.chatapp.service;

import com.chatapp.model.Friendship;
import com.chatapp.model.FriendshipStatus;
import com.chatapp.model.User;
import com.chatapp.repository.FriendshipRepository;
import com.chatapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FriendshipService {

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    public List<Friendship> getPendingRequests(String email) {
        User user = userRepository.findByEmail(email);

        return friendshipRepository.findByFriendAndStatus(user, FriendshipStatus.PENDING);
    }


    public void updateFriendshipStatus(Long friendshipId, String action) {
        Optional<Friendship> optionalFriendship = friendshipRepository.findById(friendshipId);
        if (optionalFriendship.isPresent()) {
            Friendship friendship = optionalFriendship.get();
            if ("accept".equalsIgnoreCase(action)) {
                friendship.setStatus(FriendshipStatus.ACCEPTED);
                friendship.setAcceptedAt(LocalDateTime.now()); // Set the accepted timestamp
            } else if ("reject".equalsIgnoreCase(action)) {
                friendship.setStatus(FriendshipStatus.REJECTED);
                friendship.setAcceptedAt(LocalDateTime.now());
            } else {
                throw new IllegalArgumentException("Invalid action provided: " + action);
            }

            friendshipRepository.save(friendship);
        } else {
            throw new IllegalArgumentException("Friendship not found with id: " + friendshipId);
        }
    }


    public Friendship sendFriendRequest(Long userId, String friendUsername) {
        Optional<User> user = userService.findById(userId);
        User friend = userService.findByUsername(friendUsername);

        Friendship friendship = new Friendship();
        if(user.isPresent()) {
            User u=user.get();
            friendship.setUser(u);

        }
        friendship.setFriend(friend);
        friendship.setStatus(FriendshipStatus.PENDING);
        friendship.setRequestedAt(LocalDateTime.now());

        return friendshipRepository.save(friendship);
    }

}