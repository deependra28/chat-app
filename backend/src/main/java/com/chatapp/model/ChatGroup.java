
package com.chatapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ChatGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "group", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<GroupMessage> groupMessages;

    @OneToMany(mappedBy = "group", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<GroupUsers> groupUsers;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<GroupMessage> getGroupMessages() {
        return groupMessages;
    }

    public void setGroupMessages(Set<GroupMessage> groupMessages) {
        this.groupMessages = groupMessages;
    }

    public Set<GroupUsers> getGroupUsers() {
        return groupUsers;
    }

    public void setGroupUsers(Set<GroupUsers> groupUsers) {
        this.groupUsers = groupUsers;
    }
}

