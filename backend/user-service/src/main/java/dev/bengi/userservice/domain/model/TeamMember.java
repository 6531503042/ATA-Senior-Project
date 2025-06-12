package dev.bengi.userservice.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("team_members")
public class TeamMember {
    @Id
    private Long id;

    @Column("user_id")
    private Long userId;

    @Column("team_id")
    private Long teamId;

    private String role;

    @Column("is_manager")
    private boolean isManager;

    @Column("created_at")
    private LocalDateTime createdAt;

    @Column("updated_at")
    private LocalDateTime updatedAt;
} 