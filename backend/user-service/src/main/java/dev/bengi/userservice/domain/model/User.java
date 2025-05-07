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

import dev.bengi.userservice.domain.enums.Gender;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("users")
public class User {
    @Id
    private Long id;

    private String username;
    private String email;
    private String password;
    
    @Column("full_name")
    private String fullname;
    
    private Gender gender;
    private String avatar;
    
    @Column("phone_number")
    private String phoneNumber;
    
    @Column("department_id")
    private Long departmentId;
    
    private String position;
    
    @Column("created_at")
    private LocalDateTime createdAt;
    
    @Column("updated_at")
    private LocalDateTime updatedAt;
    
    @Builder.Default
    private boolean active = true;
    
    // References to other entities are maintained as transient collections
    // and loaded manually after fetching the User
    @Transient
    @Builder.Default
    private Set<Role> roles = new HashSet<>();
    
    @Transient
    @Builder.Default
    private Set<Long> projectAuthorities = new HashSet<>();
    
    @Transient
    private Department department;
    
    // Department & Organization Details
    private String team;
    
    @Column("manager_id")
    private Long managerId;
    
    @Column("team_role")
    private String teamRole;
}
