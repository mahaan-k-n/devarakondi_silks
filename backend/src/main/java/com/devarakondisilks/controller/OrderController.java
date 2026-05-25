package com.devarakondisilks.controller;

import com.devarakondisilks.dto.OrderRequest;
import com.devarakondisilks.dto.OrderResponse;
import com.devarakondisilks.entity.Order;
import com.devarakondisilks.service.OrderService;
import com.devarakondisilks.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<Order> getOrder(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByNumber(orderNumber));
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> payload) {
        boolean isValid = paymentService.verifyPaymentSignature(
                payload.get("razorpay_order_id"),
                payload.get("razorpay_payment_id"),
                payload.get("razorpay_signature")
        );
        
        if (isValid) {
            Order order = orderService.confirmOrderPayment(
                    payload.get("razorpay_order_id"),
                    payload.get("razorpay_payment_id")
            );
            if (order != null) {
                return ResponseEntity.ok(Map.of("status", "success"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("status", "failed", "message", "Order not found"));
            }
        } else {
            return ResponseEntity.badRequest().body(Map.of("status", "failed", "message", "Invalid signature"));
        }
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<java.util.List<Order>> getUserOrders(@PathVariable String email) {
        return ResponseEntity.ok(orderService.getOrdersByEmail(email));
    }
}
