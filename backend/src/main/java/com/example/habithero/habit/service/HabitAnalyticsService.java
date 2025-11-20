package com.example.habithero.habit.service;

import com.example.habithero.habit.dto.HabitAnalyticsDto;
import com.example.habithero.habit.repository.HabitRepository;
import com.example.habithero.model.Habit;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class HabitAnalyticsService {

    private final HabitRepository habitRepository;

    public HabitAnalyticsService(HabitRepository habitRepository) {
        this.habitRepository = habitRepository;
    }

    public HabitAnalyticsDto getAnalytics(Long habitId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        List<LocalDate> doneDates = habit.getDoneDates();
        Collections.sort(doneDates);

        int totalCompletions = doneDates.size();
        LocalDate lastCompletion = doneDates.isEmpty() ? null : doneDates.get(doneDates.size() - 1);

        // Calculate streaks
        int currentStreak = calculateCurrentStreak(doneDates);
        int longestStreak = calculateLongestStreak(doneDates);

        // Daily counts (last 365 days)
        List<HabitAnalyticsDto.DailyCount> dailyCounts = calculateDailyCounts(doneDates);

        // Monthly counts (last 12 months)
        List<HabitAnalyticsDto.MonthlyCount> monthlyCounts = calculateMonthlyCounts(doneDates);

        // Weekday counts
        Map<String, Integer> weekdayCounts = calculateWeekdayCounts(doneDates);

        return HabitAnalyticsDto.builder()
                .habitId(habit.getId())
                .title(habit.getTitle())
                .totalCompletions(totalCompletions)
                .currentStreak(currentStreak)
                .longestStreak(longestStreak)
                .lastCompletion(lastCompletion)
                .dailyCounts(dailyCounts)
                .monthlyCounts(monthlyCounts)
                .weekdayCounts(weekdayCounts)
                .build();
    }

    private int calculateCurrentStreak(List<LocalDate> dates) {
        if (dates.isEmpty()) return 0;
        
        Set<LocalDate> uniqueDates = new HashSet<>(dates);
        int streak = 0;
        LocalDate checkDate = LocalDate.now();
        
        // If not done today, check if done yesterday to continue streak
        if (!uniqueDates.contains(checkDate)) {
            checkDate = checkDate.minusDays(1);
            if (!uniqueDates.contains(checkDate)) {
                return 0;
            }
        }

        while (uniqueDates.contains(checkDate)) {
            streak++;
            checkDate = checkDate.minusDays(1);
        }
        return streak;
    }

    private int calculateLongestStreak(List<LocalDate> dates) {
        if (dates.isEmpty()) return 0;
        
        List<LocalDate> sortedUnique = new ArrayList<>(new HashSet<>(dates));
        Collections.sort(sortedUnique);

        int maxStreak = 0;
        int currentStreak = 0;
        LocalDate prevDate = null;

        for (LocalDate date : sortedUnique) {
            if (prevDate == null) {
                currentStreak = 1;
            } else if (ChronoUnit.DAYS.between(prevDate, date) == 1) {
                currentStreak++;
            } else {
                currentStreak = 1;
            }
            maxStreak = Math.max(maxStreak, currentStreak);
            prevDate = date;
        }
        return maxStreak;
    }

    private List<HabitAnalyticsDto.DailyCount> calculateDailyCounts(List<LocalDate> dates) {
        Map<String, Integer> counts = new HashMap<>();
        for (LocalDate date : dates) {
            String key = date.toString();
            counts.put(key, counts.getOrDefault(key, 0) + 1);
        }

        List<HabitAnalyticsDto.DailyCount> result = new ArrayList<>();
        LocalDate start = LocalDate.now().minusDays(365);
        LocalDate end = LocalDate.now();

        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            String key = date.toString();
            if (counts.containsKey(key)) {
                result.add(new HabitAnalyticsDto.DailyCount(key, counts.get(key)));
            }
        }
        return result;
    }

    private List<HabitAnalyticsDto.MonthlyCount> calculateMonthlyCounts(List<LocalDate> dates) {
        Map<String, Integer> counts = new TreeMap<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");

        // Initialize last 12 months with 0
        LocalDate now = LocalDate.now();
        for (int i = 11; i >= 0; i--) {
            counts.put(now.minusMonths(i).format(fmt), 0);
        }

        for (LocalDate date : dates) {
            String key = date.format(fmt);
            if (counts.containsKey(key)) {
                counts.put(key, counts.get(key) + 1);
            }
        }

        return counts.entrySet().stream()
                .map(e -> new HabitAnalyticsDto.MonthlyCount(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }

    private Map<String, Integer> calculateWeekdayCounts(List<LocalDate> dates) {
        Map<String, Integer> counts = new LinkedHashMap<>();
        // Initialize order MON-SUN
        for (DayOfWeek day : DayOfWeek.values()) {
            counts.put(day.name().substring(0, 3), 0);
        }

        for (LocalDate date : dates) {
            String day = date.getDayOfWeek().name().substring(0, 3);
            counts.put(day, counts.get(day) + 1);
        }
        return counts;
    }
}
