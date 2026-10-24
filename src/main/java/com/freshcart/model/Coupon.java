package com.freshcart.model;

import jakarta.persistence.*;

@Entity
@Table(name = "coupons")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 32)
    private String code;

    @Column(nullable = false)
    private Double discount;

    @Column(nullable = false, length = 20)
    private String type; // flat, percent, delivery

    @Column(nullable = false)
    private Double minSubtotal;

    private Double maxDiscount;

    private String description;

    private Boolean active = true;

    public Coupon() {
    }

    public Coupon(String code, Double discount, String type, Double minSubtotal, Double maxDiscount, String description, Boolean active) {
        this.code = code;
        this.discount = discount;
        this.type = type;
        this.minSubtotal = minSubtotal;
        this.maxDiscount = maxDiscount;
        this.description = description;
        this.active = active;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getMinSubtotal() {
        return minSubtotal;
    }

    public void setMinSubtotal(Double minSubtotal) {
        this.minSubtotal = minSubtotal;
    }

    public Double getMaxDiscount() {
        return maxDiscount;
    }

    public void setMaxDiscount(Double maxDiscount) {
        this.maxDiscount = maxDiscount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
