package dev.mathalama.backend.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@RedisHash(value = "password_reset_token", timeToLive = 900) // 15 minutes
public class PasswordResetTokenRedis {
    @Id
    private String token;
    
    @Indexed
    private String email;
}
