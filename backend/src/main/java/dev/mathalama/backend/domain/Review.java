package dev.mathalama.backend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String text;

    private int rating; // 1-5 (Overall)

    private int facilities; // 1-5
    private int opportunities; // 1-5
    private int location; // 1-5
    private int internet; // 1-5
    private int food; // 1-5
    private int difficulty; // 1-5
    
    private String status; // Current Student / Alumnus

    // Тэги храним простой строкой через запятую для MVP, или можно @ElementCollection
    @Column(columnDefinition = "TEXT")
    private String tags; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id")
    @org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
    private University university;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
    private User user;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
