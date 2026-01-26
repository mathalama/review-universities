package dev.mathalama.backend.web.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateUniversityRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private String country;

    @NotBlank(message = "City is required")
    private String city;

    private String description;
    private String website;
    private String logoUrl;
}
