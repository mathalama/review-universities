package dev.mathalama.backend.web;

import dev.mathalama.backend.service.ReviewService;
import dev.mathalama.backend.web.dto.CreateReviewRequest;
import dev.mathalama.backend.web.dto.ReviewResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService service;

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        return ResponseEntity.ok(service.getAllReviews());
    }

    @GetMapping("/university/{universityId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByUniversity(@PathVariable Long universityId) {
        return ResponseEntity.ok(service.getReviewsByUniversity(universityId));
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(
            @RequestBody @jakarta.validation.Valid CreateReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(service.addReview(request, userDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        service.deleteReview(id, userDetails);
        return ResponseEntity.noContent().build();
    }
}
