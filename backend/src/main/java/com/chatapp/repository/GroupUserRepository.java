package com.chatapp.repository;

import com.chatapp.model.GroupUsers;
import com.chatapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupUserRepository extends JpaRepository<GroupUsers, Long> {
    GroupUsers findByUsername(String username);
}
