package com.example.habithero.habit.service;

import com.example.habithero.admin.dto.HabitStatsDto;
import com.example.habithero.habit.repository.HabitRepository;
import com.example.habithero.model.Habit;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class HabitService {

    private final HabitRepository habitRepo;

    public HabitService(HabitRepository habitRepo) {
        this.habitRepo = habitRepo;
    }

    public Optional<Habit> findById(Long id) {
        return habitRepo.findById(id);
    }

    public Habit createHabit(Habit habit) {
        return habitRepo.save(habit);
    }

    public Optional<Habit> updateHabit(Long id, Habit updates) {
        return habitRepo.findById(id).map(h -> {
            h.setTitle(updates.getTitle());
            h.setIcon(updates.getIcon());
            h.setFrequency(updates.getFrequency());
            // active flag if needed
            return habitRepo.save(h);
        });
    }

    public void deleteHabit(Long id) {
        habitRepo.deleteById(id);
    }

    public Optional<Habit> markDate(Long habitId, LocalDate date) {
        Optional<Habit> opt = habitRepo.findById(habitId);
        if (opt.isPresent()) {
            Habit h = opt.get();
            // Allow multiple completions? User req says "Multi-completion per day support"
            // But usually for a simple mark/unmark we might just add it.
            // If we want unique per day, we check contains.
            // Requirement: "Multi-completion per day support" -> So we just add it.
            h.addDoneDate(date);
            return Optional.of(habitRepo.save(h));
        }
        return Optional.empty();
    }

    public Optional<Habit> unmarkDate(Long habitId, LocalDate date) {
        Optional<Habit> opt = habitRepo.findById(habitId);
        if (opt.isPresent()) {
            Habit h = opt.get();
            h.getDoneDates().remove(date); // Removes first occurrence
            return Optional.of(habitRepo.save(h));
        }
        return Optional.empty();
    }

    public Optional<Habit> markDoneToday(Long habitId) {
        Optional<Habit> opt = habitRepo.findById(habitId);
        if (opt.isPresent()) {
            Habit h = opt.get();
            LocalDate today = LocalDate.now();
            if (!h.getDoneDates().contains(today)) {
                h.addDoneDate(today);
                return Optional.of(habitRepo.save(h));
            }
            return Optional.of(h);
        }
        return Optional.empty();
    }

    public Optional<HabitStatsDto> buildStatsForHabit(Long habitId) {
        Optional<Habit> opt = habitRepo.findById(habitId);
        if (!opt.isPresent()) return Optional.empty();

        Habit h = opt.get();
        List<LocalDate> done = h.getDoneDates() == null ? Collections.emptyList() : h.getDoneDates();
        HabitStatsDto dto = new HabitStatsDto();
        dto.setHabitId(h.getId());
        dto.setTitle(h.getTitle());
        dto.setTotalDone(done.size());
        dto.setFirstDone(done.stream().min(LocalDate::compareTo).orElse(null));

        // compute streaks
        Set<LocalDate> set = new HashSet<>(done);
        int longest = 0, cur = 0;
        List<LocalDate> sorted = done.stream().sorted().collect(Collectors.toList());
        LocalDate prev = null;
        for (LocalDate d : sorted) {
            if (prev != null && prev.plusDays(1).equals(d)) {
                cur++;
            } else {
                cur = 1;
            }
            longest = Math.max(longest, cur);
            prev = d;
        }

        // current streak
        int nowStreak = 0;
        LocalDate cursor = LocalDate.now();
        while (set.contains(cursor)) {
            nowStreak++;
            cursor = cursor.minusDays(1);
        }
        
        dto.setCurrentStreak(nowStreak);
        dto.setLongestStreak(longest);
        dto.setHeatmapDates(sorted.stream().map(LocalDate::toString).collect(Collectors.toList()));

        // Weekly counts (last 7 days by day-of-week)
        Map<String, Integer> weekly = new LinkedHashMap<>();
        // Initialize map for last 7 days
        for (int i = 6; i >= 0; i--) {
            weekly.put(LocalDate.now().minusDays(i).getDayOfWeek().toString(), 0);
        }
        // Count occurrences
        for (LocalDate d : done) {
            String day = d.getDayOfWeek().toString();
            weekly.computeIfPresent(day, (k, v) -> v + 1);
        }
        dto.setWeeklyCounts(weekly);

        return Optional.of(dto);
    }
    
    public List<Habit> findAll() {
        return habitRepo.findAll();
    }
}
