package dev.bengi.userservice.config;

import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import dev.bengi.userservice.domain.enums.RoleName;
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

    @Override
    public void run(String... args) {
        try {
            // Initialize default roles if they don't exist
            for (RoleName roleName : RoleName.values()) {
                if (!roleRepository.existsByName(roleName)) {
                    Role role = Role.builder()
                            .name(roleName)
                            .build();
                    roleRepository.save(role);
                    log.info("Created role: {}", roleName);
                }
            }

            // Create enterprise departments
            Department itDepartment = createDepartmentIfNotExists("IT Department", "Information Technology Department");
            Department hrDepartment = createDepartmentIfNotExists("HR Department", "Human Resources Department");
            Department financeDepartment = createDepartmentIfNotExists("Finance Department", "Finance and Accounting Department");
            Department marketingDepartment = createDepartmentIfNotExists("Marketing Department", "Marketing and Communications Department");

            // Create admin user
            createAdminUser(itDepartment);

            // Create department managers
            createDepartmentManager("John Smith", "john.smith@company.com", "johnsmith", "IT Manager", itDepartment, RoleName.ROLE_MANAGER);
            createDepartmentManager("Sarah Johnson", "sarah.johnson@company.com", "sarahjohnson", "HR Manager", hrDepartment, RoleName.ROLE_MANAGER);
            createDepartmentManager("Michael Brown", "michael.brown@company.com", "michaelbrown", "Finance Manager", financeDepartment, RoleName.ROLE_MANAGER);
            createDepartmentManager("Emily Davis", "emily.davis@company.com", "emilydavis", "Marketing Manager", marketingDepartment, RoleName.ROLE_MANAGER);

            // Create regular employees
            createEmployee("David Wilson", "david.wilson@company.com", "davidwilson", "Senior Developer", itDepartment);
            createEmployee("Lisa Anderson", "lisa.anderson@company.com", "lisaanderson", "HR Specialist", hrDepartment);
            createEmployee("Robert Taylor", "robert.taylor@company.com", "roberttaylor", "Financial Analyst", financeDepartment);
            createEmployee("Jennifer White", "jennifer.white@company.com", "jenniferwhite", "Marketing Specialist", marketingDepartment);

        } catch (Exception e) {
            log.error("Error initializing database: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to initialize database", e);
        }
    }

    private Department createDepartmentIfNotExists(String name, String description) {
        return departmentRepository.findByName(name)
                .orElseGet(() -> {
                    Department dept = Department.builder()
                            .name(name)
                            .description(description)
                            .active(true)
                            .build();
                    return departmentRepository.save(dept);
                });
    }

    private void createAdminUser(Department department) {
        if (!userRepository.existsByEmail("admin@company.com")) {
            Set<Role> roles = new HashSet<>();
            roles.add(roleRepository.findByName(RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Admin role not found")));

            User admin = User.builder()
                    .email("admin@company.com")
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .firstName("Admin")
                    .lastName("User")
                    .fullname("Admin User")
                    .gender("MALE")
                    .avatar("https://robohash.org/admin@company.com?set=set2&size=180x180")
                    .department(department)
                    .roles(roles)
                    .active(true)
                    .projectAuthorities(new HashSet<>())
                    .build();

            userRepository.save(admin);
            log.info("Created admin user: {}", admin.getUsername());
        }
    }

    private void createDepartmentManager(String fullName, String email, String username, String position, Department department, RoleName roleName) {
        if (!userRepository.existsByEmail(email)) {
            Set<Role> roles = new HashSet<>();
            roles.add(roleRepository.findByName(roleName)
                    .orElseThrow(() -> new RuntimeException(roleName + " role not found")));

            String[] nameParts = fullName.split(" ");
            User manager = User.builder()
                    .email(email)
                    .username(username)
                    .password(passwordEncoder.encode("manager123"))
                    .firstName(nameParts[0])
                    .lastName(nameParts[1])
                    .fullname(fullName)
                    .gender("MALE")
                    .avatar("https://robohash.org/" + email + "?set=set2&size=180x180")
                    .department(department)
                    .position(position)
                    .roles(roles)
                    .active(true)
                    .projectAuthorities(new HashSet<>())
                    .build();

            userRepository.save(manager);
            log.info("Created department manager: {}", manager.getUsername());
        }
    }

    private void createEmployee(String fullName, String email, String username, String position, Department department) {
        if (!userRepository.existsByEmail(email)) {
            Set<Role> roles = new HashSet<>();
            roles.add(roleRepository.findByName(RoleName.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("User role not found")));

            String[] nameParts = fullName.split(" ");
            User employee = User.builder()
                    .email(email)
                    .username(username)
                    .password(passwordEncoder.encode("employee123"))
                    .firstName(nameParts[0])
                    .lastName(nameParts[1])
                    .fullname(fullName)
                    .gender("MALE")
                    .avatar("https://robohash.org/" + email + "?set=set2&size=180x180")
                    .department(department)
                    .position(position)
                    .roles(roles)
                    .active(true)
                    .projectAuthorities(new HashSet<>())
                    .build();

            userRepository.save(employee);
            log.info("Created employee: {}", employee.getUsername());
        }
    }
}
