package dev.mathalama.backend.repository;

import dev.mathalama.backend.domain.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import java.util.List;

public interface UniversityRepository extends JpaRepository<University, Long> {
    @EntityGraph(attributePaths = {"reviews"})
    List<University> findAll();
}
