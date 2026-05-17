package com.devarakondisilks.repository;

import com.devarakondisilks.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE " +
           "(:slug IS NULL OR p.category.slug = :slug) AND " +
           "(:fabric IS NULL OR p.fabric = :fabric) AND " +
           "(:occasion IS NULL OR p.occasion = :occasion) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Product> findFilteredProducts(
            @Param("slug") String slug,
            @Param("fabric") String fabric,
            @Param("occasion") String occasion,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

    List<Product> findByIsBestsellerTrue(Pageable pageable);

    List<Product> findByIsNewTrue(Pageable pageable);
}
