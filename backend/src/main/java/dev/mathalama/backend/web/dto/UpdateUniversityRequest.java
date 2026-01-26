package dev.mathalama.backend.web.dto;

import lombok.Data;

@Data
public class UpdateUniversityRequest {
    private String name;
    private String country;
    private String city;
    private String description;
    private String website;
    private String logoUrl;
}
