package dev.bengi.userservice.config.database;

import java.time.LocalDateTime;
import java.util.Arrays;

import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.r2dbc.connection.init.ConnectionFactoryInitializer;
import org.springframework.r2dbc.connection.init.ResourceDatabasePopulator;
import org.springframework.security.crypto.password.PasswordEncoder;

import dev.bengi.userservice.domain.enums.Gender;
import dev.bengi.userservice.domain.enums.RoleName;
import dev.bengi.userservice.domain.model.Department;
import dev.bengi.userservice.domain.model.Role;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.repository.DepartmentRepository;
import dev.bengi.userservice.repository.RoleRepository;
import dev.bengi.userservice.repository.UserRepository;
import dev.bengi.userservice.service.RoleService;
import io.r2dbc.spi.ConnectionFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DatabaseInitializer {

    private final Environment env;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;
    private final ConnectionFactory connectionFactory;

    /**
     * Configure Flyway and run migrations manually after application context is ready
     */
    @EventListener(ContextRefreshedEvent.class)
    public void runFlywayMigrations() {
        try {
            String url = env.getRequiredProperty("spring.flyway.url");
            String user = env.getRequiredProperty("spring.flyway.user");
            String password = env.getRequiredProperty("spring.flyway.password");
            
            log.info("Running Flyway migrations with URL: {}", url);
            
            // Configure and run Flyway
            Flyway flyway = Flyway.configure()
                .dataSource(url, user, password)
                .locations(env.getProperty("spring.flyway.locations", "classpath:db/migration"))
                .baselineOnMigrate(env.getProperty("spring.flyway.baseline-on-migrate", Boolean.class, true))
                .load();
                
            // Execute migrations
            flyway.migrate();
            log.info("Flyway migrations completed successfully");
            
        } catch (Exception e) {
            log.error("Failed to run Flyway migrations: {}", e.getMessage(), e);
            // If in dev mode, log warning but continue
            if (Arrays.asList(env.getActiveProfiles()).contains("dev")) {
                log.warn("Running in dev mode, continuing without migrations");
            }
        }
    }

    // Initialize roles after migrations
    @EventListener(ContextRefreshedEvent.class)
    public void initializeRoles() {
        log.info("Initializing default roles...");
        
        // Create ROLE_USER if not exists
        roleRepository.findByName(RoleName.ROLE_USER.name())
            .switchIfEmpty(createRole(RoleName.ROLE_USER))
            .subscribe(
                role -> log.info("User role found or created: {}", role.getName()),
                error -> log.error("Error creating User role: {}", error.getMessage())
            );
        
        // Create ROLE_ADMIN if not exists
        roleRepository.findByName(RoleName.ROLE_ADMIN.name())
            .switchIfEmpty(createRole(RoleName.ROLE_ADMIN))
            .subscribe(
                role -> log.info("Admin role found or created: {}", role.getName()),
                error -> log.error("Error creating Admin role: {}", error.getMessage())
            );
        
        // Create ROLE_MANAGER if not exists
        roleRepository.findByName(RoleName.ROLE_MANAGER.name())
            .switchIfEmpty(createRole(RoleName.ROLE_MANAGER))
            .subscribe(
                role -> log.info("Manager role found or created: {}", role.getName()),
                error -> log.error("Error creating Manager role: {}", error.getMessage())
            );
    }

    // Fix the initializeUsers method to directly assign roles using SQL
    @EventListener(ContextRefreshedEvent.class)
    public void fixUserRoleAssignments() {
        log.info("Fixing user-role assignments in the database...");
        
        // Get admin role
        roleRepository.findByName(RoleName.ROLE_ADMIN.name())
            .flatMap(adminRole -> {
                log.info("Found ADMIN role with ID: {}", adminRole.getId());
                
                // Fix admin1 role
                return userRepository.findByUsername("admin1@example.com")
                    .flatMap(admin1 -> {
                        log.info("Adding ADMIN role to user: admin1@example.com (ID: {})", admin1.getId());
                        return addRoleToUserDirectly(admin1.getId(), adminRole.getId());
                    })
                    .then(userRepository.findByUsername("admin2@example.com")
                        .flatMap(admin2 -> {
                            log.info("Adding ADMIN role to user: admin2@example.com (ID: {})", admin2.getId());
                            return addRoleToUserDirectly(admin2.getId(), adminRole.getId());
                        })
                    );
            })
            .subscribe(
                result -> log.info("Admin role assignments fixed successfully"),
                error -> log.error("Error fixing admin role assignments: {}", error.getMessage())
            );
            
        // Get manager role
        roleRepository.findByName(RoleName.ROLE_MANAGER.name())
            .flatMap(managerRole -> {
                log.info("Found MANAGER role with ID: {}", managerRole.getId());
                
                // Fix manager1 role
                return userRepository.findByUsername("manager1@example.com")
                    .flatMap(manager -> {
                        log.info("Adding MANAGER role to user: manager1@example.com (ID: {})", manager.getId());
                        return addRoleToUserDirectly(manager.getId(), managerRole.getId());
                    });
            })
            .subscribe(
                result -> log.info("Manager role assignments fixed successfully"),
                error -> log.error("Error fixing manager role assignments: {}", error.getMessage())
            );

        // Get user role
        roleRepository.findByName(RoleName.ROLE_USER.name())
            .flatMap(userRole -> {
                log.info("Found USER role with ID: {}", userRole.getId());
                
                // Fix regular users
                return userRepository.findByUsername("user1@example.com")
                    .flatMap(user1 -> {
                        log.info("Adding USER role to user: user1@example.com (ID: {})", user1.getId());
                        return addRoleToUserDirectly(user1.getId(), userRole.getId());
                    })
                    .then(userRepository.findByUsername("user2@example.com")
                        .flatMap(user2 -> {
                            log.info("Adding USER role to user: user2@example.com (ID: {})", user2.getId());
                            return addRoleToUserDirectly(user2.getId(), userRole.getId());
                        })
                    );
            })
            .subscribe(
                result -> log.info("User role assignments fixed successfully"),
                error -> log.error("Error fixing user role assignments: {}", error.getMessage())
            );
    }
    
    // Helper method to directly insert into user_roles table using raw SQL
    private Mono<Integer> addRoleToUserDirectly(Long userId, Long roleId) {
        log.info("Adding role ID {} to user ID {} via direct SQL", roleId, userId);
        
        // Execute direct SQL insert statement using the connection
        String sql = "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT (user_id, role_id) DO NOTHING";
        
        try {
            return Mono.from(connectionFactory.create())
                .flatMap(connection -> {
                    try {
                        // Get a statement and explicitly set parameters
                        var statement = connection.createStatement(sql);
                        statement.bind(0, userId.longValue());  // Explicitly use longValue()
                        statement.bind(1, roleId.longValue());  // Explicitly use longValue()
                        
                        // Execute and handle the result
                        return Mono.from(statement.execute())
                            .flatMap(result -> Mono.from(result.getRowsUpdated()))
                            .map(rowsUpdated -> {
                                try {
                                    // Handle possible Number type safely
                                    return rowsUpdated.intValue(); // Use Number.intValue() for any Number type
                                } catch (Exception e) {
                                    log.warn("Type conversion issue with rowsUpdated: {}", e.getMessage());
                                    return 0; // Default to 0 if conversion fails
                                }
                            })
                            .doOnSuccess(count -> log.info("Successfully added role {} to user {}, rows affected: {}", roleId, userId, count))
                            .doOnError(err -> log.error("SQL error adding role {} to user {}: {}", roleId, userId, err.getMessage()))
                            .doFinally(signal -> connection.close())
                            .onErrorResume(e -> {
                                log.error("Error during role assignment SQL operation: {}", e.getMessage());
                                connection.close();
                                return Mono.just(0);
                            });
                    } catch (Exception e) {
                        log.error("Error preparing SQL statement: {}", e.getMessage());
                        connection.close();
                        return Mono.just(0);
                    }
                });
        } catch (Exception e) {
            log.error("Exception in addRoleToUserDirectly: {}", e.getMessage());
            return Mono.just(0);
        }
    }

    // Initialize departments
    @EventListener(ContextRefreshedEvent.class)
    public void initializeDepartments() {
        log.info("Initializing departments...");
        
        // Create Engineering department
        departmentRepository.findByName("Engineering")
            .switchIfEmpty(Mono.defer(() -> {
                Department engineering = Department.builder()
                    .name("Engineering")
                    .description("Software development and engineering department")
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
                return departmentRepository.save(engineering);
            }))
            .doOnSuccess(dept -> log.info("Engineering department found or created with ID: {}", dept.getId()))
            .onErrorResume(e -> {
                log.error("Error processing Engineering department: {}", e.getMessage());
                return Mono.empty();
            })
            .subscribe();
            
        // Create Marketing department
        departmentRepository.findByName("Marketing")
            .switchIfEmpty(Mono.defer(() -> {
                Department marketing = Department.builder()
                    .name("Marketing")
                    .description("Marketing and sales department")
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
                return departmentRepository.save(marketing);
            }))
            .doOnSuccess(dept -> log.info("Marketing department found or created with ID: {}", dept.getId()))
            .onErrorResume(e -> {
                log.error("Error processing Marketing department: {}", e.getMessage());
                return Mono.empty();
            })
            .subscribe();
            
        // Create HR department
        departmentRepository.findByName("Human Resources")
            .switchIfEmpty(Mono.defer(() -> {
                Department hr = Department.builder()
                    .name("Human Resources")
                    .description("HR and recruitment department")
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
                return departmentRepository.save(hr);
            }))
            .doOnSuccess(dept -> log.info("HR department found or created with ID: {}", dept.getId()))
            .onErrorResume(e -> {
                log.error("Error processing HR department: {}", e.getMessage());
                return Mono.empty();
            })
            .subscribe();
    }
    
    // Initialize users with different roles
    @EventListener(ContextRefreshedEvent.class)
    public void initializeUsers() {
        log.info("Initializing default users...");
        
        // Create admin users after departments and roles are created
        Mono.zip(
            roleRepository.findByName(RoleName.ROLE_ADMIN.name()),
            departmentRepository.findByName("Engineering")
        ).flatMap(tuple -> {
            Role adminRole = tuple.getT1();
            Department dept = tuple.getT2();
            
            // First check if user exists by username
            return userRepository.findByUsername("admin1@example.com")
                .switchIfEmpty(
                    // If not found by username, check by email
                    userRepository.findByEmail("admin1@example.com")
                )
                .flatMap(existingUser -> {
                    log.info("Admin user with email admin1@example.com already exists");
                    return Mono.just(existingUser);
                })
                .switchIfEmpty(Mono.defer(() -> {
                    // Create user without the nested entities
                    User adminUser = User.builder()
                        .username("admin1@example.com")  // Use email as username
                        .email("admin1@example.com")
                        .password(passwordEncoder.encode("password"))
                        .fullname("Admin User One")
                        .gender(Gender.MALE)
                        .departmentId(dept.getId())  // Use ID reference instead of entity
                        .position("Lead Developer")
                        .active(true)
                        .team("Core Team")
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                        
                    // Save the user first
                    return userRepository.save(adminUser)
                        .flatMap(savedUser -> {
                            // Then link the user to the role using a separate operation
                            return roleService.assignRole(savedUser.getId(), adminRole.getName())
                                .thenReturn(savedUser);
                        });
                }));
        })
        .doOnSuccess(user -> {
            if (user != null) {
                log.info("Admin user ready: {}", user.getUsername());
            } else {
                log.warn("Admin user is null after processing");
            }
        })
        .onErrorResume(e -> {
            log.error("Error processing admin user: {}", e.getMessage(), e);
            return Mono.empty();
        })
        .subscribe();
        
        // Create another admin in Marketing
        Mono.zip(
            roleRepository.findByName(RoleName.ROLE_ADMIN.name()),
            departmentRepository.findByName("Marketing")
        ).flatMap(tuple -> {
            Role adminRole = tuple.getT1();
            Department dept = tuple.getT2();
            
            // First check if user exists by username
            return userRepository.findByUsername("admin2@example.com")
                .switchIfEmpty(
                    // If not found by username, check by email
                    userRepository.findByEmail("admin2@example.com")
                )
                .flatMap(existingUser -> {
                    log.info("Admin user with email admin2@example.com already exists");
                    return Mono.just(existingUser);
                })
                .switchIfEmpty(Mono.defer(() -> {
                    User adminUser = User.builder()
                        .username("admin2@example.com")  // Use email as username
                        .email("admin2@example.com")
                        .password(passwordEncoder.encode("password"))
                        .fullname("Admin User Two")
                        .gender(Gender.FEMALE)
                        .departmentId(dept.getId())  // Use ID reference instead of entity
                        .position("Marketing Lead")
                        .active(true)
                        .team("Marketing Team")
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                        
                    // Save the user first
                    return userRepository.save(adminUser)
                        .flatMap(savedUser -> {
                            // Then link the user to the role using a separate operation
                            return roleService.assignRole(savedUser.getId(), adminRole.getName())
                                .thenReturn(savedUser);
                        });
                }));
        })
        .doOnSuccess(user -> {
            if (user != null) {
                log.info("Admin user ready: {}", user.getUsername());
            } else {
                log.warn("Admin user is null after processing");
            }
        })
        .onErrorResume(e -> {
            log.error("Error processing admin user: {}", e.getMessage(), e);
            return Mono.empty();
        })
        .subscribe();
        
        // Create regular users
        Mono.zip(
            roleRepository.findByName(RoleName.ROLE_USER.name()),
            departmentRepository.findByName("Engineering")
        ).flatMap(tuple -> {
            Role userRole = tuple.getT1();
            Department dept = tuple.getT2();
            
            // First check if user exists by username
            return userRepository.findByUsername("user1@example.com")
                .switchIfEmpty(
                    // If not found by username, check by email
                    userRepository.findByEmail("user1@example.com")
                )
                .flatMap(existingUser -> {
                    log.info("Regular user with email user1@example.com already exists");
                    return Mono.just(existingUser);
                })
                .switchIfEmpty(Mono.defer(() -> {
                    User regularUser = User.builder()
                        .username("user1@example.com")  // Use email as username
                        .email("user1@example.com")
                        .password(passwordEncoder.encode("password"))
                        .fullname("Regular User One")
                        .gender(Gender.MALE)
                        .departmentId(dept.getId())  // Use ID reference instead of entity
                        .position("Software Engineer")
                        .active(true)
                        .team("Engineering Team")
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                        
                    // Save the user first
                    return userRepository.save(regularUser)
                        .flatMap(savedUser -> {
                            // Then link the user to the role using a separate operation
                            return roleService.assignRole(savedUser.getId(), userRole.getName())
                                .thenReturn(savedUser);
                        });
                }));
        })
        .doOnSuccess(user -> {
            if (user != null) {
                log.info("Regular user ready: {}", user.getUsername());
            } else {
                log.warn("Regular user is null after processing");
            }
        })
        .onErrorResume(e -> {
            log.error("Error processing regular user: {}", e.getMessage(), e);
            return Mono.empty();
        })
        .subscribe();
        
        // Create user in HR
        Mono.zip(
            roleRepository.findByName(RoleName.ROLE_USER.name()),
            departmentRepository.findByName("Human Resources")
        ).flatMap(tuple -> {
            Role userRole = tuple.getT1();
            Department dept = tuple.getT2();
            
            // First check if user exists by username
            return userRepository.findByUsername("user2@example.com")
                .switchIfEmpty(
                    // If not found by username, check by email
                    userRepository.findByEmail("user2@example.com")
                )
                .flatMap(existingUser -> {
                    log.info("Regular user with email user2@example.com already exists");
                    return Mono.just(existingUser);
                })
                .switchIfEmpty(Mono.defer(() -> {
                    User regularUser = User.builder()
                        .username("user2@example.com")  // Use email as username
                        .email("user2@example.com")
                        .password(passwordEncoder.encode("password"))
                        .fullname("Regular User Two")
                        .gender(Gender.FEMALE)
                        .departmentId(dept.getId())  // Use ID reference instead of entity
                        .position("HR Specialist")
                        .active(true)
                        .team("HR Team")
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                        
                    // Save the user first
                    return userRepository.save(regularUser)
                        .flatMap(savedUser -> {
                            // Then link the user to the role using a separate operation
                            return roleService.assignRole(savedUser.getId(), userRole.getName())
                                .thenReturn(savedUser);
                        });
                }));
        })
        .doOnSuccess(user -> {
            if (user != null) {
                log.info("Regular user ready: {}", user.getUsername());
            } else {
                log.warn("Regular user is null after processing");
            }
        })
        .onErrorResume(e -> {
            log.error("Error processing regular user: {}", e.getMessage(), e);
            return Mono.empty();
        })
        .subscribe();
        
        // Create manager users
        Mono.zip(
            roleRepository.findByName(RoleName.ROLE_MANAGER.name()),
            departmentRepository.findByName("Engineering")
        ).flatMap(tuple -> {
            Role managerRole = tuple.getT1();
            Department dept = tuple.getT2();
            
            // First check if user exists by username
            return userRepository.findByUsername("manager1@example.com")
                .switchIfEmpty(
                    // If not found by username, check by email
                    userRepository.findByEmail("manager1@example.com")
                )
                .flatMap(existingUser -> {
                    log.info("Manager user with email manager1@example.com already exists");
                    return Mono.just(existingUser);
                })
                .switchIfEmpty(Mono.defer(() -> {
                    User managerUser = User.builder()
                        .username("manager1@example.com")  // Use email as username
                        .email("manager1@example.com")
                        .password(passwordEncoder.encode("password"))
                        .fullname("Manager User One")
                        .gender(Gender.MALE)
                        .departmentId(dept.getId())  // Use ID reference instead of entity
                        .position("Engineering Manager")
                        .active(true)
                        .team("Engineering Team")
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                        
                    // Save the user first
                    return userRepository.save(managerUser)
                        .flatMap(savedUser -> {
                            // Then link the user to the role using a separate operation
                            return roleService.assignRole(savedUser.getId(), managerRole.getName())
                                .thenReturn(savedUser);
                        });
                }));
        })
        .doOnSuccess(user -> {
            if (user != null) {
                log.info("Manager user ready: {}", user.getUsername());
            } else {
                log.warn("Manager user is null after processing");
            }
        })
        .onErrorResume(e -> {
            log.error("Error processing manager user: {}", e.getMessage(), e);
            return Mono.empty();
        })
        .subscribe();
    }
    
    private Mono<Role> createRole(RoleName roleName) {
        Role role = Role.builder()
            .name(roleName.name())
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();
        return roleRepository.save(role);
    }
    
    /**
     * Initializes R2DBC schema after Flyway has migrated
     */
    @Bean
    public ConnectionFactoryInitializer initializer(ConnectionFactory connectionFactory) {
        ConnectionFactoryInitializer initializer = new ConnectionFactoryInitializer();
        initializer.setConnectionFactory(connectionFactory);
        
        // Load any additional initialization scripts if needed
        ClassPathResource initScript = new ClassPathResource("schema-init.sql");
        if (initScript.exists()) {
            log.info("Loading additional schema initialization script");
            initializer.setDatabasePopulator(new ResourceDatabasePopulator(initScript));
        }
        
        return initializer;
    }
} 