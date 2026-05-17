package com.devarakondisilks.service;

import com.devarakondisilks.entity.Product;
import com.devarakondisilks.exception.ResourceNotFoundException;
import com.devarakondisilks.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Page<Product> getProducts(String category, String fabric, String occasion, 
                                     BigDecimal minPrice, BigDecimal maxPrice, 
                                     String sort, int page, int size) {
        
        Sort sortObj = Sort.unsorted();
        if ("price-asc".equals(sort)) sortObj = Sort.by("price").ascending();
        else if ("price-desc".equals(sort)) sortObj = Sort.by("price").descending();
        else if ("new".equals(sort)) sortObj = Sort.by("createdAt").descending();
        
        Pageable pageable = PageRequest.of(page, size, sortObj);
        
        // Transform spaces to plusses if needed or handle directly
        return productRepository.findFilteredProducts(category, fabric, occasion, minPrice, maxPrice, pageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public List<Product> getBestsellers() {
        return productRepository.findByIsBestsellerTrue(PageRequest.of(0, 8));
    }

    public List<Product> getNewArrivals() {
        return productRepository.findByIsNewTrue(PageRequest.of(0, 8));
    }

    @Transactional
    public void decrementStock(Long id, int quantity) {
        Product product = getProductById(id);
        if (product.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock for product " + product.getName());
        }
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);
    }
}
