package com.chatapp.service;
import com.chatapp.model.ChatGroup;
import com.chatapp.model.GroupUsers;
import com.chatapp.repository.ChatGroupRepository;
import com.chatapp.repository.GroupUserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class ChatGroupService {
    @Autowired
    private ChatGroupRepository chatGroupRepository;

    @Autowired
    private GroupUserRepository groupUserRepository;
    public ChatGroup findChatGroupById(Long groupId) {
        return chatGroupRepository.findById(groupId).orElse(null);
    }
    public List<ChatGroup> getAllChatGroups() {

        return chatGroupRepository.findAll();
    }


    public ChatGroup createGroup(Map<String, String> groupData, List<String> selectedUsernames) {
        ChatGroup group = new ChatGroup();
        group.setName(groupData.get("name"));

        Set<GroupUsers> groupUsers = new HashSet<>();
        for (String username : selectedUsernames) {
//            GroupUsers user = groupUserRepository.findByUsername(username);

                GroupUsers groupUser = new GroupUsers();
                groupUser.setGroup(group);
                groupUser.setUsername(username);
                groupUsers.add(groupUser);

        }

        group.setGroupUsers(groupUsers);
        chatGroupRepository.save(group);

        for (GroupUsers groupUser : groupUsers) {
            groupUser.setGroup(group);
            groupUserRepository.save(groupUser);
        }

        return group;
    }

}
