package dev.bengi.main.modules.user.service;

import dev.bengi.main.common.pagination.PageRequest;
import dev.bengi.main.common.pagination.PageResponse;
import dev.bengi.main.common.pagination.PaginationService;
import dev.bengi.main.exception.ErrorCode;
import dev.bengi.main.exception.GlobalServiceException;
import dev.bengi.main.modules.user.dto.*;
import dev.bengi.main.modules.user.model.User;
import dev.bengi.main.modules.user.repository.UserRepository;
import dev.bengi.main.modules.user.repository.UserRoleRepository;
import dev.bengi.main.modules.role.repository.RoleRepository;
import dev.bengi.main.modules.department.repository.DepartmentRepository;
import dev.bengi.main.security.SecurityAuditService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserManagementService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final DatabaseClient databaseClient;
    private final PasswordEncoder passwordEncoder;
    private final PaginationService paginationService;
    private final SecurityAuditService auditService;

    // Allowed sort fields for users
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "id", "username", "email", "first_name", "last_name", "created_at", "updated_at", "last_login_at"
    );

    // Searchable fields
    private static final Set<String> SEARCHABLE_FIELDS = Set.of(
        "username", "email", "first_name", "last_name"
    );

    public Mono<PageResponse<UserResponseDto>> findAllUsers(PageRequest pageRequest) {
        String baseQuery = """
            SELECT u.*, d.name as department_name
            FROM users u
            LEFT JOIN departments d ON u.department_id = d.id
            WHERE 1=1
            """;
        
        String countQuery = "SELECT COUNT(*) FROM users u WHERE 1=1";

        return paginationService.executePaginatedQuery(
            baseQuery,
            countQuery,
            pageRequest,
            ALLOWED_SORT_FIELDS,
            SEARCHABLE_FIELDS,
            this::executeUserQuery,
            this::executeCountQuery
        );
    }

    public Mono<UserResponseDto> findUserById(Long id) {
        return findUserWithDepartment(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "User not found")))
                .flatMap(this::enrichUserWithRoles)
                .map(this::mapToResponseDto);
    }

    public Mono<UserResponseDto> findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "User not found")))
                .flatMap(this::enrichUserWithRoles)
                .map(this::mapToResponseDto);
    }

    @Transactional
    public Mono<UserResponseDto> createUser(UserCreateRequestDto request) {
        // Validate username and email uniqueness
        return validateUserUniqueness(request.username(), request.email())
                .then(validateDepartmentExists(request.departmentId()))
                .then(validateRolesExist(request.roles()))
                .then(Mono.defer(() -> {
                    User user = mapToUser(request);
                    user.setPassword(passwordEncoder.encode(request.password()));
                    
                    return userRepository.save(user)
                            .flatMap(savedUser -> assignRolesToUser(savedUser.getId(), request.roles())
                                    .thenReturn(savedUser))
                            .flatMap(this::enrichUserWithRoles)
                            .map(this::mapToResponseDto)
                            .doOnSuccess(u -> log.info("User created: {}", u.username()));
                }));
    }

    @Transactional
    public Mono<UserResponseDto> updateUser(Long id, UserUpdateRequestDto request, boolean isSelfUpdate) {
        return findUserWithDepartment(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "User not found")))
                .flatMap(user -> {
                    // Validate email uniqueness if changed
                    Mono<Void> emailValidation = Mono.empty();
                    if (request.email() != null && !request.email().equals(user.getEmail())) {
                        emailValidation = userRepository.existsByEmail(request.email())
                                .flatMap(exists -> exists 
                                    ? Mono.error(new GlobalServiceException(ErrorCode.CONFLICT, "Email already exists"))
                                    : Mono.empty());
                    }
                    
                    // Validate department
                    Mono<Void> deptValidation = validateDepartmentExists(request.departmentId());
                    
                    return emailValidation.then(deptValidation).then(Mono.defer(() -> {
                        updateUserFields(user, request, isSelfUpdate);
                        return userRepository.save(user);
                    }));
                })
                .flatMap(this::enrichUserWithRoles)
                .map(this::mapToResponseDto)
                .doOnSuccess(u -> log.info("User updated: {}", u.username()));
    }

    @Transactional
    public Mono<Void> changePassword(Long id, ChangePasswordRequestDto request, boolean isSelfUpdate) {
        // Validate password confirmation
        if (!request.newPassword().equals(request.confirmPassword())) {
            return Mono.error(new GlobalServiceException(ErrorCode.VALIDATION_ERROR, "Password confirmation does not match"));
        }

        return userRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "User not found")))
                .flatMap(user -> {
                    // If self-update, verify current password
                    if (isSelfUpdate && request.currentPassword() != null) {
                        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
                            return Mono.error(new GlobalServiceException(ErrorCode.UNAUTHORIZED, "Current password is incorrect"));
                        }
                    }
                    
                    user.setPassword(passwordEncoder.encode(request.newPassword()));
                    return userRepository.save(user);
                })
                .then()
                .doOnSuccess(v -> log.info("Password changed for user ID: {}", id));
    }

    @Transactional
    public Mono<UserResponseDto> updateUserRoles(Long id, UserRoleUpdateRequestDto request) {
        return validateRolesExist(request.roles())
                .then(findUserWithDepartment(id))
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "User not found")))
                .flatMap(user -> removeAllUserRoles(user.getId())
                        .then(assignRolesToUser(user.getId(), request.roles()))
                        .thenReturn(user))
                .flatMap(this::enrichUserWithRoles)
                .map(this::mapToResponseDto)
                .doOnSuccess(u -> log.info("User roles updated: {} -> {}", u.username(), u.roles()));
    }

    @Transactional
    public Mono<Void> deleteUser(Long id, String currentUsername) {
        return userRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "User not found")))
                .flatMap(user -> {
                    // Prevent self-deletion
                    if (user.getUsername().equals(currentUsername)) {
                        return Mono.error(new GlobalServiceException(ErrorCode.BAD_REQUEST, "Cannot delete your own account"));
                    }
                    
                    return userRepository.deleteById(id);
                })
                .doOnSuccess(v -> log.info("User deleted: ID {}", id));
    }

    public Mono<UserResponseDto> activateUser(Long id) {
        return toggleUserActiveStatus(id, true, "activated");
    }

    public Mono<UserResponseDto> deactivateUser(Long id) {
        return toggleUserActiveStatus(id, false, "deactivated");
    }

    public Mono<PageResponse<UserResponseDto>> searchUsers(PageRequest pageRequest) {
        return findAllUsers(pageRequest);
    }

    public Mono<PageResponse<UserResponseDto>> findUsersByRole(String roleName, PageRequest pageRequest) {
        String baseQuery = """
            SELECT u.*, d.name as department_name
            FROM users u
            LEFT JOIN departments d ON u.department_id = d.id
            JOIN user_roles ur ON u.id = ur.user_id
            JOIN roles r ON ur.role_id = r.id
            WHERE r.name = '%s'
            """.formatted(roleName);
        
        String countQuery = """
            SELECT COUNT(*)
            FROM users u
            JOIN user_roles ur ON u.id = ur.user_id
            JOIN roles r ON ur.role_id = r.id
            WHERE r.name = '%s'
            """.formatted(roleName);

        return paginationService.executePaginatedQuery(
            baseQuery,
            countQuery,
            pageRequest,
            ALLOWED_SORT_FIELDS,
            SEARCHABLE_FIELDS,
            this::executeUserQuery,
            this::executeCountQuery
        );
    }

    public Mono<String> getUsernameById(Long id) {
        return userRepository.findById(id)
                .map(User::getUsername)
                .switchIfEmpty(Mono.empty());
    }

    // Private helper methods

    private Mono<Void> validateUserUniqueness(String username, String email) {
        return userRepository.existsByUsername(username)
                .flatMap(exists -> exists 
                    ? Mono.error(new GlobalServiceException(ErrorCode.CONFLICT, "Username already exists"))
                    : Mono.empty())
                .then(userRepository.existsByEmail(email))
                .flatMap(exists -> exists 
                    ? Mono.error(new GlobalServiceException(ErrorCode.CONFLICT, "Email already exists"))
                    : Mono.empty());
    }

    private Mono<Void> validateDepartmentExists(Long departmentId) {
        if (departmentId == null) return Mono.empty();
        
        return departmentRepository.existsById(departmentId)
                .flatMap(exists -> exists 
                    ? Mono.empty()
                    : Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "Department not found")));
    }

    private Mono<Void> validateRolesExist(Set<String> roles) {
        if (roles == null || roles.isEmpty()) return Mono.empty();
        
        return Flux.fromIterable(roles)
                .flatMap(roleName -> roleRepository.existsByName(roleName)
                        .flatMap(exists -> exists 
                            ? Mono.empty()
                            : Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "Role not found: " + roleName))))
                .then();
    }

    private Mono<User> findUserWithDepartment(Long id) {
        return databaseClient.sql("""
                SELECT u.*, d.name as department_name
                FROM users u
                LEFT JOIN departments d ON u.department_id = d.id
                WHERE u.id = :id
                """)
                .bind("id", id)
                .map((row, meta) -> {
                    User user = new User();
                    user.setId(row.get("id", Long.class));
                    user.setUsername(row.get("username", String.class));
                    user.setEmail(row.get("email", String.class));
                    user.setPassword(row.get("password", String.class));
                    user.setFirstName(row.get("first_name", String.class));
                    user.setLastName(row.get("last_name", String.class));
                    user.setPhone(row.get("phone", String.class));
                    user.setDepartmentId(row.get("department_id", Long.class));
                    user.setActive(Boolean.TRUE.equals(row.get("active", Boolean.class)));
                    user.setLastLoginAt(row.get("last_login_at", LocalDateTime.class));
                    user.setCreatedAt(row.get("created_at", LocalDateTime.class));
                    user.setUpdatedAt(row.get("updated_at", LocalDateTime.class));
                    user.setDepartmentName(row.get("department_name", String.class));
                    return user;
                })
                .one();
    }

    private Mono<User> enrichUserWithRoles(User user) {
        return userRepository.findRoleNamesByUsername(user.getUsername())
                .collectList()
                .map(roleNames -> {
                    user.setRoles(Set.copyOf(roleNames));
                    return user;
                });
    }

    private Mono<Void> assignRolesToUser(Long userId, Set<String> roles) {
        if (roles == null || roles.isEmpty()) return Mono.empty();
        
        return Flux.fromIterable(roles)
                .flatMap(roleName -> roleRepository.findByName(roleName)
                        .flatMap(role -> userRoleRepository.addUserRole(userId, role.getId())))
                .then();
    }

    private Mono<Void> removeAllUserRoles(Long userId) {
        return databaseClient.sql("DELETE FROM user_roles WHERE user_id = :userId")
                .bind("userId", userId)
                .fetch()
                .rowsUpdated()
                .then();
    }

    private Mono<UserResponseDto> toggleUserActiveStatus(Long id, boolean active, String action) {
        return userRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "User not found")))
                .flatMap(user -> {
                    user.setActive(active);
                    return userRepository.save(user);
                })
                .flatMap(this::enrichUserWithRoles)
                .map(this::mapToResponseDto)
                .doOnSuccess(u -> log.info("User {}: {}", action, u.username()));
    }

    private User mapToUser(UserCreateRequestDto request) {
        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPhone(request.phone());
        user.setDepartmentId(request.departmentId());
        user.setActive(request.active());
        return user;
    }

    private void updateUserFields(User user, UserUpdateRequestDto request, boolean isSelfUpdate) {
        if (request.email() != null) user.setEmail(request.email());
        if (request.firstName() != null) user.setFirstName(request.firstName());
        if (request.lastName() != null) user.setLastName(request.lastName());
        if (request.phone() != null) user.setPhone(request.phone());
        if (request.departmentId() != null) user.setDepartmentId(request.departmentId());
        
        // Only admins can change active status
        if (!isSelfUpdate && request.active() != null) {
            user.setActive(request.active());
        }
    }

    private UserResponseDto mapToResponseDto(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone(),
                user.getDepartmentId(),
                user.getDepartmentName(),
                user.getRoles(),
                user.isActive(),
                user.getLastLoginAt(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    private Flux<UserResponseDto> executeUserQuery(String query) {
        return databaseClient.sql(query)
                .map((row, meta) -> {
                    User user = new User();
                    user.setId(row.get("id", Long.class));
                    user.setUsername(row.get("username", String.class));
                    user.setEmail(row.get("email", String.class));
                    user.setFirstName(row.get("first_name", String.class));
                    user.setLastName(row.get("last_name", String.class));
                    user.setPhone(row.get("phone", String.class));
                    user.setDepartmentId(row.get("department_id", Long.class));
                    user.setActive(Boolean.TRUE.equals(row.get("active", Boolean.class)));
                    user.setLastLoginAt(row.get("last_login_at", LocalDateTime.class));
                    user.setCreatedAt(row.get("created_at", LocalDateTime.class));
                    user.setUpdatedAt(row.get("updated_at", LocalDateTime.class));
                    user.setDepartmentName(row.get("department_name", String.class));
                    return user;
                })
                .all()
                .flatMap(this::enrichUserWithRoles)
                .map(this::mapToResponseDto);
    }

    private Mono<Long> executeCountQuery(String query) {
        return databaseClient.sql(query)
                .map((row, meta) -> row.get(0, Long.class))
                .one();
    }
}
