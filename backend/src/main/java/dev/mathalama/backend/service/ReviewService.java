package dev.mathalama.backend.service;

import dev.mathalama.backend.domain.Review;
import dev.mathalama.backend.domain.University;
import dev.mathalama.backend.domain.User;
import dev.mathalama.backend.repository.ReviewRepository;
import dev.mathalama.backend.repository.UniversityRepository;
import dev.mathalama.backend.repository.UserRepository;
import dev.mathalama.backend.web.dto.CreateReviewRequest;
import dev.mathalama.backend.web.dto.ReviewResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UniversityRepository universityRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse addReview(CreateReviewRequest request, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        University university = universityRepository.findById(request.getUniversityId())
                .orElseThrow(() -> new RuntimeException("University not found"));

        if (reviewRepository.existsByUserIdAndUniversityId(user.getId(), university.getId())) {
            throw new RuntimeException("You have already reviewed this university");
        }

        Review review = Review.builder()
                .text(request.getText())
                .rating(request.getRating())
                .facilities(request.getFacilities())
                .opportunities(request.getOpportunities())
                .location(request.getLocation())
                .internet(request.getInternet())
                .food(request.getFood())
                .difficulty(request.getDifficulty())
                .status(request.getStatus())
                .tags(request.getTags() != null ? String.join(",", request.getTags()) : "")
                .university(university)
                .user(user)
                .build();

        reviewRepository.save(review);

        // Пересчет рейтинга
        updateUniversityRating(university);

        return mapToResponse(review);
    }

    @Transactional
    public void deleteReview(Long id, UserDetails userDetails) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = user.getRole() == dev.mathalama.backend.domain.Role.ADMIN;
        boolean isOwner = review.getUser().getId().equals(user.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("You are not authorized to delete this review");
        }

        reviewRepository.deleteById(id);
        
        // Recalculate rating after deletion
        if (review.getUniversity() != null) {
            updateUniversityRating(review.getUniversity());
        }
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByUniversity(Long universityId) {
        return reviewRepository.findAllByUniversityId(universityId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private void updateUniversityRating(University university) {
        List<Review> reviews = reviewRepository.findAllByUniversityId(university.getId());
        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        
        // Округляем до 1 знака
        double roundedAverage = Math.round(average * 10.0) / 10.0;
        
        university.setAverageRating(roundedAverage);
        universityRepository.save(university);
    }

    private ReviewResponse mapToResponse(Review review) {
        String displayName = "Anonymous";
        if (review.getUser() != null) {
            String firstName = review.getUser().getFirstname();
            String lastName = review.getUser().getLastname();
            if (firstName != null && !firstName.isEmpty()) {
                displayName = firstName + (lastName != null && !lastName.isEmpty() ? " " + lastName.charAt(0) + "." : "");
            } else {
                // Fallback if names are missing (legacy data)
                displayName = review.getUser().getEmail().split("@")[0];
            }
        }

        return ReviewResponse.builder()
                .id(review.getId())
                .text(review.getText())
                .rating(review.getRating())
                .facilities(review.getFacilities())
                .opportunities(review.getOpportunities())
                .location(review.getLocation())
                .internet(review.getInternet())
                .food(review.getFood())
                .difficulty(review.getDifficulty())
                .status(review.getStatus())
                .tags(review.getTags() != null && !review.getTags().isEmpty() 
                        ? java.util.Arrays.asList(review.getTags().split(",")) 
                        : java.util.List.of())
                .userName(displayName)
                .userId(review.getUser() != null ? review.getUser().getId() : null)
                .universityId(review.getUniversity() != null ? review.getUniversity().getId() : null)
                .universityName(review.getUniversity() != null ? review.getUniversity().getName() : "Unknown University")
                .createdAt(review.getCreatedAt())
                .build();
    }
}
