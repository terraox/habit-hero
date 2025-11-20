package com.example.habithero.config;

import com.example.habithero.admin.repository.CouponRepository;
import com.example.habithero.habit.repository.HabitRepository;
import com.example.habithero.admin.repository.UserRepository;
import com.example.habithero.model.Coupon;
import com.example.habithero.model.Habit;
import com.example.habithero.model.User;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
@Profile("dev")
public class DataLoader implements ApplicationRunner {

    private final UserRepository userRepo;
    private final HabitRepository habitRepo;
    private final CouponRepository couponRepo;
    private final PasswordEncoder passwordEncoder;
    private final Environment env;

    public DataLoader(UserRepository userRepo, HabitRepository habitRepo, CouponRepository couponRepo, PasswordEncoder passwordEncoder, Environment env) {
        this.userRepo = userRepo;
        this.habitRepo = habitRepo;
        this.couponRepo = couponRepo;
        this.passwordEncoder = passwordEncoder;
        this.env = env;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (userRepo.count() > 0) {
            return;
        }

        String adminEmail = env.getProperty("DEV_ADMIN_EMAIL", "help.habithero@gmail.com");
        String adminPass = env.getProperty("DEV_ADMIN_PASSWORD", "shipDock123*");

        User admin = User.builder()
                .email(adminEmail)
                .passwordHash(passwordEncoder.encode(adminPass))
                .isAdmin(true)
                .name("Admin User")
                .build();
        userRepo.save(admin);

        User user1 = User.builder()
                .email("user1@example.com")
                .passwordHash(passwordEncoder.encode("password"))
                .isAdmin(false)
                .name("Test User")
                .build();
        userRepo.save(user1);

        Habit h1 = Habit.builder()
                .title("Morning Jog")
                .icon("run")
                .frequency("DAILY")
                .owner(user1)
                .active(true)
                .build();
        h1.addDoneDate(LocalDate.now().minusDays(1));
        h1.addDoneDate(LocalDate.now());
        habitRepo.save(h1);

        Habit h2 = Habit.builder()
                .title("Read Book")
                .icon("book")
                .frequency("WEEKLY")
                .owner(user1)
                .active(true)
                .build();
        habitRepo.save(h2);

        Coupon c1 = Coupon.builder()
                .code("WELCOME20")
                .description("20% off for new users")
                .percentOff(20)
                .active(true)
                .build();
        couponRepo.save(c1);

        System.out.println("DataLoader: Seeded admin user (" + adminEmail + ") and sample data.");
    }
}