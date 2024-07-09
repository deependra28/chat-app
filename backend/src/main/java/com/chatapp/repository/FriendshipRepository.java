package com.chatapp.repository;

import com.chatapp.model.Friendship;
import com.chatapp.model.FriendshipStatus;
import com.chatapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    List<Friendship> findByFriendAndStatus(User user, FriendshipStatus status);
}