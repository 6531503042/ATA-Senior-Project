package dev.bengi.userservice.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

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
    public Mono<Role> findByName(String name) {
        return roleRepository.findByName(name);
    }

    @Override
    public Flux<Role> findAllRoles() {
        return roleRepository.findAllRoles();
    }

    @Override
    public Mono<Role> createRole(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public Mono<Role> updateRolePermissions(String roleName, Set<String> permissions) {
        return roleRepository.findByName(roleName)
            .flatMap(role -> {
                role.setPermissions(permissions);
                role.setUpdatedAt(LocalDateTime.now());
                return roleRepository.save(role);
            });
    }

    @Override
    public Mono<Void> deleteRole(String roleName) {
        return roleRepository.findByName(roleName)
            .flatMap(role -> roleRepository.delete(role));
    }

    @Override
    @Transactional
    public Mono<Boolean> assignRole(Long userId, String roleName) {
        return Mono.zip(
            userRepository.findById(userId),
            roleRepository.findByName(roleName)
        ).flatMap(tuple -> {
            User user = tuple.getT1();
            Role role = tuple.getT2();
            
            user.setRoleId(role.getId());
            return userRepository.save(user)
                .map(savedUser -> true)
                .defaultIfEmpty(false);
        });
    }

    @Override
    @Transactional
    public Mono<Boolean> revokeRole(Long userId, String roleName) {
        return Mono.zip(
            userRepository.findById(userId),
            roleRepository.findByName(roleName)
        ).flatMap(tuple -> {
            Role role = tuple.getT2();
            
            String sql = "DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2";
            return template.getDatabaseClient()
                .sql(sql)
                .bind("$1", userId)
                .bind("$2", role.getId())
                .fetch()
                .rowsUpdated()
                .map(rowsUpdated -> rowsUpdated > 0);
        });
    }

    @Override
    public Mono<List<String>> getUserRoles(long userId) {
        String sql = """
            SELECT r.name 
            FROM roles r 
            JOIN user_roles ur ON r.id = ur.role_id 
            WHERE ur.user_id = $1
            """;
            
        return template.getDatabaseClient()
            .sql(sql)
            .bind("$1", userId)
            .map((row, metadata) -> row.get("name", String.class))
            .all()
            .collectList();
    }

    @Override
    @Transactional
    public Mono<Void> addRoleToUser(User user, String roleName) {
        return roleRepository.findByName(roleName)
            .flatMap(role -> assignRole(user.getId(), roleName))
            .then();
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
}