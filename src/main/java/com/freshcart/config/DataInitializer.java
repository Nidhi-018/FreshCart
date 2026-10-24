package com.freshcart.config;

import com.freshcart.model.Coupon;
import com.freshcart.model.Product;
import com.freshcart.repository.CouponRepository;
import com.freshcart.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;

    public DataInitializer(ProductRepository productRepository, CouponRepository couponRepository) {
        this.productRepository = productRepository;
        this.couponRepository = couponRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            productRepository.saveAll(getDefaultProducts());
            System.out.println(">>> FreshCart: Seeded 24 initial products into database.");
        }

        if (couponRepository.count() == 0) {
            couponRepository.saveAll(getDefaultCoupons());
            System.out.println(">>> FreshCart: Seeded promotional coupons into database.");
        }
    }

    public static List<Coupon> getDefaultCoupons() {
        List<Coupon> list = new ArrayList<>();
        list.add(new Coupon("FRESH50", 50.0, "flat", 399.0, null, "₹50 OFF on orders above ₹399", true));
        list.add(new Coupon("FREEDEL", 30.0, "delivery", 0.0, null, "Free delivery on your order", true));
        list.add(new Coupon("FIRST100", 100.0, "flat", 599.0, null, "₹100 OFF on orders above ₹599", true));
        list.add(new Coupon("VEGGIE10", 0.10, "percent", 200.0, 80.0, "10% OFF up to ₹80 above ₹200", true));
        return list;
    }

    public static List<Product> getDefaultProducts() {
        List<Product> list = new ArrayList<>();
        list.add(new Product("Tomato", "🍅", "vegetables", 30.0, "kg", 50.0, "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Potato", "🥔", "vegetables", 28.0, "kg", 80.0, "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Onion", "🧅", "vegetables", 35.0, "kg", 80.0, "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Carrot", "🥕", "vegetables", 45.0, "kg", 40.0, "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Spinach", "🥬", "leafy greens", 20.0, "bunch", 30.0, "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Coriander", "🌿", "leafy greens", 15.0, "bunch", 40.0, "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Cabbage", "🥬", "vegetables", 25.0, "pc", 30.0, "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Cauliflower", "🥦", "vegetables", 40.0, "pc", 25.0, "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Broccoli", "🥦", "exotic", 90.0, "pc", 15.0, "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Brinjal", "🍆", "vegetables", 38.0, "kg", 35.0, "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Green Chilli", "🌶️", "vegetables", 60.0, "kg", 20.0, "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Cucumber", "🥒", "vegetables", 32.0, "kg", 40.0, "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Capsicum", "🫑", "vegetables", 70.0, "kg", 25.0, "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Sweet Corn", "🌽", "vegetables", 20.0, "pc", 50.0, "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Garlic", "🧄", "vegetables", 160.0, "kg", 20.0, "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Banana", "🍌", "fruits", 50.0, "dozen", 40.0, "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Apple", "🍎", "fruits", 160.0, "kg", 40.0, "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Orange", "🍊", "fruits", 90.0, "kg", 35.0, "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Mango", "🥭", "fruits", 130.0, "kg", 30.0, "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Grapes", "🍇", "fruits", 110.0, "kg", 25.0, "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Watermelon", "🍉", "fruits", 25.0, "kg", 30.0, "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Pineapple", "🍍", "fruits", 60.0, "pc", 20.0, "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Strawberry", "🍓", "exotic", 120.0, "box", 12.0, "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400&q=80"));
        list.add(new Product("Lemon", "🍋", "fruits", 80.0, "kg", 30.0, "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=400&q=80"));
        return list;
    }
}
