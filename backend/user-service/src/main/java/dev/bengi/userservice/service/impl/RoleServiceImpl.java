package dev.bengi.userservice.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import dev.bengi.userservice.domain.enums.RoleName;
import dev.bengi.userservice.domain.model.Role;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.exception.wrapper.RoleNotFoundException;
import dev.bengi.userservice.exception.wrapper.UserNotFoundException;
import dev.bengi.userservice.repository.RoleRepository;
import dev.bengi.userservice.repository.UserRepository;
import dev.bengi.userservice.service.RoleService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Override
    public Optional<Role> findByName(RoleName name) throws dev.bengi.userservice.exception.wrapper.RoleNotFoundException {
        return Optional.ofNullable(roleRepository.findByName(name)
                .orElseThrow(() -> new dev.bengi.userservice.exception.wrapper.RoleNotFoundException("Role not found with name: "+ name)));
    }

    @Transactional
    @Override
    public boolean assignRole(Long userId, String roleName) throws RoleNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        Role role = roleRepository.findByName(mapStringToRoleName(roleName))
                .orElseThrow(() -> new RoleNotFoundException("Role not found with name: " + roleName));

        if (user.getRoles().contains(role)) {
            return false;
        }

        user.getRoles().add(role);
        userRepository.save(user);
        return true;
    }

    @Transactional
    @Override
    public boolean revokeRole(Long id, String roleName) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));

        if (user.getRoles().removeIf(role -> role.getName().equals(mapStringToRoleName(roleName)))) {
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Override
    public List<String> getUserRoles(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));
        List<String> roleNames = new ArrayList<>();

        for (Role role : user.getRoles()) {
            roleNames.add(role.getName().toString());
        }

        return roleNames;
    }

    @Override
    @Transactional
    public void addRoleToUser(User user, String roleName) throws RoleNotFoundException {
        Role role = roleRepository.findByName(mapStringToRoleName(roleName))
                .orElseThrow(() -> new RoleNotFoundException("Role not found with name: " + roleName));
        
        if (!user.getRoles().contains(role)) {
            user.getRoles().add(role);
        }
    }

    private RoleName mapStringToRoleName(String roleName) {
        return switch (roleName.toUpperCase()) {
            case "ADMIN", "ROLE_ADMIN" -> RoleName.ROLE_ADMIN;
            case "USER", "ROLE_USER" -> RoleName.ROLE_USER;
            default -> throw new IllegalArgumentException("Invalid role name: " + roleName);
        };
    }

}
