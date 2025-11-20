package com.example.habithero.admin.controller;

import com.example.habithero.admin.service.AdminService;
import com.example.habithero.model.Coupon;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/coupons")
public class CouponAdminController {

    private final AdminService adminService;

    public CouponAdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // List all coupons
    @GetMapping
    public ResponseEntity<List<Coupon>> list() {
        List<Coupon> list = adminService.listCoupons();
        return ResponseEntity.ok(list);
    }

    // Create coupon
    @PostMapping
    public ResponseEntity<Coupon> create(@RequestBody Coupon payload) {
        Coupon saved = adminService.createCoupon(payload);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Update coupon
    @PutMapping("/{id}")
    public ResponseEntity<Coupon> update(@PathVariable Long id, @RequestBody Coupon payload) {
        Optional<Coupon> updated = adminService.updateCoupon(id, payload);
        return updated
                .map(c -> ResponseEntity.ok(c))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete coupon
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean existed = adminService.deleteCouponIfExists(id);
        if (existed) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }
}