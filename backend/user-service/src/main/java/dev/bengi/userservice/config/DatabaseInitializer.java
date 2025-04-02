package dev.bengi.userservice.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import dev.bengi.userservice.domain.enums.AccountStatus;
import dev.bengi.userservice.domain.enums.EmploymentType;
import dev.bengi.userservice.domain.enums.LoginFrequency;
import dev.bengi.userservice.domain.enums.PreferredCommunication;
import dev.bengi.userservice.domain.enums.RoleName;
import dev.bengi.userservice.domain.enums.ShiftType;
import dev.bengi.userservice.domain.enums.SkillLevel;
import dev.bengi.userservice.domain.enums.SystemAccessLevel;
import dev.bengi.userservice.domain.enums.WorkMode;
import dev.bengi.userservice.domain.model.Department;
import dev.bengi.userservice.domain.model.Role;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.repository.DepartmentRepository;
import dev.bengi.userservice.repository.RoleRepository;
import dev.bengi.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

   private final RoleRepository roleRepository;
   private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
   private final PasswordEncoder passwordEncoder;
    private final Random random = new Random();

   @Override
    @Transactional
   public void run(String... args) {
        log.info("Starting database initialization");

        // Initialize roles first
        initializeRoles();

        // Create admin user
        User adminUser = createAdminUser();

        // Initialize departments if they don't exist
        initializeDepartments();

        // Initialize department managers
        initializeManagers(adminUser);

        // Initialize employees
        initializeEmployees();
        
        // Fix any existing null fields in users
        fixNullFieldsInExistingUsers(adminUser);

        log.info("Database initialization completed");
    }

    private void initializeRoles() {
        log.info("Checking if roles need to be initialized");
        
        if (roleRepository.count() == 0) {
            log.info("Creating roles");
            
            Role userRole = new Role();
            userRole.setName(RoleName.ROLE_USER);
            userRole.setCreatedAt(LocalDateTime.now());
            userRole.setUpdatedAt(LocalDateTime.now());
            
            Role adminRole = new Role();
            adminRole.setName(RoleName.ROLE_ADMIN);
            adminRole.setCreatedAt(LocalDateTime.now());
            adminRole.setUpdatedAt(LocalDateTime.now());
            
            Role managerRole = new Role();
            managerRole.setName(RoleName.ROLE_MANAGER);
            managerRole.setCreatedAt(LocalDateTime.now());
            managerRole.setUpdatedAt(LocalDateTime.now());
            
            roleRepository.saveAll(Arrays.asList(userRole, adminRole, managerRole));
            log.info("Created roles: USER, ADMIN, MANAGER");
        } else {
            log.info("Roles already exist, skipping initialization");
        }
    }

    private User createAdminUser() {
       String email = "admin@company.com";
        String username = "admin";

        Optional<User> existingUserOpt = userRepository.findByEmail(email);
        if (existingUserOpt.isPresent()) {
            log.info("Admin user already exists: {}", existingUserOpt.get().getEmail());
            return existingUserOpt.get();
        }

        Optional<Role> adminRoleOpt = roleRepository.findByName(RoleName.ROLE_ADMIN);
        if (adminRoleOpt.isEmpty()) {
            log.error("Admin role not found, cannot create admin user");
            return null;
        }

        Role adminRole = adminRoleOpt.get();
                           log.info("Creating admin user with email: {}", email);

                           User adminUser = new User();
        adminUser.setUsername(username);
        adminUser.setEmail(email);
                           adminUser.setPassword(passwordEncoder.encode("admin123"));
                           adminUser.setFullname("Admin User");
                           adminUser.setGender("MALE");
                           adminUser.setAvatar("https://robohash.org/admin@company.com?set=set2&size=180x180");
                           adminUser.setFirstName("Admin");
                           adminUser.setLastName("User");
                           adminUser.setActive(true);
                           adminUser.setCreatedAt(LocalDateTime.now());
                           adminUser.setUpdatedAt(LocalDateTime.now());
        adminUser.setSystemAccessLevel(SystemAccessLevel.ADMIN);
        adminUser.setPosition("System Administrator");
        adminUser.setAccountStatus(AccountStatus.ACTIVE);
        
        // Fill in other fields to avoid nulls
        adminUser.setTeam("Administration");
        adminUser.setTeamRole("System Admin");
        adminUser.setSkillLevel(SkillLevel.EXPERT);
        adminUser.setYearsOfExperience(10);
        adminUser.setSkills(new HashSet<>(Arrays.asList("System Administration", "Security", "Leadership")));
        adminUser.setSkillProficiency(new HashMap<>() {{
            put("System Administration", "Expert");
            put("Security", "Expert");
            put("Leadership", "Expert");
        }});
        adminUser.setPrimarySkill("System Administration");
        adminUser.setTechnologyStack(new HashSet<>(Arrays.asList("Linux", "Windows", "Cloud")));
        adminUser.setEmploymentType(EmploymentType.FULL_TIME);
        adminUser.setWorkMode(WorkMode.HYBRID);
        adminUser.setJoiningDate(LocalDate.now().minusYears(5));
        adminUser.setLastPromotionDate(LocalDate.now().minusYears(1));
        adminUser.setWorkAnniversary(LocalDate.now().minusYears(5));
        adminUser.setShiftType(ShiftType.MORNING);
        adminUser.setRemoteWorkDays(3);
        adminUser.setLastLogin(LocalDateTime.now().minusDays(1));
        adminUser.setLastActiveTime(LocalDateTime.now().minusHours(2));
        adminUser.setLoginFrequency(LoginFrequency.DAILY);
        adminUser.setPreferredCommunication(PreferredCommunication.EMAIL);
        adminUser.setNationality("American");
        adminUser.setLanguagesSpoken(new HashSet<>(Arrays.asList("English", "Spanish")));
        adminUser.setPreferredLanguage("English");
        adminUser.setTimezone("UTC-5");
        adminUser.setLinkedinProfile("https://linkedin.com/in/admin");
        adminUser.setGithubProfile("https://github.com/admin");
        
        // Ensure project authorities is initialized
        adminUser.setProjectAuthorities(new HashSet<>());
        adminUser.getProjectAuthorities().add(1L);

                           // Create a set with the admin role and assign it
                           HashSet<Role> roleSet = new HashSet<>();
                           roleSet.add(adminRole);
                           adminUser.setRoles(roleSet);

        userRepository.save(adminUser);
        log.info("Admin user created successfully: {}", adminUser.getEmail());
        return adminUser;
    }

    private void initializeDepartments() {
        if (departmentRepository.count() == 0) {
            log.info("Creating departments");
            
            List<Department> departments = Arrays.asList(
                Department.builder()
                    .name("Engineering")
                    .description("Software development and engineering operations")
                    .active(true)
                    .build(),
                    
                Department.builder()
                    .name("Marketing")
                    .description("Brand, marketing, and communications")
                    .active(true)
                    .build(),
                    
                Department.builder()
                    .name("HR")
                    .description("Human resources and talent acquisition")
                    .active(true)
                    .build(),
                    
                Department.builder()
                    .name("Finance")
                    .description("Financial planning and accounting")
                    .active(true)
                    .build()
            );
            
            departmentRepository.saveAll(departments);
            log.info("Created {} departments", departments.size());
        } else {
            log.info("Departments already exist, skipping initialization");
        }
    }

    private void initializeManagers(User adminUser) {
        Optional<Role> managerRoleOpt = roleRepository.findByName(RoleName.ROLE_MANAGER);
        if (managerRoleOpt.isEmpty()) {
            log.error("Manager role not found, cannot create managers");
            return;
        }
        Role managerRole = managerRoleOpt.get();
        
        List<Department> departments = departmentRepository.findAll();
        if (departments.isEmpty()) {
            log.error("No departments found, cannot create managers");
            return;
        }
        
        for (Department department : departments) {
            String email = department.getName().toLowerCase() + ".manager@company.com";
            
            Optional<User> existingManager = userRepository.findByEmail(email);
            if (existingManager.isEmpty()) {
                log.info("Creating manager for department: {}", department.getName());
                
                User manager = createUserWithBasicInfo(
                    department.getName().toLowerCase() + ".manager",
                    email,
                    department.getName() + " Manager",
                    "Manager",
                    getRandomLastName()
                );
                
                // Set manager-specific attributes
                manager.setDepartment(department);
                manager.setPosition(department.getName() + " Director");
                manager.setSystemAccessLevel(SystemAccessLevel.MANAGER);
                manager.setSkillLevel(SkillLevel.EXPERT);
                manager.setEmploymentType(EmploymentType.FULL_TIME);
                manager.setYearsOfExperience(8 + random.nextInt(12)); // 8-20 years experience
                manager.setJoiningDate(LocalDate.now().minusYears(5).minusMonths(random.nextInt(24)));
                manager.setWorkAnniversary(manager.getJoiningDate());
                
                // Set work mode and related fields
                WorkMode[] workModes = WorkMode.values();
                manager.setWorkMode(workModes[random.nextInt(workModes.length)]);
                
                if (manager.getWorkMode() == WorkMode.HYBRID) {
                    manager.setRemoteWorkDays(3); // Managers typically get 3 remote days
                } else {
                    manager.setRemoteWorkDays(manager.getWorkMode() == WorkMode.REMOTE ? 5 : 0);
                }
                
                // Set shift type
                ShiftType[] shiftTypes = ShiftType.values();
                manager.setShiftType(shiftTypes[random.nextInt(shiftTypes.length)]);
                
                // Set last login and active time
                manager.setLastLogin(LocalDateTime.now().minusDays(random.nextInt(7))); // Managers are more active
                manager.setLastActiveTime(LocalDateTime.now().minusHours(random.nextInt(12)));
                
                // Set admin as the manager
                if (adminUser != null) {
                    manager.setManagerId(adminUser.getId());
                }
                
                // Login frequency
                LoginFrequency[] frequencies = LoginFrequency.values();
                manager.setLoginFrequency(frequencies[random.nextInt(frequencies.length)]);
                
                // Promotion date (1-3 years ago)
                manager.setLastPromotionDate(LocalDate.now().minusYears(1 + random.nextInt(3)));
                
                // Add manager role
                Set<Role> roles = new HashSet<>();
                roles.add(managerRole);
                manager.setRoles(roles);
                
                // Add skills
                addDepartmentSkills(manager, department.getName());
                
                // Add languages - ensure languages are added
                if (manager.getLanguagesSpoken() == null || manager.getLanguagesSpoken().isEmpty()) {
                    addRandomLanguages(manager);
                }
                
                // Add project authorities - ensure it's not null
                if (manager.getProjectAuthorities() == null) {
                    manager.setProjectAuthorities(new HashSet<>());
                }
                // Add at least one project authority for managers
                manager.getProjectAuthorities().add(1L + random.nextInt(5));
                
                userRepository.save(manager);
                log.info("Created manager for department: {}", department.getName());
            } else {
                // Update existing manager to set admin as their manager
                User manager = existingManager.get();
                if (adminUser != null && manager.getManagerId() == null) {
                    manager.setManagerId(adminUser.getId());
                    userRepository.save(manager);
                    log.info("Updated manager for department {} to set admin as manager", department.getName());
                } else {
                    log.info("Manager for department {} already exists", department.getName());
                }
            }
        }
    }

    private void initializeEmployees() {
        Optional<Role> employeeRoleOpt = roleRepository.findByName(RoleName.ROLE_USER);
        if (employeeRoleOpt.isEmpty()) {
            log.error("Employee role not found, cannot create employees");
            return;
        }
        Role employeeRole = employeeRoleOpt.get();
            
        List<Department> departments = departmentRepository.findAll();
        if (departments.isEmpty()) {
            log.error("No departments found, cannot create employees");
            return;
        }
        
        // Job titles per department
        Map<String, List<String>> departmentPositions = new HashMap<>();
        departmentPositions.put("Engineering", Arrays.asList(
            "Software Engineer", "DevOps Engineer", "QA Engineer", "Frontend Developer",
            "Backend Developer", "Full-Stack Developer", "System Architect", "Database Administrator"
        ));
        departmentPositions.put("Marketing", Arrays.asList(
            "Marketing Specialist", "Content Writer", "SEO Specialist", "Social Media Manager",
            "Brand Strategist", "Marketing Analyst", "Graphic Designer", "Campaign Manager"
        ));
        departmentPositions.put("HR", Arrays.asList(
            "HR Specialist", "Talent Acquisition Specialist", "HR Analyst", "Benefits Administrator",
            "Employee Relations Specialist", "Training Coordinator", "Payroll Specialist", "HR Generalist"
        ));
        departmentPositions.put("Finance", Arrays.asList(
            "Financial Analyst", "Accountant", "Billing Specialist", "Financial Controller",
            "Investment Analyst", "Budget Analyst", "Payroll Accountant", "Tax Specialist"
        ));
        
        // Generate 3-5 employees per department
        for (Department department : departments) {
            String managerEmail = department.getName().toLowerCase() + ".manager@company.com";
            Optional<User> managerOpt = userRepository.findByEmail(managerEmail);
            
            if (managerOpt.isEmpty()) {
                log.warn("Manager for department {} not found, skipping employee creation", department.getName());
                continue;
            }
            User manager = managerOpt.get();
            
            List<String> positions = departmentPositions.get(department.getName());
            if (positions == null) {
                positions = Arrays.asList("Specialist", "Analyst", "Coordinator");
            }
            
            // Create 3-5 employees per department
            int employeeCount = 3 + random.nextInt(3);
            
            for (int i = 0; i < employeeCount; i++) {
                String firstName = getRandomFirstName();
                String lastName = getRandomLastName();
                String username = (firstName + "." + lastName).toLowerCase();
                
                // Check if username is unique by appending number if needed
                int suffix = 1;
                String finalUsername = username;
                while (userRepository.existsByUsername(finalUsername)) {
                    finalUsername = username + suffix++;
                }
                username = finalUsername;
                
                String email = username + "@company.com";
                
                User employee = createUserWithBasicInfo(
                    username,
                    email,
                    firstName + " " + lastName,
                    firstName,
                    lastName
                );
                
                // Set employee-specific attributes
                employee.setDepartment(department);
                employee.setManagerId(manager.getId()); // Ensure manager ID is set
                employee.setPosition(positions.get(random.nextInt(positions.size())));
                employee.setSystemAccessLevel(SystemAccessLevel.NORMAL_USER);
                
                // Set employee level (Entry, Intermediate, Expert)
                SkillLevel[] skillLevels = SkillLevel.values();
                employee.setSkillLevel(skillLevels[random.nextInt(skillLevels.length)]);
                
                // Set experience based on skill level
                if (employee.getSkillLevel() == SkillLevel.ENTRY_LEVEL) {
                    employee.setYearsOfExperience(0 + random.nextInt(3)); // 0-2 years
                } else if (employee.getSkillLevel() == SkillLevel.INTERMEDIATE) {
                    employee.setYearsOfExperience(3 + random.nextInt(5)); // 3-7 years
                } else {
                    employee.setYearsOfExperience(8 + random.nextInt(10)); // 8-17 years
                }
                
                // Employment details
                EmploymentType[] employmentTypes = EmploymentType.values();
                employee.setEmploymentType(employmentTypes[random.nextInt(employmentTypes.length)]);
                
                WorkMode[] workModes = WorkMode.values();
                employee.setWorkMode(workModes[random.nextInt(workModes.length)]);
                
                if (employee.getWorkMode() == WorkMode.HYBRID) {
                    employee.setRemoteWorkDays(2 + random.nextInt(3)); // 2-4 days
                } else {
                    // Even for non-hybrid, set a value to avoid nulls
                    employee.setRemoteWorkDays(employee.getWorkMode() == WorkMode.REMOTE ? 5 : 0);
                }
                
                ShiftType[] shiftTypes = ShiftType.values();
                employee.setShiftType(shiftTypes[random.nextInt(shiftTypes.length)]);
                
                // Joining date - random date within the last 5 years
                int monthsAgo = random.nextInt(60); // 0-59 months ago
                employee.setJoiningDate(LocalDate.now().minusMonths(monthsAgo));
                employee.setWorkAnniversary(employee.getJoiningDate());
                
                // Set last login and active time
                employee.setLastLogin(LocalDateTime.now().minusDays(random.nextInt(30)));
                employee.setLastActiveTime(LocalDateTime.now().minusHours(random.nextInt(24)));
                
                // Promotion date for all employees (set to joining date + random months)
                int promotionMonthsAfterJoining = 6 + random.nextInt(24); // 6-30 months after joining
                if (monthsAgo > promotionMonthsAfterJoining) { // Only if enough time has passed since joining
                    employee.setLastPromotionDate(employee.getJoiningDate().plusMonths(promotionMonthsAfterJoining));
                } else {
                    // Even if not promoted, set the same date as joining to avoid nulls
                    employee.setLastPromotionDate(employee.getJoiningDate());
                }
                
                // Communication preferences
                LoginFrequency[] frequencies = LoginFrequency.values();
                employee.setLoginFrequency(frequencies[random.nextInt(frequencies.length)]);
                
                // Add skills specific to department
                addDepartmentSkills(employee, department.getName());
                
                // Add languages - ensure languages are added
                if (employee.getLanguagesSpoken() == null || employee.getLanguagesSpoken().isEmpty()) {
                    addRandomLanguages(employee);
                }
                
                // Add project authorities - ensure it's not null
                if (employee.getProjectAuthorities() == null) {
                    employee.setProjectAuthorities(new HashSet<>());
                }
                // Add at least one project authority for some employees (40% chance)
                if (random.nextInt(10) < 4) {
                    employee.getProjectAuthorities().add(1L + random.nextInt(3));
                }
                
                // Add user role
                Set<Role> roles = new HashSet<>();
                roles.add(employeeRole);
                employee.setRoles(roles);
                
                // Save employee
                userRepository.save(employee);
                log.info("Created employee: {} in department {}", employee.getUsername(), department.getName());
            }
        }
    }

    private User createUserWithBasicInfo(String username, String email, String fullName, 
                                        String firstName, String lastName) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("password123"));
        user.setFullname(fullName);
        user.setGender(random.nextBoolean() ? "MALE" : "FEMALE");
        user.setAvatar("https://robohash.org/" + email + "?set=set2&size=180x180");
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setAccountStatus(AccountStatus.ACTIVE);
        user.setPhoneNumber(generateRandomPhoneNumber());
        
        // Initialize fields that were showing as null in the JSON
        user.setTeam(generateRandomTeam());
        user.setTeamRole(generateRandomTeamRole());
        user.setPreferredCommunication(getRandomPreferredCommunication());
        user.setNationality(getRandomNationality());
        user.setPreferredLanguage("English");
        user.setTimezone(getRandomTimezone());
        user.setLinkedinProfile("https://linkedin.com/in/" + username);
        user.setGithubProfile("https://github.com/" + username);
        
        // Initialize collections that might be null
        user.setSkills(new HashSet<>());  
        user.setSkillProficiency(new HashMap<>());
        user.setTechnologyStack(new HashSet<>());
        user.setLanguagesSpoken(new HashSet<>());
        user.setProjectAuthorities(new HashSet<>());
        
        return user;
    }

    private String generateRandomTeam() {
        String[] teams = {"Frontend", "Backend", "DevOps", "QA", "UX/UI", "Mobile", "Analytics", 
                          "Customer Success", "Product Development", "Research"};
        return teams[random.nextInt(teams.length)];
    }
    
    private String generateRandomTeamRole() {
        String[] teamRoles = {"Lead", "Senior", "Junior", "Intern", "Manager", "Architect", 
                              "Specialist", "Analyst", "Consultant", "Coordinator"};
        return teamRoles[random.nextInt(teamRoles.length)];
    }
    
    private PreferredCommunication getRandomPreferredCommunication() {
        PreferredCommunication[] commTypes = PreferredCommunication.values();
        return commTypes[random.nextInt(commTypes.length)];
    }
    
    private String getRandomNationality() {
        String[] nationalities = {"American", "Canadian", "British", "Australian", "German", 
                                 "French", "Japanese", "Chinese", "Indian", "Brazilian", 
                                 "Mexican", "Italian", "Russian", "Spanish", "Dutch"};
        return nationalities[random.nextInt(nationalities.length)];
    }
    
    private String getRandomTimezone() {
        String[] timezones = {"UTC", "UTC+1", "UTC+2", "UTC+7", "UTC+8", "UTC-5", "UTC-8", "UTC+5:30", "UTC+9"};
        return timezones[random.nextInt(timezones.length)];
    }

    private void addDepartmentSkills(User user, String departmentName) {
        Set<String> skills = new HashSet<>();
        Map<String, String> proficiency = new HashMap<>();
        Set<String> techStack = new HashSet<>();
        
        switch (departmentName) {
            case "Engineering":
                skills.addAll(Arrays.asList("Java", "Spring Boot", "React", "JavaScript", "AWS", "Docker", "Kubernetes", "CI/CD", "Git", "Microservices"));
                techStack.addAll(Arrays.asList("Spring", "React", "PostgreSQL", "Redis", "RabbitMQ", "AWS"));
                if (user.getPosition() != null && user.getPosition().contains("Frontend")) {
                    user.setPrimarySkill("React");
                } else if (user.getPosition() != null && user.getPosition().contains("Backend")) {
                    user.setPrimarySkill("Java");
                } else if (user.getPosition() != null && user.getPosition().contains("DevOps")) {
                    user.setPrimarySkill("Docker");
                } else {
                    user.setPrimarySkill("Spring Boot");
                }
                break;
                
            case "Marketing":
                skills.addAll(Arrays.asList("SEO", "Content Marketing", "Social Media", "Email Marketing", "Analytics", "Brand Management", "Copywriting", "Marketing Automation"));
                techStack.addAll(Arrays.asList("Google Analytics", "HubSpot", "Facebook Ads", "Google Ads", "Mailchimp", "Canva"));
                user.setPrimarySkill("Marketing Strategy");
                break;
                
            case "HR":
                skills.addAll(Arrays.asList("Recruitment", "Employee Relations", "Benefits Administration", "Training & Development", "HR Policies", "Payroll", "Performance Management"));
                techStack.addAll(Arrays.asList("Workday", "BambooHR", "ATS", "HRIS", "Payroll Systems"));
                user.setPrimarySkill("Talent Management");
                break;
                
            case "Finance":
                skills.addAll(Arrays.asList("Financial Analysis", "Budgeting", "Accounting", "Financial Reporting", "Tax Compliance", "Forecasting", "Risk Management"));
                techStack.addAll(Arrays.asList("QuickBooks", "SAP", "Excel", "Financial Modeling", "ERP"));
                user.setPrimarySkill("Financial Analysis");
                break;
            
            default:
                // Default skills for any other department
                skills.addAll(Arrays.asList("Communication", "Project Management", "Leadership", "Documentation", "Analysis"));
                techStack.addAll(Arrays.asList("Office 365", "Slack", "Google Workspace", "Jira", "Confluence"));
                user.setPrimarySkill("Project Management");
                break;
        }
        
        // Ensure user's collections are initialized
        if (user.getSkills() == null) user.setSkills(new HashSet<>());
        if (user.getSkillProficiency() == null) user.setSkillProficiency(new HashMap<>());
        if (user.getTechnologyStack() == null) user.setTechnologyStack(new HashSet<>());
        
        // Select a random subset of skills (50-80% of available skills)
        int skillCount = skills.size();
        int selectedCount = skillCount / 2 + random.nextInt((skillCount * 3) / 10);
        Set<String> selectedSkills = new HashSet<>();
        for (String skill : skills) {
            if (selectedSkills.size() >= selectedCount) break;
            if (random.nextBoolean()) {
                selectedSkills.add(skill);
            }
        }
        
        // Ensure at least 3 skills
        if (selectedSkills.size() < 3) {
            int i = 0;
            for (String skill : skills) {
                if (!selectedSkills.contains(skill)) {
                    selectedSkills.add(skill);
                    i++;
                    if (i >= 3 - selectedSkills.size()) break;
                }
            }
        }
        
        // Add proficiency levels
        String[] levels = {"Beginner", "Intermediate", "Advanced", "Expert"};
        for (String skill : selectedSkills) {
            String level = levels[random.nextInt(levels.length)];
            proficiency.put(skill, level);
        }
        
        // Select a random subset of tech stack (60-90% of available tech)
        int techCount = techStack.size();
        int selectedTechCount = Math.max(2, (techCount * 6) / 10 + random.nextInt((techCount * 3) / 10));
        Set<String> selectedTech = new HashSet<>();
        for (String tech : techStack) {
            if (selectedTech.size() >= selectedTechCount) break;
            if (random.nextBoolean()) {
                selectedTech.add(tech);
            }
        }
        
        // Ensure at least 2 techs
        if (selectedTech.size() < 2) {
            int i = 0;
            for (String tech : techStack) {
                if (!selectedTech.contains(tech)) {
                    selectedTech.add(tech);
                    i++;
                    if (i >= 2 - selectedTech.size()) break;
                }
            }
        }
        
        user.getSkills().addAll(selectedSkills);
        user.getSkillProficiency().putAll(proficiency);
        user.getTechnologyStack().addAll(selectedTech);
    }
    
    private void addRandomLanguages(User user) {
        String[] languages = {"English", "Spanish", "French", "German", "Japanese", "Chinese", "Korean", 
                              "Portuguese", "Italian", "Russian", "Arabic", "Hindi", "Thai", "Vietnamese"};
        
        // Initialize if null
        if (user.getLanguagesSpoken() == null) {
            user.setLanguagesSpoken(new HashSet<>());
        }
        
        // Always add English
        user.getLanguagesSpoken().add("English");
        user.setPreferredLanguage("English");
        
        // Add 1-3 more languages (always add at least one extra language)
        int additionalLanguages = 1 + random.nextInt(3);
        for (int i = 0; i < additionalLanguages; i++) {
            String language = languages[1 + random.nextInt(languages.length - 1)]; // Skip English (index 0)
            user.getLanguagesSpoken().add(language);
        }
    }
    
    private String generateRandomPhoneNumber() {
        StringBuilder sb = new StringBuilder();
        sb.append("+1-");
        
        // Area code
        sb.append(100 + random.nextInt(900));
        sb.append("-");
        
        // First part
        sb.append(100 + random.nextInt(900));
        sb.append("-");
        
        // Second part
        sb.append(1000 + random.nextInt(9000));
        
        return sb.toString();
    }
    
    private String getRandomFirstName() {
        String[] firstNames = {
            "Alex", "Casey", "Jordan", "Taylor", "Morgan", "Riley", "Jamie", "Avery", 
            "Quinn", "Blake", "Charlie", "Drew", "Emerson", "Finley", "Harley", 
            "James", "Kim", "Lee", "Madison", "Noah", "Parker", "Robin", "Sam", 
            "Tyler", "Wen", "Yuki", "Zoe", "Dev", "Ash", "Ellis"
        };
        return firstNames[random.nextInt(firstNames.length)];
    }
    
    private String getRandomLastName() {
        String[] lastNames = {
            "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", 
            "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", 
            "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", 
            "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", 
            "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", 
            "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", 
            "Campbell", "Parker", "Evans", "Edwards", "Collins"
        };
        return lastNames[random.nextInt(lastNames.length)];
    }
    
    /**
     * Fixes any null fields in existing users in the database
     */
    @Transactional
    private void fixNullFieldsInExistingUsers(User adminUser) {
        log.info("Checking for users with null fields");
        List<User> allUsers = userRepository.findAll();
        int updatedCount = 0;
        
        for (User user : allUsers) {
            boolean userUpdated = false;
            
            // Fix manager ID for manager roles - set Admin user as their manager
            if (user.getManagerId() == null && isManager(user) && adminUser != null && !user.getId().equals(adminUser.getId())) {
                user.setManagerId(adminUser.getId());
                userUpdated = true;
            }
            
            // Fix team field
            if (user.getTeam() == null) {
                user.setTeam(generateRandomTeam());
                userUpdated = true;
            }
            
            // Fix team role field
            if (user.getTeamRole() == null) {
                user.setTeamRole(generateRandomTeamRole());
                userUpdated = true;
            }
            
            // Fix work mode
            if (user.getWorkMode() == null) {
                WorkMode[] workModes = WorkMode.values();
                user.setWorkMode(workModes[random.nextInt(workModes.length)]);
                userUpdated = true;
            }
            
            // Fix remote work days based on work mode
            if (user.getRemoteWorkDays() == null) {
                if (user.getWorkMode() == WorkMode.HYBRID) {
                    user.setRemoteWorkDays(2 + random.nextInt(3)); // 2-4 days
                } else {
                    user.setRemoteWorkDays(user.getWorkMode() == WorkMode.REMOTE ? 5 : 0);
                }
                userUpdated = true;
            }
            
            // Fix shift type
            if (user.getShiftType() == null) {
                ShiftType[] shiftTypes = ShiftType.values();
                user.setShiftType(shiftTypes[random.nextInt(shiftTypes.length)]);
                userUpdated = true;
            }
            
            // Fix skill level
            if (user.getSkillLevel() == null) {
                SkillLevel[] skillLevels = SkillLevel.values();
                user.setSkillLevel(skillLevels[random.nextInt(skillLevels.length)]);
                userUpdated = true;
            }
            
            // Fix years of experience based on skill level
            if (user.getYearsOfExperience() == null) {
                if (user.getSkillLevel() == SkillLevel.ENTRY_LEVEL) {
                    user.setYearsOfExperience(0 + random.nextInt(3)); // 0-2 years
                } else if (user.getSkillLevel() == SkillLevel.INTERMEDIATE) {
                    user.setYearsOfExperience(3 + random.nextInt(5)); // 3-7 years
                } else {
                    user.setYearsOfExperience(8 + random.nextInt(10)); // 8-17 years
                }
                userUpdated = true;
            }
            
            // Fix employment type
            if (user.getEmploymentType() == null) {
                EmploymentType[] employmentTypes = EmploymentType.values();
                user.setEmploymentType(employmentTypes[random.nextInt(employmentTypes.length)]);
                userUpdated = true;
            }
            
            // Fix preferred communication
            if (user.getPreferredCommunication() == null) {
                user.setPreferredCommunication(getRandomPreferredCommunication());
                userUpdated = true;
            }
            
            // Fix nationality
            if (user.getNationality() == null) {
                user.setNationality(getRandomNationality());
                userUpdated = true;
            }
            
            // Fix timezone
            if (user.getTimezone() == null) {
                user.setTimezone(getRandomTimezone());
                userUpdated = true;
            }
            
            // Fix login frequency
            if (user.getLoginFrequency() == null) {
                LoginFrequency[] frequencies = LoginFrequency.values();
                user.setLoginFrequency(frequencies[random.nextInt(frequencies.length)]);
                userUpdated = true;
            }
            
            // Fix joining date
            if (user.getJoiningDate() == null) {
                int monthsAgo = random.nextInt(60); // 0-59 months ago
                user.setJoiningDate(LocalDate.now().minusMonths(monthsAgo));
                userUpdated = true;
            }
            
            // Fix work anniversary
            if (user.getWorkAnniversary() == null && user.getJoiningDate() != null) {
                user.setWorkAnniversary(user.getJoiningDate());
                userUpdated = true;
            }
            
            // Fix promotion date
            if (user.getLastPromotionDate() == null && user.getJoiningDate() != null) {
                // 50% chance of having been promoted
                if (random.nextBoolean()) {
                    int promotionMonthsAfterJoining = 6 + random.nextInt(24); // 6-30 months after joining
                    LocalDate joiningDate = user.getJoiningDate();
                    long monthsSinceJoining = joiningDate.until(LocalDate.now(), java.time.temporal.ChronoUnit.MONTHS);
                    
                    if (monthsSinceJoining > promotionMonthsAfterJoining) {
                        user.setLastPromotionDate(joiningDate.plusMonths(promotionMonthsAfterJoining));
                    } else {
                        user.setLastPromotionDate(joiningDate); // If not enough time has passed
                    }
                } else {
                    user.setLastPromotionDate(user.getJoiningDate()); // Same as joining date if no promotion
                }
                userUpdated = true;
            }
            
            // Fix last login and active time
            if (user.getLastLogin() == null) {
                user.setLastLogin(LocalDateTime.now().minusDays(random.nextInt(30)));
                userUpdated = true;
            }
            
            if (user.getLastActiveTime() == null) {
                // Last active time should be after last login but before now
                if (user.getLastLogin() != null) {
                    LocalDateTime lastLogin = user.getLastLogin();
                    long hoursAfterLastLogin = random.nextInt(24) + 1; // 1-24 hours after last login
                    user.setLastActiveTime(lastLogin.plusHours(hoursAfterLastLogin));
                } else {
                    user.setLastActiveTime(LocalDateTime.now().minusHours(random.nextInt(24)));
                }
                userUpdated = true;
            }
            
            // Fix LinkedIn and GitHub profiles
            if (user.getLinkedinProfile() == null) {
                user.setLinkedinProfile("https://linkedin.com/in/" + user.getUsername());
                userUpdated = true;
            }
            
            if (user.getGithubProfile() == null) {
                user.setGithubProfile("https://github.com/" + user.getUsername());
                userUpdated = true;
            }
            
            // Fix primary skill if null
            if (user.getPrimarySkill() == null && user.getDepartment() != null) {
                String departmentName = user.getDepartment().getName();
                switch (departmentName) {
                    case "Engineering":
                        user.setPrimarySkill("Spring Boot");
                        break;
                    case "Marketing":
                        user.setPrimarySkill("Marketing Strategy");
                        break;
                    case "HR":
                        user.setPrimarySkill("Talent Management");
                        break;
                    case "Finance":
                        user.setPrimarySkill("Financial Analysis");
                        break;
                    default:
                        user.setPrimarySkill("Project Management");
                        break;
                }
                userUpdated = true;
            }
            
            // Fix collections
            if (user.getSkills() == null || user.getSkills().isEmpty()) {
                String departmentName = user.getDepartment() != null ? user.getDepartment().getName() : "General";
                addDepartmentSkills(user, departmentName);
                userUpdated = true;
            }
            
            if (user.getLanguagesSpoken() == null || user.getLanguagesSpoken().isEmpty()) {
                addRandomLanguages(user);
                userUpdated = true;
            }
            
            if (user.getPreferredLanguage() == null && 
                user.getLanguagesSpoken() != null && 
                !user.getLanguagesSpoken().isEmpty()) {
                user.setPreferredLanguage("English");
                userUpdated = true;
            }
            
            // Fix project authorities
            if (user.getProjectAuthorities() == null) {
                user.setProjectAuthorities(new HashSet<>());
                // Add project authorities based on role
                if (user.getRoles() != null && !user.getRoles().isEmpty()) {
                    for (Role role : user.getRoles()) {
                        if (role.getName() == RoleName.ROLE_MANAGER || role.getName() == RoleName.ROLE_ADMIN) {
                            // Managers and admins get 1-3 project authorities
                            int numAuthorities = 1 + random.nextInt(3);
                            for (int i = 0; i < numAuthorities; i++) {
                                user.getProjectAuthorities().add(1L + random.nextInt(5));
                            }
                        } else if (random.nextInt(10) < 4) { // 40% chance for regular users
                            user.getProjectAuthorities().add(1L + random.nextInt(3));
                        }
                    }
                }
                userUpdated = true;
            }
            
            // If the user was updated, save it
            if (userUpdated) {
                userRepository.save(user);
                updatedCount++;
            }
        }
        
        log.info("Updated {} users with null fields", updatedCount);
    }
    
    /**
     * Check if a user has a manager role
     */
    private boolean isManager(User user) {
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            return false;
        }
        
        for (Role role : user.getRoles()) {
            if (role.getName() == RoleName.ROLE_MANAGER) {
                return true;
            }
        }
        
        return false;
   }
}