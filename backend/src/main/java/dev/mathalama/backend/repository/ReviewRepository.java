package dev.mathalama.backend.repository;

import dev.mathalama.backend.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.EntityGraph;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    @EntityGraph(attributePaths = {"user", "university"})
    List<Review> findAll();

    List<Review> findAllByUniversityId(Long universityId);
    boolean existsByUserIdAndUniversityId(Long userId, Long universityId);
}
