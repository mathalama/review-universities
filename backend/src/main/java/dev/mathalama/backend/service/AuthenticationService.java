package dev.mathalama.backend.service;

import dev.mathalama.backend.config.JwtService;
import dev.mathalama.backend.domain.PasswordResetTokenRedis;
import dev.mathalama.backend.domain.Role;
import dev.mathalama.backend.domain.User;
import dev.mathalama.backend.domain.UserRedis;
import dev.mathalama.backend.repository.PasswordResetTokenRepository;
import dev.mathalama.backend.repository.UserRepository;
import dev.mathalama.backend.repository.UserRedisRepository;
import dev.mathalama.backend.validation.EmailDomainValidator;
import dev.mathalama.backend.web.dto.AuthenticationRequest;
import dev.mathalama.backend.web.dto.AuthenticationResponse;
import dev.mathalama.backend.web.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

    private final UserRepository repository;
    private final UserRedisRepository userRedisRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final EmailDomainValidator emailValidator;

    private String baseUrl = "https://unireview-ui7q.onrender.com";

    public AuthenticationResponse register(RegisterRequest request) {
        // Validate Email Domain
        if (!emailValidator.isValid(request.getEmail())) {
            throw new RuntimeException("Email domain not allowed. Please use a common provider (Gmail, Yandex, Mail.ru, Outlook, etc.)");
        }

        // Check if user exists in main DB
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        
        // Check if user exists in Redis (unverified)
        if (userRedisRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("A verification email has already been sent to this address. Please check your inbox.");
        }

        // Generate verification token
        String token = UUID.randomUUID().toString();
        
        // Check if this is the first user
        boolean isFirstUser = repository.count() == 0;
        Role role = isFirstUser ? Role.ADMIN : Role.USER;

        // Save temporary user to Redis
        var unverifiedUser = UserRedis.builder()
                .token(token)
                .email(request.getEmail())
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();
        
        userRedisRepository.save(unverifiedUser);

        // Send email
        String verificationLink = baseUrl + "/api/v1/auth/verify?token=" + token;
        
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            try {
                emailService.sendVerificationEmail(request.getEmail(), verificationLink);
            } catch (Exception e) {
                log.error("Failed to send email to {}: {}", request.getEmail(), e.getMessage());
            }
        });

        return AuthenticationResponse.builder()
                .token("")
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        var user = (User) auth.getPrincipal();
        var jwtToken = jwtService.generateToken(user);
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    @Transactional
    public String verifyToken(String token) {
        // Find user in Redis
        UserRedis unverifiedUser = userRedisRepository.findById(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        // Create and save user to main DB
        var user = User.builder()
                .email(unverifiedUser.getEmail())
                .firstname(unverifiedUser.getFirstname())
                .lastname(unverifiedUser.getLastname())
                .password(unverifiedUser.getPassword()) // Password is already encoded
                .role(unverifiedUser.getRole())
                .enabled(true)
                .build();
        
        repository.save(user);
        
        // Remove from Redis
        userRedisRepository.delete(unverifiedUser);

        return "Email verified successfully! You can now login.";
    }

    @Transactional
    public void resendVerification(String email) {
        var oldUserRedis = userRedisRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found or already verified"));

        // Delete old token
        userRedisRepository.delete(oldUserRedis);

        // Generate new token
        String newToken = UUID.randomUUID().toString();

        // Create new record
        var newUserRedis = UserRedis.builder()
                .token(newToken)
                .email(oldUserRedis.getEmail())
                .firstname(oldUserRedis.getFirstname())
                .lastname(oldUserRedis.getLastname())
                .password(oldUserRedis.getPassword())
                .role(oldUserRedis.getRole())
                .build();

        userRedisRepository.save(newUserRedis);

        // Send email
        String verificationLink = baseUrl + "/api/v1/auth/verify?token=" + newToken;
        try {
            emailService.sendVerificationEmail(email, verificationLink);
        } catch (Exception e) {
            log.error("Failed to resend email to {}: {}", email, e.getMessage());
            throw new RuntimeException("Failed to send email");
        }
    }

    public void forgotPassword(String email) {
        var user = repository.findByEmail(email);
        if (user.isEmpty()) {
            return; 
        }

        // Clean up any existing tokens
        passwordResetTokenRepository.findByEmail(email).ifPresent(passwordResetTokenRepository::delete);

        String token = UUID.randomUUID().toString();
        var resetToken = PasswordResetTokenRedis.builder()
                .token(token)
                .email(email)
                .build();
        
        passwordResetTokenRepository.save(resetToken);

        String resetLink = "https://university.mathalama.dev/reset-password?token=" + token;
        java.util.concurrent.CompletableFuture.runAsync(() -> 
            emailService.sendPasswordResetEmail(email, resetLink)
        );
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        var resetToken = passwordResetTokenRepository.findById(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired password reset token"));

        var user = repository.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        repository.save(user);

        passwordResetTokenRepository.delete(resetToken);
    }
}
