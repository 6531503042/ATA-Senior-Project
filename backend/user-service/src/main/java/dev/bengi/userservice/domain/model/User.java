package dev.bengi.userservice.domain.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("users")
public class User {
    @Id
    private Long id;
    
    @Column("email")
    private String email;
    
    @Column("password")
    private String password;
    
    @Column("full_name")
    private String fullname;
    
    @Column("department_id")
    private Long departmentId;
    
    @Column("role_id")
    private Long roleId;
    
    @Column("position")
    private String position;
    
    @Column("active")
    private boolean active;
    
    @Column("created_at")
    private LocalDateTime createdAt;
    
    @Column("updated_at")
    private LocalDateTime updatedAt;
    
    @Transient
    private Set<Role> roles;
    
    @Transient
    private Department department;
    
    @Transient
    @Builder.Default
    private Set<Long> projectAuthorities = new HashSet<>();
    
    @Transient
    @Builder.Default
    private Set<TeamMember> teamMemberships = new HashSet<>();

    public Set<Role> getRoles() {
        if (roles == null) {
            roles = new HashSet<>();
        }
        return roles;
    }
    
    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
    
    public Department getDepartment() {
        return department;
    }
    
    public void setDepartment(Department department) {
        this.department = department;
    }
}
