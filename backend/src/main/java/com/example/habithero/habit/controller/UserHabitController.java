package com.example.habithero.habit.controller;

import com.example.habithero.admin.dto.HabitStatsDto;
import com.example.habithero.habit.service.HabitService;
import com.example.habithero.model.Habit;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habits")
public class UserHabitController {

    private final HabitService habitService;

    public UserHabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @GetMapping
    public ResponseEntity<List<Habit>> getAllHabits() {
        return ResponseEntity.ok(habitService.findAll());
    }

    @PostMapping
    public ResponseEntity<Habit> createHabit(@RequestBody Habit habit) {
        return ResponseEntity.ok(habitService.createHabit(habit));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Habit> updateHabit(@PathVariable Long id, @RequestBody Habit habit) {
        return habitService.updateHabit(id, habit)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(@PathVariable Long id) {
        habitService.deleteHabit(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Habit> getHabit(@PathVariable Long id) {
        return habitService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<java.util.Map<String, Object>> completeHabit(@PathVariable Long id, @RequestBody(required = false) java.util.Map<String, String> body) {
        java.time.LocalDate date = (body != null && body.containsKey("date")) 
                ? java.time.LocalDate.parse(body.get("date")) 
                : java.time.LocalDate.now();
        
        return habitService.markDate(id, date)
                .map(h -> {
                    java.util.Map<String, Object> response = new java.util.HashMap<>();
                    response.put("success", true);
                    response.put("newDoneDate", date.toString());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/complete")
    public ResponseEntity<java.util.Map<String, Object>> undoCompleteHabit(@PathVariable Long id, @RequestBody(required = false) java.util.Map<String, String> body) {
        java.time.LocalDate date = (body != null && body.containsKey("date")) 
                ? java.time.LocalDate.parse(body.get("date")) 
                : java.time.LocalDate.now();

        return habitService.unmarkDate(id, date)
                .map(h -> {
                    java.util.Map<String, Object> response = new java.util.HashMap<>();
                    response.put("success", true);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/mark")
    public ResponseEntity<Habit> markDate(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        java.time.LocalDate date = java.time.LocalDate.parse(body.get("date"));
        return habitService.markDate(id, date)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/unmark")
    public ResponseEntity<Habit> unmarkDate(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        java.time.LocalDate date = java.time.LocalDate.parse(body.get("date"));
        return habitService.unmarkDate(id, date)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/today")
    public ResponseEntity<List<Habit>> getHabitsToday() {
        return ResponseEntity.ok(habitService.findAll());
    }

    @PostMapping("/{id}/done")
    public ResponseEntity<Habit> markDone(@PathVariable Long id) {
        return habitService.markDoneToday(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<HabitStatsDto> getStats(@PathVariable Long id) {
        return habitService.buildStatsForHabit(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
