package com.example.habithero.admin.dto;

import lombok.Data;

@Data
public class DashboardDto {
    private long totalUsers;
    private long totalActiveHabits;
    private long totalCoupons;
    private long premiumUsers;
}