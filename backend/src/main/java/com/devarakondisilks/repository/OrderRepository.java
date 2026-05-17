package com.devarakondisilks.repository;

import com.devarakondisilks.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    Optional<Order> findByPaymentId(String paymentId);
    java.util.List<Order> findByEmailOrderByCreatedAtDesc(String email);
}
