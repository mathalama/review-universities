package dev.mathalama.backend.repository;

import dev.mathalama.backend.domain.PasswordResetTokenRedis;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends CrudRepository<PasswordResetTokenRedis, String> {
    Optional<PasswordResetTokenRedis> findByEmail(String email);
}
