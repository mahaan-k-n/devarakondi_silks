package com.devarakondisilks.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderResponse {
    private String orderNumber;
    private String status;
    private BigDecimal total;
    private String paymentId; // Used for Razorpay Order ID to pass to frontend
    private String message;
}
