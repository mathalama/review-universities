package dev.mathalama.backend.service;

import dev.mathalama.backend.config.JwtService;
import dev.mathalama.backend.domain.Role;
import dev.mathalama.backend.domain.User;
import dev.mathalama.backend.domain.UserRedis;
import dev.mathalama.backend.repository.UserRepository;
import dev.mathalama.backend.repository.UserRedisRepository;
import dev.mathalama.backend.web.dto.AuthenticationRequest;
import dev.mathalama.backend.web.dto.AuthenticationResponse;
import dev.mathalama.backend.web.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

    private final UserRepository repository;
    private final UserRedisRepository userRedisRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Value("${application.base-url}")
    private String baseUrl;

    public AuthenticationResponse register(RegisterRequest request) {
        // Проверяем, нет ли уже такого пользователя в основной БД
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        
        // Проверяем, нет ли уже такого пользователя в Redis (еще не подтвердил почту)
        if (userRedisRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("A verification email has already been sent to this address. Please check your inbox.");
        }

        // Генерация токена подтверждения
        String token = UUID.randomUUID().toString();
        
        // Check if this is the first user (ignoring unverified in Redis, checking main DB)
        boolean isFirstUser = repository.count() == 0;
        Role role = isFirstUser ? Role.ADMIN : Role.USER;

        // Сохраняем временного пользователя в Redis
        var unverifiedUser = UserRedis.builder()
                .token(token)
                .email(request.getEmail())
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();
        
        userRedisRepository.save(unverifiedUser);

        // Отправка письма
        String verificationLink = baseUrl + "/api/v1/auth/verify?token=" + token;
        try {
            emailService.sendVerificationEmail(request.getEmail(), verificationLink);
        } catch (Exception e) {
            // Log error but allow registration to proceed for dev/test purposes if email fails
            log.error("Failed to send email to {}: {}", request.getEmail(), e.getMessage());
        }

        return AuthenticationResponse.builder()
                .token("") // JWT не возвращаем
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public String verifyToken(String token) {
        // Ищем пользователя в Redis
        UserRedis unverifiedUser = userRedisRepository.findById(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        // Создаем и сохраняем пользователя в основную БД
        var user = User.builder()
                .email(unverifiedUser.getEmail())
                .firstname(unverifiedUser.getFirstname())
                .lastname(unverifiedUser.getLastname())
                .password(unverifiedUser.getPassword())
                .role(unverifiedUser.getRole())
                .enabled(true)
                .build();
        
        repository.save(user);
        
        // Удаляем из Redis
        userRedisRepository.delete(unverifiedUser);

        return "Email verified successfully! You can now login.";
    }
}