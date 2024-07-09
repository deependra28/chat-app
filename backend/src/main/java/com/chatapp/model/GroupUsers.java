package com.chatapp.model;



import jakarta.persistence.*;

@Entity
@Table(name = "group_users")
public class GroupUsers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private ChatGroup group;

    @Column(name = "username", nullable = false)
    private String username;


    public GroupUsers() {}

    public GroupUsers(String username, ChatGroup group) {
        this.username = username;
        this.group = group;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ChatGroup getGroup() {
        return group;
    }

    public void setGroup(ChatGroup group) {
        this.group = group;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
