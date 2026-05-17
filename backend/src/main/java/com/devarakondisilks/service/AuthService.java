package com.devarakondisilks.service;

import com.devarakondisilks.dto.Auth;
import com.devarakondisilks.entity.User;
import com.devarakondisilks.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public Auth.AuthResponse register(Auth.RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(hashPassword(request.getPassword()));
        
        userRepository.save(user);

        return new Auth.AuthResponse(generateToken(), user.getName(), user.getEmail(), "Registration successful");
    }

    public Auth.AuthResponse login(Auth.LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        
        if (optionalUser.isEmpty() || !optionalUser.get().getPassword().equals(hashPassword(request.getPassword()))) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = optionalUser.get();
        return new Auth.AuthResponse(generateToken(), user.getName(), user.getEmail(), "Login successful");
    }

    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    private String generateToken() {
        return UUID.randomUUID().toString() + "-" + System.currentTimeMillis();
    }
}
