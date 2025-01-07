package dev.bengi.userservice.service.impl;

import dev.bengi.userservice.exception.wrapper.*;
import dev.bengi.userservice.domain.enums.RoleName;
import dev.bengi.userservice.domain.model.Role;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.repository.RoleRepository;
import dev.bengi.userservice.repository.UserRepository;
import dev.bengi.userservice.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

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

        Role role = roleRepository.findByName(mapToRoleName(roleName))
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

        if (user.getRoles().removeIf(role -> role.getName().equals(mapToRoleName(roleName)))) {
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

    private RoleName mapToRoleName(String roleName) {
        return switch (roleName) {
            case "ADMIN", "admin", "Admin" -> RoleName.ADMIN;
            case "USER", "user", "User" -> RoleName.USER;
            default -> null;
        };
    }


}
