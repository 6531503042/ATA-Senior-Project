package dev.bengi.main.modules.projects.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table("project_member_roles")
public class ProjectMemberRole {
    
    @Id
    private Long id;
    
    @Column("project_id")
    private Long projectId;
    
    @Column("user_id")
    private Long userId;
    
    @Column("role_id")
    private Long roleId;
    
    @Column("assigned_by")
    private Long assignedBy;
    
    @Column("is_active")
    private boolean isActive = true;
    
    @CreatedDate
    @Column("assigned_at")
    private LocalDateTime assignedAt;
}
