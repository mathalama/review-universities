package dev.mathalama.backend.web.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ReviewResponse {
    private Long id;
    private String text;
    private int rating;
    private List<String> tags;
    private String userName; // Анонимно или имя
    private Long userId;
    private Long universityId;
    private String universityName;
    private LocalDateTime createdAt;
}
