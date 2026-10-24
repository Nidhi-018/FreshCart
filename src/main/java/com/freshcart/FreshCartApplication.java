package com.freshcart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FreshCartApplication {

    public static void main(String[] args) {
        SpringApplication.run(FreshCartApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🥦 FreshCart Backend is running on port 8080!");
        System.out.println("🌐 Storefront:   http://localhost:8080");
        System.out.println("📦 Products API: http://localhost:8080/api/products");
        System.out.println("🛍️ Orders API:   http://localhost:8080/api/orders");
        System.out.println("💾 H2 Console:   http://localhost:8080/h2-console");
        System.out.println("=================================================");
    }
}
