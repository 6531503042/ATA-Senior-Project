package dev.bengi.feedbackservice.domain.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Table("projects")
public class Project {
    @Id
    private Long id;

    @Column("name")
    private String name;
    
    @Column("description")
    private String description;
    
    @Column("start_date")
    private LocalDateTime startDate;
    
    @Column("end_date")
    private LocalDateTime endDate;
    
    @Column("created_at")
    @CreatedDate
    private LocalDateTime createdAt;
    
    @Column("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @Column("status")
    private String status;
    
    @Column("department_id")
    private String departmentId;
    
    // Using @Transient since R2DBC doesn't support collections
    @Transient
    @Builder.Default
    private Set<Long> memberIds = new HashSet<>();

    // For compatibility with ProjectDTO properties
    @Transient
    private LocalDateTime projectStartDate;
    
    @Transient
    private LocalDateTime projectEndDate;

    public Project initializeForCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.startDate == null && this.projectStartDate != null) {
            this.startDate = this.projectStartDate;
        }
        if (this.endDate == null && this.projectEndDate != null) {
            this.endDate = this.projectEndDate;
        }
        return this;
    }

    public Project initializeForUpdate() {
        this.updatedAt = LocalDateTime.now();
        if (this.projectStartDate != null) {
            this.startDate = this.projectStartDate;
        }
        if (this.projectEndDate != null) {
            this.endDate = this.projectEndDate;
        }
        return this;
    }

    public Set<Long> getMemberIds() {
        return memberIds != null ? memberIds : new HashSet<>();
    }

    public void setProjectStartDate(LocalDateTime projectStartDate) {
        this.projectStartDate = projectStartDate;
        this.startDate = projectStartDate;
    }

    public void setProjectEndDate(LocalDateTime projectEndDate) {
        this.projectEndDate = projectEndDate;
        this.endDate = projectEndDate;
    }

    public LocalDateTime getProjectStartDate() {
        return this.projectStartDate != null ? this.projectStartDate : this.startDate;
    }

    public LocalDateTime getProjectEndDate() {
        return this.projectEndDate != null ? this.projectEndDate : this.endDate;
    }

    public boolean isActive() {
        LocalDateTime now = LocalDateTime.now();
        return startDate != null && endDate != null && 
               !now.isBefore(startDate) && !now.isAfter(endDate);
    }
}
