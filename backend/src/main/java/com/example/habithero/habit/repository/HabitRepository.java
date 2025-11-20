package com.example.habithero.habit.repository;

import com.example.habithero.model.Habit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HabitRepository extends JpaRepository<Habit, Long> {
    // TODO: List<Habit> findByOwnerId(Long ownerId);
}
