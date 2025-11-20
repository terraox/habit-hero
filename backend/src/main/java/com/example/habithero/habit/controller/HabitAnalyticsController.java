package com.example.habithero.habit.controller;

import com.example.habithero.habit.dto.HabitAnalyticsDto;
import com.example.habithero.habit.service.HabitAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/habits")
public class HabitAnalyticsController {

    private final HabitAnalyticsService analyticsService;

    public HabitAnalyticsController(HabitAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<HabitAnalyticsDto> getHabitAnalytics(@PathVariable Long id) {
        return ResponseEntity.ok(analyticsService.getAnalytics(id));
    }
}
