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

import dev.bengi.userservice.domain.enums.AccountStatus;
import dev.bengi.userservice.domain.enums.EmploymentType;
import dev.bengi.userservice.domain.enums.Gender;
import dev.bengi.userservice.domain.enums.LoginFrequency;
import dev.bengi.userservice.domain.enums.PreferredCommunication;
import dev.bengi.userservice.domain.enums.ShiftType;
import dev.bengi.userservice.domain.enums.SkillLevel;
import dev.bengi.userservice.domain.enums.SystemAccessLevel;
import dev.bengi.userservice.domain.enums.WorkMode;

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
    
    // Skills & Experience
    @Column("skill_level")
    private SkillLevel skillLevel;
    
    @Column("years_of_experience")
    private Integer yearsOfExperience;
    
    @Transient
    @Builder.Default
    private Set<String> skills = new HashSet<>();
    
    @Transient
    @Builder.Default
    private Map<String, String> skillProficiency = new HashMap<>();
    
    @Column("primary_skill")
    private String primarySkill;
    
    @Transient
    @Builder.Default
    private Set<String> technologyStack = new HashSet<>();
    
    // Employment & Work Details
    @Column("employment_type")
    private EmploymentType employmentType;
    
    @Column("work_mode")
    private WorkMode workMode;
    
    @Column("joining_date")
    private LocalDate joiningDate;
    
    @Column("last_promotion_date")
    private LocalDate lastPromotionDate;
    
    @Column("work_anniversary")
    private LocalDate workAnniversary;
    
    @Column("shift_type")
    private ShiftType shiftType;
    
    @Column("remote_work_days")
    private Integer remoteWorkDays;
    
    // Engagement & Activity Tracking
    @Column("last_login")
    private LocalDateTime lastLogin;
    
    @Column("last_active_time")
    private LocalDateTime lastActiveTime;
    
    @Column("login_frequency")
    private LoginFrequency loginFrequency;
    
    @Column("account_status")
    private AccountStatus accountStatus;
    
    @Column("system_access_level")
    private SystemAccessLevel systemAccessLevel;
    
    @Column("preferred_communication")
    private PreferredCommunication preferredCommunication;
    
    private String nationality;
    
    @Transient
    @Builder.Default
    private Set<String> languagesSpoken = new HashSet<>();
    
    @Column("preferred_language")
    private String preferredLanguage;
    
    private String timezone;
    
    @Column("linkedin_profile")
    private String linkedinProfile;
    
    @Column("github_profile")
    private String githubProfile;
}
