package dev.mathalama.backend.web;

import dev.mathalama.backend.domain.User;
import dev.mathalama.backend.repository.UserRepository;
import dev.mathalama.backend.web.dto.UpdateUserRequest;
import dev.mathalama.backend.web.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository repository;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(repository.findAll().stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .firstname(user.getFirstname())
                        .lastname(user.getLastname())
                        .role(user.getRole())
                        .build())
                .collect(Collectors.toList()));
    }

    @PatchMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @RequestBody @jakarta.validation.Valid UpdateUserRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        repository.save(user);

        return ResponseEntity.ok(UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .role(user.getRole())
                .build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
