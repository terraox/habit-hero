package com.example.habithero.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    // store the hashed password
    private String passwordHash;

    // admin flag
    private boolean isAdmin;

    private String name;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}