package com.example.habithero.admin.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class HabitStatsDto {
    private Long habitId;
    private String title;
    private int totalDone;
    private int currentStreak;
    private int longestStreak;
    private LocalDate firstDone;
    private Map<String, Integer> weeklyCounts; // e.g. day -> count
    private List<String> heatmapDates; // YYYY-MM-DD strings for frontend heatmap
}