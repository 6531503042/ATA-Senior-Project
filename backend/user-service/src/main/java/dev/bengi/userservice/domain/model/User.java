package dev.bengi.userservice.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullname;
    private String username;
    private String email;
    private String password;
    private String resetPasswordToken;
    @Temporal(TemporalType.TIMESTAMP)
    private Date resetPasswordTokenExpiry;
    private String gender;
    private String avatar;
    private String department;
    private String position;
    private boolean active;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_project_authorities", 
        joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "project_id")
    private Set<Long> projectAuthorities = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Role> roles = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        this.active = true;
        if (this.projectAuthorities == null) {
            this.projectAuthorities = new HashSet<>();
        }
        if (this.roles == null) {
            this.roles = new HashSet<>();
        }
    }

    // Custom constructor for creating a new user
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.active = true;
        this.projectAuthorities = new HashSet<>();
        this.roles = new HashSet<>();
    }
}
