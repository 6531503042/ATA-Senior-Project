package dev.bengi.userservice.service;

import java.util.List;
import java.util.Set;

import org.springframework.transaction.annotation.Transactional;

import dev.bengi.userservice.domain.enums.RoleName;
import dev.bengi.userservice.domain.model.Role;
import dev.bengi.userservice.domain.model.User;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface RoleService {
    Mono<Role> findByName(String name);
    
    Flux<Role> findAllRoles();
    
    Mono<Role> createRole(Role role);

    Mono<Role> updateRolePermissions(String roleName, Set<String> permissions);

    Mono<Void> deleteRole(String roleName);

    @Transactional
    Mono<Boolean> assignRole(Long userId, String roleName);

    Mono<Boolean> revokeRole(Long userId, String roleName);

    Mono<List<String>> getUserRoles(long userId);

    @Transactional
    Mono<Void> addRoleToUser(User user, String roleName);
    
    // Methods for R2dbcEntityTemplate examples
    Mono<Boolean> updateRoleDescription(String roleName, String newDescription);
    
    Flux<Role> findRolesWithDescriptionContaining(String text);
} 