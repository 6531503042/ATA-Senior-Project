package dev.bengi.feedbackservice.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.Instant;

@AllArgsConstructor
@Builder
@NoArgsConstructor
@Data
@Entity
@Table(name = "project_members")
public class ProjectMember {
    @Id
    private Long id;

    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "role")
    private String role;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;
}
