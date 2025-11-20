package com.example.habithero.habit.controller;

import com.example.habithero.admin.dto.DashboardDto;
import com.example.habithero.admin.service.AdminService;
import com.example.habithero.admin.repository.UserRepository;
import com.example.habithero.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserRepository userRepository;
    private final AdminService adminService;

    public UserController(UserRepository userRepository, AdminService adminService) {
        this.userRepository = userRepository;
        this.adminService = adminService;
    }

    @GetMapping("/users/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        
        java.util.HashMap<String, Object> response = new java.util.HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        response.put("isAdmin", user.isAdmin());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDto> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }
}
