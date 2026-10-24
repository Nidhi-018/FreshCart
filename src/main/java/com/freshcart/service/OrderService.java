package com.freshcart.service;

import com.freshcart.model.Order;
import com.freshcart.model.OrderItem;
import com.freshcart.model.Product;
import com.freshcart.repository.OrderRepository;
import com.freshcart.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found with id: " + id));
    }

    @Transactional
    public Order createOrder(Order order) {
        if (order.getItems() == null || order.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot place an order with an empty cart");
        }

        // Validate stock availability and deduct atomically
        for (OrderItem item : order.getItems()) {
            Product product = null;
            if (item.getProductId() != null) {
                product = productRepository.findById(item.getProductId()).orElse(null);
            }
            if (product == null && item.getName() != null) {
                List<Product> matches = productRepository.findByNameContainingIgnoreCase(item.getName());
                if (!matches.isEmpty()) {
                    product = matches.get(0);
                }
            }

            if (product == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product not found: " + item.getName());
            }

            if (product.getStock() < item.getQty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Insufficient stock for " + product.getName() + ". Available: " + product.getStock());
            }

            // Deduct stock
            double remainingStock = Math.round((product.getStock() - item.getQty()) * 100.0) / 100.0;
            product.setStock(remainingStock);
            productRepository.save(product);

            // Populate item info
            item.setProductId(product.getId());
            item.setName(product.getName());
            item.setEmoji(product.getEmoji());
            item.setImg(product.getImg());
            item.setUnit(product.getUnit());
            item.setOrder(order);
        }

        // Set IDs and metadata
        String orderId = "FC" + (System.currentTimeMillis() % 10000000);
        order.setId(orderId);
        order.setInvoiceNo("INV-" + orderId);
        order.setOrderDate(LocalDateTime.now());
        if (order.getStatus() == null || order.getStatus().isBlank()) {
            order.setStatus("Placed");
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderStatus(String orderId, String newStatus) {
        Order order = getOrderById(orderId);
        String oldStatus = order.getStatus();

        if (oldStatus.equalsIgnoreCase(newStatus)) {
            return order;
        }

        // If transitioning TO Cancelled from an active status -> restore stock
        if (newStatus.equalsIgnoreCase("Cancelled") && !oldStatus.equalsIgnoreCase("Cancelled")) {
            for (OrderItem item : order.getItems()) {
                if (item.getProductId() != null) {
                    productRepository.findById(item.getProductId()).ifPresent(p -> {
                        double restored = Math.round((p.getStock() + item.getQty()) * 100.0) / 100.0;
                        p.setStock(restored);
                        productRepository.save(p);
                    });
                }
            }
        }
        // If un-cancelling back to an active status -> check and re-deduct
        else if (oldStatus.equalsIgnoreCase("Cancelled") && !newStatus.equalsIgnoreCase("Cancelled")) {
            for (OrderItem item : order.getItems()) {
                if (item.getProductId() != null) {
                    Product p = productRepository.findById(item.getProductId()).orElse(null);
                    if (p != null && p.getStock() < item.getQty()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "Cannot un-cancel order: Insufficient stock for " + p.getName() + " (Only " + p.getStock() + " left)");
                    }
                }
            }
            for (OrderItem item : order.getItems()) {
                if (item.getProductId() != null) {
                    productRepository.findById(item.getProductId()).ifPresent(p -> {
                        double deducted = Math.round((p.getStock() - item.getQty()) * 100.0) / 100.0;
                        p.setStock(deducted);
                        productRepository.save(p);
                    });
                }
            }
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}
