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

    @Min(value = 1, message = "Facilities rating must be at least 1")
    @Max(value = 5, message = "Facilities rating must be at most 5")
    private int facilities;

    @Min(value = 1, message = "Opportunities rating must be at least 1")
    @Max(value = 5, message = "Opportunities rating must be at most 5")
    private int opportunities;

    @Min(value = 1, message = "Location rating must be at least 1")
    @Max(value = 5, message = "Location rating must be at most 5")
    private int location;

    @Min(value = 1, message = "Internet rating must be at least 1")
    @Max(value = 5, message = "Internet rating must be at most 5")
    private int internet;

    @Min(value = 1, message = "Food rating must be at least 1")
    @Max(value = 5, message = "Food rating must be at most 5")
    private int food;

    @Min(value = 1, message = "Difficulty rating must be at least 1")
    @Max(value = 5, message = "Difficulty rating must be at most 5")
    private int difficulty;

    @NotBlank(message = "Status is required")
    private String status;

    private List<String> tags;
}
