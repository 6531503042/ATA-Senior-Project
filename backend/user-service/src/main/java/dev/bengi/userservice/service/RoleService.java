package dev.bengi.userservice.service;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import dev.bengi.userservice.domain.enums.RoleName;
import dev.bengi.userservice.domain.model.Role;
import dev.bengi.userservice.domain.model.User;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface RoleService {
    Mono<Role> findByName(RoleName name) throws RoleNotFoundException;
    
    Flux<Role> findAllRoles();
    
    Mono<Role> createRole(RoleName name);

    @Transactional
    Mono<Boolean> assignRole(Long userId, String roleName);

    Mono<Boolean> revokeRole(Long id, String roleName);

    Mono<List<String>> getUserRoles(long id);

    @Transactional
    Mono<Void> addRoleToUser(User user, String roleName);
    
    // Methods for R2dbcEntityTemplate examples
    Mono<Boolean> updateRoleDescription(String roleName, String newDescription);
    
    Flux<Role> findRolesWithDescriptionContaining(String text);
} 