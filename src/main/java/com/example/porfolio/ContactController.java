package com.example.porfolio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api")
public class ContactController {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String myEmail;

    // Real-time thread-safe visitor counter
    private final AtomicLong visitorCount = new AtomicLong(0);

    // 1. Email Dispatch API
    @PostMapping("/contact")
    public ResponseEntity<Map<String, String>> handleContact(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String message = payload.get("message");

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(myEmail);
            mailMessage.setTo(myEmail); // Direct aapke anirudhsingh.work07@gmail.com inbox par aayega
            mailMessage.setSubject("Portfolio Contact: " + name);
            mailMessage.setText("New Message Received!\n\nName: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message);

            mailSender.send(mailMessage);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Thanks " + name + "! Your message was sent directly to my inbox."
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "status", "error",
                    "message", "Failed to send email. Please try again later."
            ));
        }
    }

    // 2. Visitor Counter API
    @GetMapping("/visitor-count")
    public Map<String, Object> getVisitorCount() {
        long currentCount = visitorCount.incrementAndGet();
        return Map.of("totalVisitors", currentCount);
    }
}