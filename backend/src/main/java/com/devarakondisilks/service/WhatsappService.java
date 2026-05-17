package com.devarakondisilks.service;

import com.devarakondisilks.entity.Order;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class WhatsappService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.whatsapp.from}")
    private String twilioWhatsappNumber;

    @Value("${twilio.whatsapp.owner}")
    private String ownerWhatsappNumber;

    @PostConstruct
    public void init() {
        if (!accountSid.equals("YOUR_TWILIO_SID_HERE")) {
            Twilio.init(accountSid, authToken);
        }
    }

    public void sendOrderNotificationToOwner(Order order) {
        if (accountSid.equals("YOUR_TWILIO_SID_HERE")) {
            System.out.println("Twilio not configured. Skipping WhatsApp notification.");
            return;
        }

        try {
            String msg = String.format(
                "🛍️ *NEW ORDER RECEIVED* 🛍️\n\n" +
                "📋 *Order #:* %s\n" +
                "👤 *Customer:* %s\n" +
                "📞 *Phone:* %s\n" +
                "💰 *Total:* ₹%s\n" +
                "📦 *Status:* Processing\n\n" +
                "👉 Log in to Admin Dashboard to view full order details and update status.",
                order.getOrderNumber(),
                order.getCustomerName(),
                order.getPhone(),
                order.getTotal()
            );

            Message message = Message.creator(
                new PhoneNumber("whatsapp:" + ownerWhatsappNumber),
                new PhoneNumber("whatsapp:" + twilioWhatsappNumber),
                msg
            ).create();

            System.out.println("Owner WhatsApp sent successfully. SID: " + message.getSid());
        } catch (Exception e) {
            System.err.println("Failed to send Owner WhatsApp message: " + e.getMessage());
        }
    }

    public void sendOrderConfirmationToCustomer(Order order) {
        if (accountSid.equals("YOUR_TWILIO_SID_HERE") || order.getPhone() == null || order.getPhone().trim().isEmpty()) {
            return;
        }

        try {
            // Assuming the customer phone is an Indian number, so we default prefix +91 if length is 10
            String phoneStr = order.getPhone().replaceAll("\\s+", "");
            if (phoneStr.length() == 10) {
                phoneStr = "+91" + phoneStr;
            } else if (!phoneStr.startsWith("+")) {
                phoneStr = "+" + phoneStr;
            }

            String msg = String.format(
                "✨ *DEVARAKONDI SILKS* ✨\n\n" +
                "Dear %s,\n" +
                "Your elegant silk saree order is confirmed! 🤍\n\n" +
                "🧾 *Order ID:* %s\n" +
                "📦 *Status:* Processing\n" +
                "💳 *Total:* ₹%s\n\n" +
                "We are preparing your sarees straight from our Molakalmur Magga. We will notify you once dispatched! 🚚\n\n" +
                "Thank you for preserving the heritage.",
                order.getCustomerName(),
                order.getOrderNumber(),
                order.getTotal()
            );

            Message message = Message.creator(
                new PhoneNumber("whatsapp:" + phoneStr),
                new PhoneNumber("whatsapp:" + twilioWhatsappNumber),
                msg
            ).create();

            System.out.println("Customer WhatsApp sent successfully. SID: " + message.getSid());
        } catch (Exception e) {
            System.err.println("Failed to send Customer WhatsApp message: " + e.getMessage());
        }
    }
}
