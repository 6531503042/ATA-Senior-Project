package dev.bengi.userservice.service;

import dev.bengi.userservice.domain.enums.RoleName;
import dev.bengi.userservice.domain.model.Role;
import org.springframework.transaction.annotation.Transactional;

import javax.management.relation.RoleNotFoundException;
import java.util.List;
import java.util.Optional;

public interface RoleService {
    Optional<Role> findByName(RoleName name) throws RoleNotFoundException;

    @Transactional
    boolean assignRole(Long userId, String roleName) throws RoleNotFoundException;

    @Transactional
    boolean revokeRole(Long id, String roleName);

    List<String> getUserRoles(Long id);
}
