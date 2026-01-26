package dev.mathalama.backend.web.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UniversityResponse {
    private Long id;
    private String name;
    private String country;
    private String city;
    private String description;
    private String website;
    private String logoUrl;
    private Double averageRating;
    private java.util.List<String> tags;
}
