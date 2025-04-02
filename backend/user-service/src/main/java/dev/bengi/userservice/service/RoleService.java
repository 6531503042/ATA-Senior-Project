package dev.bengi.userservice.service;

import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;
import dev.bengi.userservice.domain.enums.RoleName;
import dev.bengi.userservice.domain.model.Role;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.exception.RoleNotFoundException;

public interface RoleService {
    Optional<Role> findByName(RoleName name) throws RoleNotFoundException;

    @Transactional
    boolean assignRole(Long userId, String roleName) throws RoleNotFoundException;

    @Transactional
    boolean revokeRole(Long id, String roleName);

    List<String> getUserRoles(Long id);
    
    @Transactional
    void addRoleToUser(User user, String roleName) throws RoleNotFoundException;
}
