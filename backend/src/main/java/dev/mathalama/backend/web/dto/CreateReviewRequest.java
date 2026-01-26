package dev.mathalama.backend.web.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import lombok.Data;

@Data
public class CreateReviewRequest {
    private Long universityId;

    @NotBlank(message = "Review text cannot be empty")
    private String text;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private int rating;

    private List<String> tags;
}
