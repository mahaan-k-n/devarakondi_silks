package com.devarakondisilks.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {

    @NotBlank(message = "Name is required")
    private String customerName;

    @NotBlank(message = "Phone is required")
    private String phone;

    private String email;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Pincode is required")
    private String pincode;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod; 

    @NotEmpty(message = "Order must have at least one item")
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        @NotNull(message = "Product ID is required")
        private Long productId;

        @NotNull(message = "Quantity is required")
        private Integer quantity;
    }
}
