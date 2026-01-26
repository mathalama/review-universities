package dev.mathalama.backend.service;

import dev.mathalama.backend.domain.University;
import dev.mathalama.backend.repository.UniversityRepository;
import dev.mathalama.backend.web.dto.CreateUniversityRequest;
import dev.mathalama.backend.web.dto.UniversityResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import dev.mathalama.backend.web.dto.UpdateUniversityRequest;

@Service
@RequiredArgsConstructor
public class UniversityService {

    private final UniversityRepository repository;

    @Transactional
    public UniversityResponse updateUniversity(Long id, UpdateUniversityRequest request) {
        University university = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("University not found"));

        if (request.getName() != null) university.setName(request.getName());
        if (request.getCountry() != null) university.setCountry(request.getCountry());
        if (request.getCity() != null) university.setCity(request.getCity());
        if (request.getDescription() != null) university.setDescription(request.getDescription());
        if (request.getWebsite() != null) university.setWebsite(request.getWebsite());
        if (request.getLogoUrl() != null) university.setLogoUrl(request.getLogoUrl());

        return mapToResponse(repository.save(university));
    }

    @Transactional(readOnly = true)
    public List<UniversityResponse> getAllUniversities() {
        return repository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UniversityResponse getUniversityById(Long id) {
        University university = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("University not found"));
        return mapToResponse(university);
    }

    public UniversityResponse createUniversity(CreateUniversityRequest request) {
        var university = University.builder()
                .name(request.getName())
                .country(request.getCountry())
                .city(request.getCity())
                .description(request.getDescription())
                .website(request.getWebsite())
                .logoUrl(request.getLogoUrl())
                .averageRating(0.0)
                .build();
        return mapToResponse(repository.save(university));
    }

    public void deleteUniversity(Long id) {
        repository.deleteById(id);
    }

    private UniversityResponse mapToResponse(University university) {
        List<String> tags = university.getReviews() == null ? List.of() : university.getReviews().stream()
                .filter(r -> r.getTags() != null && !r.getTags().isEmpty())
                .flatMap(r -> java.util.Arrays.stream(r.getTags().split(",")))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .distinct()
                .limit(10)
                .collect(Collectors.toList());

        return UniversityResponse.builder()
                .id(university.getId())
                .name(university.getName())
                .country(university.getCountry())
                .city(university.getCity())
                .description(university.getDescription())
                .website(university.getWebsite())
                .logoUrl(university.getLogoUrl())
                .averageRating(university.getAverageRating())
                .tags(tags)
                .build();
    }
}
