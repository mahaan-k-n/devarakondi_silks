package com.devarakondisilks.controller;

import com.devarakondisilks.entity.Product;
import com.devarakondisilks.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<Product>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String fabric,
            @RequestParam(required = false) String occasion,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false, defaultValue = "new") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(productService.getProducts(category, fabric, occasion, minPrice, maxPrice, sort, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/{id}/stock")
    public ResponseEntity<Map<String, Integer>> getProductStock(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(Map.of("stock", product.getStock()));
    }

    @GetMapping("/bestsellers")
    public ResponseEntity<List<Product>> getBestsellers() {
        return ResponseEntity.ok(productService.getBestsellers());
    }

    @GetMapping("/new-arrivals")
    public ResponseEntity<List<Product>> getNewArrivals() {
        return ResponseEntity.ok(productService.getNewArrivals());
    }
}
