package com.devarakondisilks.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    private String fabric;
    private String occasion;

    @Column(nullable = false)
    private BigDecimal price;

    private BigDecimal originalPrice;

    @Column(nullable = false)
    private Integer stock = 0;

    private String origin;
    private String design;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_new")
    private Boolean isNew = false;

    @Column(name = "is_bestseller")
    private Boolean isBestseller = false;

    @Column(name = "is_magga")
    private Boolean isMagga = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<ProductImage> images = new ArrayList<>();
}
