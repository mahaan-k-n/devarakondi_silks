package com.devarakondisilks.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
            "status", "UP",
            "message", "Devarakondi Silks Backend API is running successfully!"
        );
    }
}
