package com.chatapp.model;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "message") // Specify the table name in the database
public class Message implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender", nullable = false) // Map to sender_username column
    private String sender;

    @Column(name = "receiver", nullable = false) // Map to receiver_username column
    private String receiver;

    @Column(name = "content", columnDefinition = "TEXT") // Map to content column with TEXT type
    private String content;

    @Column(name = "timestamp", nullable = false) // Map to timestamp column
    private String timestamp;

    // Constructors
    public Message() {
        // Default constructor needed by JPA
    }

    public Message(String sender, String receiver, String content, String timestamp) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.timestamp = timestamp;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
