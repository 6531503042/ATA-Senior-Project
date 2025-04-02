package dev.bengi.userservice.domain.payload.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import dev.bengi.userservice.domain.enums.AccountStatus;
import dev.bengi.userservice.domain.enums.EmploymentType;
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
public class UserResponse {
    private Long id;
    private String username;
    private String fullname;
    private String email;
    private String avatar;
    private String gender;
    private Long departmentId;
    private String departmentName;
    private List<String> roles;
    
    // Department & Organization Details
    private String team;
    private Long managerId;
    private String teamRole;
    
    // Skills & Experience
    private SkillLevel skillLevel;
    private Integer yearsOfExperience;
    private Set<String> skills;
    private Map<String, String> skillProficiency;
    private String primarySkill;
    private Set<String> technologyStack;
    
    // Employment & Work Details
    private EmploymentType employmentType;
    private WorkMode workMode;
    private LocalDate joiningDate;
    private LocalDate lastPromotionDate;
    private LocalDate workAnniversary;
    private ShiftType shiftType;
    private Integer remoteWorkDays;
    
    // Engagement & Activity Tracking
    private LocalDateTime lastLogin;
    private LocalDateTime lastActiveTime;
    private LoginFrequency loginFrequency;
    private AccountStatus accountStatus;
    private SystemAccessLevel systemAccessLevel;
    private PreferredCommunication preferredCommunication;
    
    // Personal & Social Details
    private String nationality;
    private Set<String> languagesSpoken;
    private String preferredLanguage;
    private String timezone;
    private String linkedinProfile;
    private String githubProfile;
}
