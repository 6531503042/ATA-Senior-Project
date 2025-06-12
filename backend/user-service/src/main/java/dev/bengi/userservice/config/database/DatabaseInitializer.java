package dev.bengi.userservice.config.database;

import dev.bengi.userservice.domain.model.Department;
import dev.bengi.userservice.domain.model.Role;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.repository.DepartmentRepository;
import dev.bengi.userservice.repository.RoleRepository;
import dev.bengi.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    public Mono<Void> initialize() {
        return initializeRoles()
                .then(initializeDepartments())
                .then(initializeUsers())
                .then();
    }

    private Mono<Void> initializeRoles() {
        log.info("Initializing roles...");
        
        // Create ADMIN role with wildcard permission (can do everything)
        Role adminRole = Role.builder()
                .name("ROLE_ADMIN")
                .permissions(Set.of("*"))  // Only wildcard permission - can do everything
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Create USER role with basic permissions
        Role userRole = Role.builder()
                .name("ROLE_USER")
                .permissions(Set.of(
                    "users:read:self",  // Can only read their own user info
                    "departments:read",  // Can read department info
                    "teams:read"        // Can read team info
                ))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Create MANAGER role with team management permissions
        Role managerRole = Role.builder()
                .name("ROLE_MANAGER")
                .permissions(Set.of(
                    "users:read",     // Can read all user info
                    "teams:*",        // Full team management
                    "projects:*"      // Full project management
                ))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Create MENTOR role with mentoring permissions
        Role mentorRole = Role.builder()
                .name("ROLE_MENTOR")
                .permissions(Set.of(
                    "users:read",     // Can read all user info
                    "teams:read",     // Can read team info
                    "projects:read",  // Can read project info
                    "feedbacks:*"     // Full feedback management
                ))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Instead of deleting all roles, we'll update existing ones and create new ones
        return Mono.when(
            roleRepository.findByName("ROLE_ADMIN")
                .defaultIfEmpty(adminRole)
                .flatMap(role -> {
                    role.setPermissions(adminRole.getPermissions());
                    return roleRepository.save(role);
                }),
            roleRepository.findByName("ROLE_USER")
                .defaultIfEmpty(userRole)
                .flatMap(role -> {
                    role.setPermissions(userRole.getPermissions());
                    return roleRepository.save(role);
                }),
            roleRepository.findByName("ROLE_MANAGER")
                .defaultIfEmpty(managerRole)
                .flatMap(role -> {
                    role.setPermissions(managerRole.getPermissions());
                    return roleRepository.save(role);
                }),
            roleRepository.findByName("ROLE_MENTOR")
                .defaultIfEmpty(mentorRole)
                .flatMap(role -> {
                    role.setPermissions(mentorRole.getPermissions());
                    return roleRepository.save(role);
                })
        ).then();
    }

    private Mono<Void> initializeDepartments() {
        log.info("Initializing departments...");
        
        Department marketingDept = Department.builder()
                    .name("Marketing")
                    .description("Marketing and sales department")
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

        Department hrDept = Department.builder()
                    .name("Human Resources")
                    .description("HR and recruitment department")
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

        Department engineeringDept = Department.builder()
                .name("Engineering")
                .description("Software development and engineering department")
                        .active(true)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                        
        return departmentRepository.deleteAll()
                .then(Mono.when(
                        departmentRepository.save(marketingDept)
                                .doOnSuccess(dept -> log.info("Marketing department created with ID: {}", dept.getId())),
                        departmentRepository.save(hrDept)
                                .doOnSuccess(dept -> log.info("HR department created with ID: {}", dept.getId())),
                        departmentRepository.save(engineeringDept)
                                .doOnSuccess(dept -> log.info("Engineering department created with ID: {}", dept.getId()))
                ));
    }

    private Mono<Void> initializeUsers() {
        log.info("Initializing users...");
        
        return roleRepository.findByName("ROLE_ADMIN")
            .flatMap(adminRole -> {
                    User adminUser = User.builder()
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("admin123"))
                    .fullname("System Administrator")
                    .departmentId(3L)
                    .position("System Administrator")
                    .roleId(adminRole.getId())
                        .active(true)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                        
                return userRepository.findByEmail("admin@example.com")
                    .defaultIfEmpty(adminUser)
                    .flatMap(user -> {
                        user.setPassword(adminUser.getPassword());
                        user.setRoleId(adminRole.getId());
                        return userRepository.save(user);
                    });
            })
            .then(roleRepository.findByName("ROLE_USER"))
            .flatMap(userRole -> {
                    User regularUser = User.builder()
                    .email("user@example.com")
                    .password(passwordEncoder.encode("user123"))
                    .fullname("Regular User")
                    .departmentId(3L)
                    .position("Developer")
                    .roleId(userRole.getId())
                        .active(true)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                        
                return userRepository.findByEmail("user@example.com")
                    .defaultIfEmpty(regularUser)
                    .flatMap(user -> {
                        user.setPassword(regularUser.getPassword());
                        user.setRoleId(userRole.getId());
                        return userRepository.save(user);
                    });
            })
            .then(roleRepository.findByName("ROLE_MANAGER"))
            .flatMap(managerRole -> {
                    User managerUser = User.builder()
                    .email("manager@example.com")
                    .password(passwordEncoder.encode("manager123"))
                    .fullname("Team Manager")
                    .departmentId(3L)
                    .position("Team Lead")
                    .roleId(managerRole.getId())
                        .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
                
                return userRepository.findByEmail("manager@example.com")
                    .defaultIfEmpty(managerUser)
                    .flatMap(user -> {
                        user.setPassword(managerUser.getPassword());
                        user.setRoleId(managerRole.getId());
                        return userRepository.save(user);
                });
        })
            .then();
    }
} 