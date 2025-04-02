package dev.bengi.userservice.domain.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import dev.bengi.userservice.domain.enums.AccountStatus;
import dev.bengi.userservice.domain.enums.EmploymentType;
import dev.bengi.userservice.domain.enums.LoginFrequency;
import dev.bengi.userservice.domain.enums.PreferredCommunication;
import dev.bengi.userservice.domain.enums.ShiftType;
import dev.bengi.userservice.domain.enums.SkillLevel;
import dev.bengi.userservice.domain.enums.SystemAccessLevel;
import dev.bengi.userservice.domain.enums.WorkMode;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 3, max = 50)
    @Column(nullable = false, unique = true)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Size(min = 6, max = 120)
    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @NotBlank
    @Size(max = 50)
    @Column(name = "full_name")
    private String fullname;

    @Column(name = "reset_password_token")
    private String resetPasswordToken;

    @Column(name = "reset_password_token_expiry")
    private LocalDateTime resetPasswordTokenExpiry;

    @Column(name = "gender")
    private String gender;

    @Column(name = "avatar")
    private String avatar;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = true)
    @JsonIgnoreProperties("users")
    private Department department;

    @Column(name = "position")
    private String position;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_project_authorities",
            joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "project_id")
    private Set<Long> projectAuthorities = new HashSet<>();
    
    // Department & Organization Details
    @Column(name = "team")
    private String team;
    
    @Column(name = "manager_id")
    private Long managerId;
    
    @Column(name = "team_role")
    private String teamRole;
    
    // Skills & Experience
    @Enumerated(EnumType.STRING)
    @Column(name = "skill_level")
    private SkillLevel skillLevel;
    
    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_skills", 
                    joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "skill")
    private Set<String> skills = new HashSet<>();
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_skill_proficiency", 
                    joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyColumn(name = "skill")
    @Column(name = "proficiency")
    private Map<String, String> skillProficiency = new HashMap<>();
    
    @Column(name = "primary_skill")
    private String primarySkill;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_tech_stack", 
                    joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "technology")
    private Set<String> technologyStack = new HashSet<>();
    
    // Employment & Work Details
    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type")
    private EmploymentType employmentType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "work_mode")
    private WorkMode workMode;
    
    @Column(name = "joining_date")
    private LocalDate joiningDate;
    
    @Column(name = "last_promotion_date")
    private LocalDate lastPromotionDate;
    
    @Column(name = "work_anniversary")
    private LocalDate workAnniversary;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "shift_type")
    private ShiftType shiftType;
    
    @Column(name = "remote_work_days")
    private Integer remoteWorkDays;
    
    // Engagement & Activity Tracking
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    @Column(name = "last_active_time")
    private LocalDateTime lastActiveTime;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "login_frequency")
    private LoginFrequency loginFrequency;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "account_status")
    private AccountStatus accountStatus;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "system_access_level")
    private SystemAccessLevel systemAccessLevel;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_communication")
    private PreferredCommunication preferredCommunication;
    
    // Personal & Social Details
    @Column(name = "nationality")
    private String nationality;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_languages", 
                    joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "language")
    private Set<String> languagesSpoken = new HashSet<>();
    
    @Column(name = "preferred_language")
    private String preferredLanguage;
    
    @Column(name = "timezone")
    private String timezone;
    
    @Column(name = "linkedin_profile")
    private String linkedinProfile;
    
    @Column(name = "github_profile")
    private String githubProfile;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (roles == null) roles = new HashSet<>();
        if (projectAuthorities == null) projectAuthorities = new HashSet<>();
        if (accountStatus == null) {
            accountStatus = AccountStatus.ACTIVE;
        }
        if (systemAccessLevel == null) {
            systemAccessLevel = SystemAccessLevel.NORMAL_USER;
        }
        if (avatar == null && email != null) {
            avatar = "https://robohash.org/" + email + "?set=set2&size=180x180";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
