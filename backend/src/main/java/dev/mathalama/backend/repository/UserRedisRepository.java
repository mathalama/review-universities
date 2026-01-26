package dev.mathalama.backend.repository;

import dev.mathalama.backend.domain.UserRedis;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRedisRepository extends CrudRepository<UserRedis, String> {
    Optional<UserRedis> findByEmail(String email);
}
