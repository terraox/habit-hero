package com.example.habithero.admin.controller;

import com.example.habithero.admin.service.AdminService;
import com.example.habithero.admin.dto.*;
import com.example.habithero.model.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService admin;

    public AdminController(AdminService admin) { this.admin = admin; }

    @GetMapping("/dashboard")
    public DashboardDto dashboard() { return admin.getDashboard(); }

    @GetMapping("/habits")
    public List<Habit> habits() { return admin.listHabits(); }

    @GetMapping("/habits/{id}/stats")
    public HabitStatsDto habitStats(@PathVariable Long id) { return admin.getHabitStats(id); }

    @GetMapping("/users")
    public List<User> users() { return admin.listUsers(); }
}