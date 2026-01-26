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
@RedisHash(value = "unverified_user", timeToLive = 86400) // 24 hours
public class UserRedis {
    @Id
    private String token;
    
    @Indexed
    private String email;

    private String firstname;
    private String lastname;
    
    private String password;
    
    private Role role;
}
