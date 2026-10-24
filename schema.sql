-- ==============================================================
-- FreshCart Online Produce Store - Database Schema & Seed Data
-- Target Database: MySQL 8.0 / MariaDB
-- ==============================================================

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS `freshcart_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `freshcart_db`;

-- 2. Drop existing tables if re-initializing
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `products`;
SET FOREIGN_KEY_CHECKS = 1;

-- 3. Products Table
CREATE TABLE `products` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `emoji` VARCHAR(16) DEFAULT '🥬',
    `category` VARCHAR(50) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `unit` VARCHAR(20) NOT NULL,
    `stock` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `img` VARCHAR(1024) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_category` (`category`),
    INDEX `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Orders Table
CREATE TABLE `orders` (
    `id` VARCHAR(32) PRIMARY KEY,
    `invoice_no` VARCHAR(32) NOT NULL,
    `order_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `customer_name` VARCHAR(150) NOT NULL,
    `customer_phone` VARCHAR(20) NOT NULL,
    `customer_pin` VARCHAR(10) NOT NULL,
    `customer_address` TEXT NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `fee` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `discount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `coupon_code` VARCHAR(50) DEFAULT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `slot` VARCHAR(100) NOT NULL,
    `payment` VARCHAR(100) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'Placed',
    INDEX `idx_order_date` (`order_date`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Order Line Items Table
CREATE TABLE `order_items` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `order_id` VARCHAR(32) NOT NULL,
    `product_id` BIGINT DEFAULT NULL,
    `name` VARCHAR(100) NOT NULL,
    `emoji` VARCHAR(16) DEFAULT '🥬',
    `img` VARCHAR(1024) DEFAULT NULL,
    `unit` VARCHAR(20) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `qty` DECIMAL(10, 2) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    CONSTRAINT `fk_order_items_orders` 
        FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT `fk_order_items_products` 
        FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Seed 24 Sample Vegetables & Fruits with High-Definition Photos
INSERT INTO `products` (`id`, `name`, `emoji`, `category`, `price`, `unit`, `stock`, `img`) VALUES
(1, 'Tomato', '🍅', 'vegetables', 30.00, 'kg', 50.00, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80'),
(2, 'Potato', '🥔', 'vegetables', 28.00, 'kg', 80.00, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80'),
(3, 'Onion', '🧅', 'vegetables', 35.00, 'kg', 80.00, 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80'),
(4, 'Carrot', '🥕', 'vegetables', 45.00, 'kg', 40.00, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80'),
(5, 'Spinach', '🥬', 'leafy greens', 20.00, 'bunch', 30.00, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80'),
(6, 'Coriander', '🌿', 'leafy greens', 15.00, 'bunch', 40.00, 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=400&q=80'),
(7, 'Cabbage', '🥬', 'vegetables', 25.00, 'pc', 30.00, 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=400&q=80'),
(8, 'Cauliflower', '🥦', 'vegetables', 40.00, 'pc', 25.00, 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=400&q=80'),
(9, 'Broccoli', '🥦', 'exotic', 90.00, 'pc', 15.00, 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=400&q=80'),
(10, 'Brinjal', '🍆', 'vegetables', 38.00, 'kg', 35.00, 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80'),
(11, 'Green Chilli', '🌶️', 'vegetables', 60.00, 'kg', 20.00, 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=80'),
(12, 'Cucumber', '🥒', 'vegetables', 32.00, 'kg', 40.00, 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=400&q=80'),
(13, 'Capsicum', '🫑', 'vegetables', 70.00, 'kg', 25.00, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80'),
(14, 'Sweet Corn', '🌽', 'vegetables', 20.00, 'pc', 50.00, 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80'),
(15, 'Garlic', '🧄', 'vegetables', 160.00, 'kg', 20.00, 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=400&q=80'),
(16, 'Banana', '🍌', 'fruits', 50.00, 'dozen', 40.00, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80'),
(17, 'Apple', '🍎', 'fruits', 160.00, 'kg', 40.00, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80'),
(18, 'Orange', '🍊', 'fruits', 90.00, 'kg', 35.00, 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=400&q=80'),
(19, 'Mango', '🥭', 'fruits', 130.00, 'kg', 30.00, 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80'),
(20, 'Grapes', '🍇', 'fruits', 110.00, 'kg', 25.00, 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=400&q=80'),
(21, 'Watermelon', '🍉', 'fruits', 25.00, 'kg', 30.00, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80'),
(22, 'Pineapple', '🍍', 'fruits', 60.00, 'pc', 20.00, 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=400&q=80'),
(23, 'Strawberry', '🍓', 'exotic', 120.00, 'box', 12.00, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400&q=80'),
(24, 'Lemon', '🍋', 'fruits', 80.00, 'kg', 30.00, 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=400&q=80');

-- 7. Promotional Coupons Table
CREATE TABLE IF NOT EXISTS `coupons` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(32) NOT NULL UNIQUE,
    `discount` DECIMAL(10, 2) NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `min_subtotal` DECIMAL(10, 2) NOT NULL,
    `max_discount` DECIMAL(10, 2) DEFAULT NULL,
    `description` VARCHAR(255) DEFAULT NULL,
    `active` BOOLEAN DEFAULT TRUE,
    INDEX `idx_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `coupons` (`id`, `code`, `discount`, `type`, `min_subtotal`, `max_discount`, `description`, `active`) VALUES
(1, 'FRESH50', 50.00, 'flat', 399.00, NULL, '₹50 OFF on orders above ₹399', TRUE),
(2, 'FREEDEL', 30.00, 'delivery', 0.00, NULL, 'Free delivery on your order', TRUE),
(3, 'FIRST100', 100.00, 'flat', 599.00, NULL, '₹100 OFF on orders above ₹599', TRUE),
(4, 'VEGGIE10', 0.10, 'percent', 200.00, 80.00, '10% OFF up to ₹80 above ₹200', TRUE)
ON DUPLICATE KEY UPDATE `code` = VALUES(`code`);

