package com.devarakondisilks.service;

import com.devarakondisilks.entity.Order;
import com.devarakondisilks.entity.OrderItem;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${store.owner.email}")
    private String ownerEmail;

    public void sendOrderConfirmationToCustomer(Order order) {
        System.out.println("DEBUG: sendOrderConfirmationToCustomer entering... Order: " + order.getOrderNumber() + ", Customer Email: " + order.getEmail());
        if (order.getEmail() == null || order.getEmail().trim().isEmpty()) {
            System.out.println("DEBUG: Customer email is null or empty. Skipping email dispatch.");
            return;
        }
        
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(order.getEmail());
            helper.setSubject("Order Confirmation - " + order.getOrderNumber() + " | Devarakondi Silks");
            
            // Build Itemized HTML Rows
            StringBuilder itemsHtml = new StringBuilder();
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    itemsHtml.append("<tr>")
                             .append("<td style='padding: 10px; border-bottom: 1px solid #eee;'>").append(item.getProduct().getName()).append("</td>")
                             .append("<td style='padding: 10px; border-bottom: 1px solid #eee; text-align: center;'>").append(item.getQuantity()).append("</td>")
                             .append("<td style='padding: 10px; border-bottom: 1px solid #eee; text-align: right;'>₹").append(item.getPriceAtPurchase().intValue() * item.getQuantity()).append("</td>")
                             .append("</tr>");
                }
            }
            
            String htmlBody = "<html><body style='font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 20px;'>"
                    + "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);'>"
                    + "  <div style='background-color: #7A1C2E; padding: 30px; text-align: center;'>"
                    + "    <h1 style='color: #F5EFE0; margin: 0; font-size: 24px; letter-spacing: 1px;'>DEVARAKONDI SILKS</h1>"
                    + "    <p style='color: #C9A84C; margin: 5px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;'>Molakalmur Magga Heritage</p>"
                    + "  </div>"
                    + "  <div style='padding: 30px;'>"
                    + "    <h2 style='color: #333333; font-size: 20px; font-weight: normal; margin-top: 0;'>Order Confirmed</h2>"
                    + "    <p style='color: #555555; line-height: 1.6; font-size: 15px;'>Dear " + order.getCustomerName() + ",<br><br>Thank you for bringing a piece of heritage to your wardrobe! Your order is confirmed and we are preparing your elegant silk sarees for dispatch.</p>"
                    + "    <div style='background-color: #fcfbfa; border: 1px solid #f0ebe1; padding: 15px; border-radius: 4px; margin: 20px 0;'>"
                    + "      <p style='margin: 0 0 5px; color: #555;'><strong>Order ID:</strong> " + order.getOrderNumber() + "</p>"
                    + "      <p style='margin: 0; color: #555;'><strong>Payment:</strong> " + order.getPaymentMethod() + "</p>"
                    + "    </div>"
                    + "    <table style='width: 100%; border-collapse: collapse; margin-bottom: 20px;'>"
                    + "      <thead>"
                    + "        <tr>"
                    + "          <th style='text-align: left; padding: 10px; border-bottom: 2px solid #ddd; color: #333; font-size: 14px;'>Item</th>"
                    + "          <th style='text-align: center; padding: 10px; border-bottom: 2px solid #ddd; color: #333; font-size: 14px;'>Qty</th>"
                    + "          <th style='text-align: right; padding: 10px; border-bottom: 2px solid #ddd; color: #333; font-size: 14px;'>Total</th>"
                    + "        </tr>"
                    + "      </thead>"
                    + "      <tbody>"
                    +          itemsHtml.toString()
                    + "      </tbody>"
                    + "      <tfoot>"
                    + "        <tr>"
                    + "          <td colspan='2' style='text-align: right; padding: 15px 10px 0; font-weight: bold; color: #333;'>Grand Total:</td>"
                    + "          <td style='text-align: right; padding: 15px 10px 0; font-weight: bold; color: #7A1C2E; font-size: 18px;'>₹" + order.getTotal() + "</td>"
                    + "        </tr>"
                    + "      </tfoot>"
                    + "    </table>"
                    + "    <p style='color: #777777; font-size: 13px; line-height: 1.5; border-top: 1px solid #eee; padding-top: 20px;'><strong>Shipping Policy:</strong> Orders are dispatched within 2–3 working days. Returns accepted within 7 days. If you have any questions, kindly reply to this email or contact us via WhatsApp.</p>"
                    + "  </div>"
                    + "</div>"
                    + "</body></html>";
                    
            helper.setText(htmlBody, true);
            mailSender.send(message);
            System.out.println("Customer HTML email sent for " + order.getOrderNumber());
        } catch (Exception e) {
            System.err.println("Failed to send customer email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void sendNewOrderNotificationToOwner(Order order) {
        System.out.println("DEBUG: sendNewOrderNotificationToOwner entering... Order: " + order.getOrderNumber() + ", Owner Email: " + ownerEmail);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(ownerEmail);
            helper.setSubject("🚨 NEW ORDER: " + order.getOrderNumber() + " - ₹" + order.getTotal());
            
            String htmlBody = "<html><body style='font-family: sans-serif; background: #fdfdfd; padding: 20px;'>"
                    + "<div style='border-left: 4px solid #10b981; padding-left: 15px; margin-bottom: 20px;'>"
                    + "  <h2 style='color: #10b981; margin: 0;'>New Order Received!</h2>"
                    + "  <p style='color: #555; margin: 5px 0 0;'>You have received a new sale for ₹" + order.getTotal() + ".</p>"
                    + "</div>"
                    + "<table style='width: 100%; max-width: 400px; text-align: left; border-collapse: collapse; font-size: 14px;'>"
                    + "  <tr><th style='padding: 8px 0; color: #555;'>Order ID</th><td style='padding: 8px 0;'><strong>" + order.getOrderNumber() + "</strong></td></tr>"
                    + "  <tr><th style='padding: 8px 0; color: #555;'>Customer</th><td style='padding: 8px 0;'>" + order.getCustomerName() + "</td></tr>"
                    + "  <tr><th style='padding: 8px 0; color: #555;'>Phone</th><td style='padding: 8px 0;'><a href='tel:" + order.getPhone() + "'>" + order.getPhone() + "</a></td></tr>"
                    + "  <tr><th style='padding: 8px 0; color: #555;'>Location</th><td style='padding: 8px 0;'>" + order.getCity() + ", " + order.getState() + "</td></tr>"
                    + "  <tr><th style='padding: 8px 0; color: #555;'>Method</th><td style='padding: 8px 0;'>" + order.getPaymentMethod() + "</td></tr>"
                    + "</table>"
                    + "<p style='margin-top: 20px;'><a href='http://localhost:8080/admin.html' style='display: inline-block; background: #C9A84C; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 4px; font-weight: bold;'>Login to Dashboard</a></p>"
                    + "</body></html>";
                    
            helper.setText(htmlBody, true);
            mailSender.send(message);
            System.out.println("Owner HTML notification sent for " + order.getOrderNumber());
        } catch (Exception e) {
            System.err.println("Failed to send owner notification email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
