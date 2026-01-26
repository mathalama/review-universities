package dev.mathalama.backend.web;

import dev.mathalama.backend.service.UniversityService;
import dev.mathalama.backend.web.dto.CreateUniversityRequest;
import dev.mathalama.backend.web.dto.UniversityResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import dev.mathalama.backend.web.dto.UpdateUniversityRequest;

@RestController
@RequestMapping("/api/v1/universities")
@RequiredArgsConstructor
public class UniversityController {

    private final UniversityService service;

    @GetMapping
    public ResponseEntity<List<UniversityResponse>> getAllUniversities() {
        return ResponseEntity.ok(service.getAllUniversities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UniversityResponse> getUniversityById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getUniversityById(id));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UniversityResponse> createUniversity(@RequestBody @jakarta.validation.Valid CreateUniversityRequest request) {
        return ResponseEntity.ok(service.createUniversity(request));
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UniversityResponse> updateUniversity(
            @PathVariable Long id,
            @RequestBody UpdateUniversityRequest request
    ) {
        return ResponseEntity.ok(service.updateUniversity(id, request));
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteUniversity(@PathVariable Long id) {
        service.deleteUniversity(id);
        return ResponseEntity.noContent().build();
    }
}
