package dev.bengi.userservice.domain.payload.request;

import java.time.LocalDate;
import java.util.Map;
import java.util.Set;
import dev.bengi.userservice.domain.enums.EmploymentType;
import dev.bengi.userservice.domain.enums.ShiftType;
import dev.bengi.userservice.domain.enums.SkillLevel;
import dev.bengi.userservice.domain.enums.WorkMode;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class AddUserRequest {

    private Long id;
    private String username;
    private String fullname;
    private String password;
    private String email;
    private String gender;
    private String avatar;
    private Long departmentId;
    private Set<String> roles;
    
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
    private ShiftType shiftType;
    private Integer remoteWorkDays;
    
    // Personal & Social Details
    private String nationality;
    private Set<String> languagesSpoken;
    private String preferredLanguage;
    private String timezone;
    private String linkedinProfile;
    private String githubProfile;
}
