package com.example.habithero.habit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HabitAnalyticsDto {
    private Long habitId;
    private String title;
    private int totalCompletions;
    private int currentStreak;
    private int longestStreak;
    private LocalDate lastCompletion;
    
    private List<DailyCount> dailyCounts;
    private List<MonthlyCount> monthlyCounts;
    private Map<String, Integer> weekdayCounts;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DailyCount {
        private String date;
        private int count;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyCount {
        private String month; // YYYY-MM
        private int count;
    }
}
