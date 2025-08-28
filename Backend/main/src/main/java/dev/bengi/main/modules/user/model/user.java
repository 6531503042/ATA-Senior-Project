package dev.bengi.main.modules.user.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table("users")
public class User {

    @Id
    private Long id;

    private String username;

    private String email;

    private String password;

    @Column("first_name")
    private String firstName;

    @Column("last_name")
    private String lastName;

    @Column("department_id")
    private Long departmentId;

    private String phone;

    private boolean active = true;

    @Column("last_login_at")
    private LocalDateTime lastLoginAt;

    @CreatedDate
    @Column("created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column("updated_at")
    private LocalDateTime updatedAt;

    @Transient
    private Set<String> roles = new HashSet<>();
}
