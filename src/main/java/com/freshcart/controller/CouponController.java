package com.freshcart.controller;

import com.freshcart.model.Coupon;
import com.freshcart.repository.CouponRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/coupons")
@CrossOrigin(origins = "*")
public class CouponController {

    private final CouponRepository couponRepository;

    public CouponController(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @GetMapping
    public List<Coupon> getAllActiveCoupons() {
        return couponRepository.findAllByActiveTrue();
    }

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateCoupon(@RequestBody Map<String, Object> payload) {
        String code = (String) payload.get("code");
        Number subtotalNum = (Number) payload.get("subtotal");

        Map<String, Object> response = new HashMap<>();
        if (code == null || code.isBlank()) {
            response.put("valid", false);
            response.put("message", "Please enter a coupon code");
            return ResponseEntity.badRequest().body(response);
        }

        double subtotal = subtotalNum != null ? subtotalNum.doubleValue() : 0.0;
        Optional<Coupon> opt = couponRepository.findByCodeIgnoreCaseAndActiveTrue(code.trim());

        if (opt.isEmpty()) {
            response.put("valid", false);
            response.put("message", "Invalid or expired coupon code");
            return ResponseEntity.badRequest().body(response);
        }

        Coupon c = opt.get();
        if (subtotal < c.getMinSubtotal()) {
            double diff = Math.round((c.getMinSubtotal() - subtotal) * 100.0) / 100.0;
            response.put("valid", false);
            response.put("message", "Add ₹" + diff + " more to activate " + c.getCode());
            return ResponseEntity.badRequest().body(response);
        }

        double discount = 0.0;
        if ("flat".equalsIgnoreCase(c.getType())) {
            discount = Math.min(c.getDiscount(), subtotal);
        } else if ("delivery".equalsIgnoreCase(c.getType())) {
            discount = 30.0; // Standard delivery fee
        } else if ("percent".equalsIgnoreCase(c.getType())) {
            discount = Math.round(subtotal * c.getDiscount());
            if (c.getMaxDiscount() != null) {
                discount = Math.min(discount, c.getMaxDiscount());
            }
        }

        response.put("valid", true);
        response.put("code", c.getCode());
        response.put("type", c.getType());
        response.put("discount", discount);
        response.put("description", c.getDescription());
        response.put("message", "Coupon " + c.getCode() + " applied successfully!");

        return ResponseEntity.ok(response);
    }
}
