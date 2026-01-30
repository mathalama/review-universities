package dev.mathalama.backend.web;

import dev.mathalama.backend.service.AuthenticationService;
import dev.mathalama.backend.domain.User;
import dev.mathalama.backend.web.dto.AuthenticationRequest;
import dev.mathalama.backend.web.dto.AuthenticationResponse;
import dev.mathalama.backend.web.dto.RegisterRequest;
import dev.mathalama.backend.web.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody @jakarta.validation.Valid RegisterRequest request
    ) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/verify")
    public ResponseEntity<Void> verifyEmail(@RequestParam("token") String token) {
        service.verifyToken(token);
        return ResponseEntity.status(org.springframework.http.HttpStatus.FOUND)
                .location(java.net.URI.create("https://university.mathalama.dev/login?verified=true"))
                .build();
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerification(@RequestParam("email") String email) {
        service.resendVerification(email);
        return ResponseEntity.ok("Verification email resent successfully");
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .role(user.getRole())
                .build());
    }
}