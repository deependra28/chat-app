package com.chatapp.repository;


import com.chatapp.model.User;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByUsername(String username);
    @Query("SELECT f.friend FROM Friendship f WHERE f.user.id = :userId AND f.status = 'ACCEPTED'" +
            " UNION " +
            "SELECT f.user FROM Friendship f WHERE f.friend.id = :userId AND f.status = 'ACCEPTED'")
    List<User> findFriendsByUserId(@Param("userId") Long userId);
}
