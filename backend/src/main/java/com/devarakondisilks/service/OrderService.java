package com.devarakondisilks.service;

import com.devarakondisilks.dto.OrderRequest;
import com.devarakondisilks.dto.OrderResponse;
import com.devarakondisilks.entity.Order;
import com.devarakondisilks.entity.OrderItem;
import com.devarakondisilks.entity.Product;
import com.devarakondisilks.exception.ResourceNotFoundException;
import com.devarakondisilks.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final PaymentService paymentService;
    private final EmailService emailService;
    private final WhatsappService whatsappService;

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setPhone(request.getPhone());
        order.setEmail(request.getEmail());
        order.setAddress(request.getAddress());
        order.setCity(request.getCity());
        order.setPincode(request.getPincode());
        order.setState(request.getState());
        order.setPaymentMethod(request.getPaymentMethod());

        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productService.getProductById(itemReq.getProductId());
            
            // Decrement Stock
            productService.decrementStock(product.getId(), itemReq.getQuantity());

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPriceAtPurchase(product.getPrice());

            subtotal = subtotal.add(product.getPrice().multiply(new BigDecimal(itemReq.getQuantity())));
            order.getItems().add(item);
        }

        order.setSubtotal(subtotal);
        order.setShipping(BigDecimal.ZERO); // Free shipping
        order.setTotal(subtotal.add(order.getShipping()));

        // Save order and check for Razorpay
        orderRepository.save(order);

        OrderResponse response = new OrderResponse();
        response.setOrderNumber(order.getOrderNumber());
        response.setStatus(order.getStatus().name());
        response.setTotal(order.getTotal());

        if (!"COD".equalsIgnoreCase(request.getPaymentMethod())) {
            try {
                String razorpayOrderId = paymentService.createRazorpayOrder(order.getTotal(), order.getOrderNumber());
                response.setPaymentId(razorpayOrderId);
                order.setPaymentId(razorpayOrderId);
                orderRepository.save(order);
            } catch (Exception e) {
                // Return failed status if Razorpay order creation fails
                response.setMessage("Failed to create Razorpay Order. Using dummy or failing.");
            }
        }
        
        if ("COD".equalsIgnoreCase(request.getPaymentMethod())) {
            // Trigger emails asynchronously for COD immediately
            confirmOrderNotifications(order);
        }
        
        return response;
    }

    public void confirmOrderNotifications(Order order) {
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            emailService.sendNewOrderNotificationToOwner(order);
            emailService.sendOrderConfirmationToCustomer(order);
            whatsappService.sendOrderNotificationToOwner(order);
            whatsappService.sendOrderConfirmationToCustomer(order);
        });
    }

    @Transactional(readOnly = true)
    public Order getOrderByPaymentId(String paymentId) {
        Order order = orderRepository.findByPaymentId(paymentId).orElse(null);
        if (order != null) {
            order.getItems().size(); // Eagerly load items for async email generation
            order.getItems().forEach(item -> item.getProduct().getName()); // Eagerly load products
        }
        return order;
    }


    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderNumber));
    }

    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByEmailOrderByCreatedAtDesc(email);
    }
}
