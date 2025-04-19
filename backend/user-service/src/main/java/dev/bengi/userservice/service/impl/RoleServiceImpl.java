package dev.bengi.userservice.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.relational.core.query.Query;
import org.springframework.data.relational.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.bengi.userservice.domain.enums.RoleName;
import dev.bengi.userservice.domain.model.Role;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.exception.RoleNotFoundException;
import dev.bengi.userservice.exception.UserNotFoundException;
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
                }));
    }

    @Override
    public Flux<Role> findAllRoles() {
        return roleRepository.findAllRoles();
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
                .doOnNext(role -> log.debug("Found role with matching description: {}", role.getName()));
    }

    @Transactional
    @Override
    public Mono<Boolean> assignRole(Long userId, String roleName) {
        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new UserNotFoundException("UserId not found: " + userId)))
                .flatMap(user -> {
                    String roleNameStr = mapStringToRoleName(roleName).name();
                    return roleRepository.findByName(roleNameStr)
                        .switchIfEmpty(Mono.error(new RoleNotFoundException("Role not found with name: " + roleName)))
                        .flatMap(role -> {
                            if (user.getRoles().contains(role)) {
                                return Mono.just(false); // Role already assigned
                            }

                            // Add role to user and save
                            user.getRoles().add(role);
                            return userRepository.save(user)
                                    .then(Mono.just(true)); // Return true after saving
                        });
                });
    }

    @Transactional
    @Override
    public Mono<Boolean> revokeRole(Long id, String roleName) {
        return userRepository.findById(id)
                .switchIfEmpty(Mono.error(new UserNotFoundException("UserId not found: " + id)))
                .flatMap(user -> {
                    boolean removed = user.getRoles().removeIf(role -> role.getName().equals(mapStringToRoleName(roleName).name()));
                    if (removed) {
                        return userRepository.save(user)
                                .then(Mono.just(true));
                    }
                    return Mono.just(false);
                });
    }

    @Override
    public Mono<List<String>> getUserRoles(long id) {
        return userRepository.findById(id)
                .switchIfEmpty(Mono.error(new UserNotFoundException("UserId not found : " + id)))
                .flatMap(user -> {
                    List<String> roleName = user.getRoles().stream()
                            .map(role -> role.getName())
                            .toList();
                    return Mono.just(roleName);
                });
    }

    @Override
    @Transactional
    public Mono<Void> addRoleToUser(User user, String roleName) {
        String roleNameStr = mapStringToRoleName(roleName).name();
        return roleRepository.findByName(roleNameStr)
                .switchIfEmpty(Mono.error(new RoleNotFoundException("Role not found with name: " + roleName)))
                .flatMap(role -> {
                    user.getRoles().add(role);
                    return userRepository.save(user).then();
                });
    }

    private RoleName mapStringToRoleName(String roleName) {
        return switch (roleName.toUpperCase()) {
            case "ADMIN", "ROLE_ADMIN" -> RoleName.ROLE_ADMIN;
            case "USER", "ROLE_USER" -> RoleName.ROLE_USER;
            case "MANAGER", "ROLE_MANAGER" -> RoleName.ROLE_MANAGER;
            default -> throw new IllegalArgumentException("Invalid role name: " + roleName);
        };
    }

}
