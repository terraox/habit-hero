package com.example.habithero.admin.service;

import com.example.habithero.admin.repository.CouponRepository;
import com.example.habithero.habit.repository.HabitRepository;
import com.example.habithero.admin.repository.UserRepository;
import com.example.habithero.model.Coupon;
import com.example.habithero.model.Habit;
import com.example.habithero.model.User;
import com.example.habithero.admin.dto.DashboardDto;
import com.example.habithero.admin.dto.HabitStatsDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService {
    private final HabitRepository habitRepo;
    private final CouponRepository couponRepo;
    private final UserRepository userRepo;

    public AdminService(HabitRepository habitRepo, CouponRepository couponRepo, UserRepository userRepo){
        this.habitRepo = habitRepo;
        this.couponRepo = couponRepo;
        this.userRepo = userRepo;
    }

    // Update a coupon if it exists, returns Optional with updated coupon
    public Optional<Coupon> updateCoupon(Long id, Coupon payload) {
        return couponRepo.findById(id).map(existing -> {
            existing.setCode(payload.getCode());
            existing.setDescription(payload.getDescription());
            existing.setPercentOff(payload.getPercentOff());
            // use isActive() to match Lombok's getter
            existing.setActive(payload.isActive());
            return couponRepo.save(existing);
        });
    }

    // Delete coupon if exists, return true if deleted, false if not found
    public boolean deleteCouponIfExists(Long id) {
        if (!couponRepo.existsById(id)) return false;
        couponRepo.deleteById(id);
        return true;
    }

    public DashboardDto getDashboard() {
        DashboardDto d = new DashboardDto();
        d.setTotalUsers(userRepo.count());
        d.setTotalActiveHabits(habitRepo.findAll().stream().filter(Habit::isActive).count());
        d.setTotalCoupons(couponRepo.count());
        // premiumUsers: placeholder - if you have a subscription flag replace accordingly
        d.setPremiumUsers(0);
        return d;
    }

    public List<Habit> listHabits() {
        return habitRepo.findAll();
    }

    public HabitStatsDto getHabitStats(Long habitId){
        Optional<Habit> opt = habitRepo.findById(habitId);
        if (!opt.isPresent()) return null;
        Habit h = opt.get();
        List<LocalDate> done = h.getDoneDates() == null ? Collections.emptyList() : h.getDoneDates();
        HabitStatsDto dto = new HabitStatsDto();
        dto.setHabitId(h.getId());
        dto.setTitle(h.getTitle());
        dto.setTotalDone(done.size());
        dto.setFirstDone(done.stream().min(LocalDate::compareTo).orElse(null));
        // compute streaks naive:
        Set<LocalDate> set = new HashSet<>(done);
        int longest = 0, cur = 0;
        // longest streak (iterate done dates sorted)
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
        // current streak (ending today)
        int nowStreak = 0;
        LocalDate cursor = LocalDate.now();
        while (set.contains(cursor)) { nowStreak++; cursor = cursor.minusDays(1); }
        dto.setCurrentStreak(nowStreak);
        dto.setLongestStreak(longest);
        // heatmapDates:
        dto.setHeatmapDates(sorted.stream().map(LocalDate::toString).collect(Collectors.toList()));
        // weekly counts (simple)
        Map<String,Integer> weekly = new LinkedHashMap<>();
        for (int i=0;i<7;i++) weekly.put(LocalDate.now().minusDays(i).getDayOfWeek().toString(), 0);
        for (LocalDate d : done) {
            String day = d.getDayOfWeek().toString();
            weekly.computeIfPresent(day, (k,v) -> v+1);
        }
        dto.setWeeklyCounts(weekly);
        return dto;
    }

    public List<Coupon> listCoupons() { return couponRepo.findAll(); }

    public Coupon createCoupon(Coupon c) { return couponRepo.save(c); }

    // keep a simple delete (for other callers). Prefer controllers to call deleteCouponIfExists if they want a boolean.
    public void deleteCoupon(Long id) { couponRepo.deleteById(id); }

    public List<User> listUsers() { return userRepo.findAll(); }
}