package dev.bengi.feedbackservice.domain.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.ArrayList;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Table("feedbacks")
public class Feedback {
    @Id
    private Long id;

    @Column("title")
    private String title;

    @Column("description")
    private String description;

    @Column("project_id")
    private Long projectId;
    
    @Transient
    private Project project;

    // Using @Transient since R2DBC doesn't support @ElementCollection
    @Transient
    @Builder.Default
    private List<Long> questionIds = new ArrayList<>();

    @Column("start_date")
    private LocalDateTime startDate;

    @Column("end_date")
    private LocalDateTime endDate;

    @Column("created_by")
    private String createdBy;

    @Column("active")
    @Builder.Default
    private boolean active = true;

    @Column("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @Column("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Column("allow_anonymous")
    @Builder.Default
    private boolean allowAnonymous = true;

    @Column("department_id")
    private String departmentId;

    @Column("status")
    private String status;

    @Column("is_anonymous")
    private boolean isAnonymous;

    @Column("is_department_wide")
    private boolean isDepartmentWide;

    // Using @Transient since R2DBC doesn't support @ElementCollection
    @Transient
    @Builder.Default
    private Set<String> targetUserIds = new HashSet<>();

    // Using @Transient since R2DBC doesn't support @ElementCollection
    @Transient
    @Builder.Default
    private Set<String> targetDepartmentIds = new HashSet<>();

    @Transient
    public Set<Long> getAllowedUserIds() {
        return project != null ? project.getMemberIds() : new HashSet<>();
    }
}
