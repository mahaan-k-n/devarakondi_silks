package com.devarakondisilks.controller;

import com.devarakondisilks.entity.Order;
import com.devarakondisilks.entity.Product;
import com.devarakondisilks.repository.OrderRepository;
import com.devarakondisilks.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Value("${admin.secret}")
    private String adminSecret;

    // A simple method to check the secret key wrapper
    private boolean isAuthorized(String secret) {
        return adminSecret.equals(secret);
    }

    @PostMapping("/auth")
    public ResponseEntity<?> authenticate(@RequestBody Map<String, String> payload) {
        if (isAuthorized(payload.get("secret"))) {
            return ResponseEntity.ok(Map.of("status", "success"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid Secret Key"));
    }

    @GetMapping("/orders")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<?> getAllOrders(@RequestHeader("X-Admin-Secret") String secret) {
        if (!isAuthorized(secret)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        
        List<OrderDto> ordersList = orderRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"))
            .stream()
            .map(o -> {
                List<OrderItemDto> itemDtos = o.getItems().stream()
                    .map(i -> new OrderItemDto(
                        i.getProduct() != null ? i.getProduct().getName() : "Unknown",
                        i.getQuantity()
                    ))
                    .collect(java.util.stream.Collectors.toList());

                return new OrderDto(
                    o.getOrderNumber(),
                    o.getCreatedAt() != null ? o.getCreatedAt().toString() : "",
                    o.getCustomerName(),
                    o.getPhone(),
                    o.getCity(),
                    o.getState() != null ? o.getState() : "",
                    o.getStatus() != null ? o.getStatus().name() : "",
                    o.getPaymentMethod(),
                    o.getTotal(),
                    itemDtos
                );
            })
            .collect(java.util.stream.Collectors.toList());
            
        return ResponseEntity.ok(ordersList);
    }
    
    // Internal DTOs to prevent lazy loading Jackson errors
    record OrderItemDto(String name, int quantity) {}
    record OrderDto(String orderNumber, String createdAt, String customerName, String phone, String city, String state, String status, String paymentMethod, java.math.BigDecimal total, List<OrderItemDto> items) {}

    @PostMapping("/products")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> addProduct(@RequestHeader("X-Admin-Secret") String secret, @RequestBody AddProductRequest request) {
        if (!isAuthorized(secret)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        
        com.devarakondisilks.entity.Category category = new com.devarakondisilks.entity.Category();
        category.setId(request.categoryId()); // Assume category exists
        
        Product p = new Product();
        p.setName(request.name());
        p.setDescription(request.description());
        p.setOrigin("Mysuru");
        p.setFabric("Pure Silk");
        p.setOccasion("Festival");
        p.setDesign("Traditional Zari");
        p.setOriginalPrice(request.price().multiply(new java.math.BigDecimal("1.2"))); // Dummy MSLP
        p.setPrice(request.price());
        p.setStock(request.stock());
        p.setIsNew(true);
        p.setIsBestseller(false);
        p.setIsMagga(true);
        p.setCategory(category);
        
        Product saved = productRepository.save(p);
        
        // Add image
        com.devarakondisilks.entity.ProductImage img = new com.devarakondisilks.entity.ProductImage();
        img.setImageUrl(request.imageUrl());
        img.setIsPrimary(true);
        img.setSortOrder(1);
        img.setProduct(saved);
        
        saved.getImages().add(img);
        productRepository.save(saved);
        
        return ResponseEntity.ok(saved);
    }
    
    record AddProductRequest(Long categoryId, String name, String description, java.math.BigDecimal price, int stock, String imageUrl) {}

    @PutMapping("/products/{id}/stock")
    public ResponseEntity<?> updateStock(@RequestHeader("X-Admin-Secret") String secret, @PathVariable Long id, @RequestBody Map<String, Integer> payload) {
        if (!isAuthorized(secret)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        
        return productRepository.findById(id).map(p -> {
            p.setStock(payload.get("stock"));
            productRepository.save(p);
            return ResponseEntity.ok(p);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@RequestHeader("X-Admin-Secret") String secret, @PathVariable Long id) {
        if (!isAuthorized(secret)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
