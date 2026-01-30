package dev.mathalama.backend.web;

import dev.mathalama.backend.service.AuthenticationService;
import dev.mathalama.backend.domain.User;
import dev.mathalama.backend.web.dto.AuthenticationRequest;
import dev.mathalama.backend.web.dto.AuthenticationResponse;
import dev.mathalama.backend.web.dto.RegisterRequest;
import dev.mathalama.backend.web.dto.UserResponse;
import dev.mathalama.backend.web.dto.ForgotPasswordRequest;
import dev.mathalama.backend.web.dto.ResetPasswordRequest;
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
            @RequestBody @jakarta.validation.Valid AuthenticationRequest request
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

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody @jakarta.validation.Valid ForgotPasswordRequest request) {
        service.forgotPassword(request.getEmail());
        // Always return OK to prevent email enumeration
        return ResponseEntity.ok("If an account exists with this email, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody @jakarta.validation.Valid ResetPasswordRequest request) {
        service.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Password reset successfully. You can now login.");
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
