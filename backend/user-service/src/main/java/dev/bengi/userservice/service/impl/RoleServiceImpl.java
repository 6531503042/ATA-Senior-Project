package dev.bengi.userservice.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import dev.bengi.userservice.exception.ErrorCode;
import dev.bengi.userservice.exception.GlobalServiceException;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.relational.core.query.Query;
import org.springframework.data.relational.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.bengi.userservice.domain.enums.RoleName;
import dev.bengi.userservice.domain.model.Role;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.repository.RoleRepository;
import dev.bengi.userservice.repository.UserRepository;
import dev.bengi.userservice.service.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final R2dbcEntityTemplate template;

    @Override
    public Mono<Role> findByName(RoleName name) {
        return roleRepository.findByName(name.name())
                .switchIfEmpty(Mono.defer(() -> {
                    log.warn("Role not found with name: {}, creating it", name);
                    return createRole(name);
                }))
                .doOnSuccess(role -> log.info("Role found: {}", role.getName()))
                .doOnError(e -> log.error("Error finding roles: {}", e.getMessage()));
    }

    @Override
    public Flux<Role> findAllRoles() {

        return roleRepository.findAllRoles()
                .doOnNext(role -> log.debug("Found role: {}", role.getName()));
    }

    @Override
    public Mono<Role> createRole(RoleName name) {
        Role role = Role.builder()
                .name(name.name())
                .description("Auto-created role: " + name.name())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
                
        return roleRepository.save(role)
                .doOnSuccess(r -> log.info("Role created: {}", r.getName()))
                .doOnError(e -> log.error("Error creating role: {}", e.getMessage()));
    }
    
    // Example of using R2dbcEntityTemplate for advanced operations
    @Override
    public Mono<Boolean> updateRoleDescription(String roleName, String newDescription) {
        return template.update(Role.class)
                .matching(Query.query(Criteria.where("name").is(roleName)))
                .apply(Update.update("description", newDescription)
                              .set("updated_at", LocalDateTime.now()))
                .map(count -> count > 0)
                .doOnSuccess(updated -> {
                    if (updated) {
                        log.info("Updated description for role: {}", roleName);
                    } else {
                        log.warn("Role not found for update: {}", roleName);
                    }
                });
    }
    
    // Example of using template for a custom query
    @Override
    public Flux<Role> findRolesWithDescriptionContaining(String text) {
        return template.select(Role.class)
                .matching(Query.query(Criteria.where("description").like("%" + text + "%")))
                .all()
                .doOnNext(role -> log.debug("Found role with matching description: {}", role.getName()))
                .doOnError(e -> log.error("Error finding roles: {}", e.getMessage()));
    }

    @Override
    @Transactional
    public Mono<Boolean> assignRole(Long userId, String roleName) {
        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND)))
                .flatMap(user -> {
                    RoleName mappedRoleName = mapStringToRoleName(roleName);
                    return roleRepository.findByName(mappedRoleName.name())
                            .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.ROLE_NOT_FOUND)))
                            .flatMap(role -> {
                                if (user.getRoles().contains(role)) {
                                    log.warn("User {} already has role {}", userId, role.getName());
                                    return Mono.just(false); // Role already assigned
                                }

                                user.getRoles().add(role);
                                return userRepository.save(user).thenReturn(true);
                            });
                })
                .doOnSuccess(success -> {
                    if (success) {
                        log.info("Assigned role {} to user {}", roleName, userId);
                    }
                })
                .doOnError(e -> log.error("Error assigning role: {}", e.getMessage()));
    }


        @Override
    @Transactional
    public Mono<Boolean> revokeRole(Long userId, String roleName) {
        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND)))
                .flatMap(user -> {
                    boolean removed = user.getRoles().removeIf(role -> role.getName().equalsIgnoreCase(roleName));
                    if (removed) {
                        return userRepository.save(user).thenReturn(true);
                    }
                    log.warn("Role {} not found for user {}", roleName, userId);
                    return Mono.just(false);
                })
                .doOnSuccess(success -> {
                    if (success) {
                        log.info("Revoked role {} from user {}", roleName, userId);
                    }
                })
                .doOnError(e -> log.error("Error revoking role: {}", e.getMessage()));
    }

    @Override
    public Mono<List<String>> getUserRoles(long userId) {
        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND)))
                .flatMap(user -> {
                    List<String> roleNames = user.getRoles().stream()
                            .map(Role::getName)
                            .toList();
                    return Mono.just(roleNames);
                })
                .doOnError(e -> log.error("Error fetching user roles: {}", e.getMessage()));
    }

    @Override
    @Transactional
    public Mono<Void> addRoleToUser(User user, String roleName) {
        return roleRepository.findByName(mapStringToRoleName(roleName).name())
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.ROLE_NOT_FOUND)))
                .flatMap(role -> {
                    user.getRoles().add(role);
                    return userRepository.save(user).then();
                })
                .doOnError(e -> log.error("Error adding role to user: {}", e.getMessage()));
    }

    private RoleName mapStringToRoleName(String roleName) {
        return switch (roleName.toUpperCase()) {
            case "ADMIN", "ROLE_ADMIN" -> RoleName.ROLE_ADMIN;
            case "USER", "ROLE_USER" -> RoleName.ROLE_USER;
            case "MANAGER", "ROLE_MANAGER" -> RoleName.ROLE_MANAGER;
            default -> throw new GlobalServiceException(ErrorCode.ROLE_NOT_FOUND);
        };
    }
}