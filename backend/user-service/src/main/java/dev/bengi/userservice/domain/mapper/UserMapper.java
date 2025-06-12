package dev.bengi.userservice.domain.mapper;

import dev.bengi.userservice.domain.model.Role;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.domain.payload.response.AuthResponse;
import dev.bengi.userservice.domain.payload.response.UserResponse;
import dev.bengi.userservice.domain.payload.response.UserResponse.DepartmentInfo;
import dev.bengi.userservice.domain.payload.response.UserResponse.RoleInfo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    Logger log = LoggerFactory.getLogger(UserMapper.class);

    @Mapping(target = "roles", expression = "java(mapRolesToStrings(user.getRoles()))")
    @Mapping(target = "permissions", expression = "java(getPermissions(user.getRoles()))")
    @Mapping(target = "department", expression = "java(toAuthDepartmentInfo(user))")
    AuthResponse toAuthResponse(User user);

    @Mapping(target = "roles", expression = "java(mapRolesToInfo(user.getRoles()))")
    @Mapping(target = "department", expression = "java(toDepartmentInfo(user))")
    UserResponse toUserResponse(User user);

    default List<String> mapRolesToStrings(Set<Role> roles) {
        if (roles == null) return new ArrayList<>();
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.toList());
    }

    default List<RoleInfo> mapRolesToInfo(Set<Role> roles) {
        if (roles == null) return new ArrayList<>();
        return roles.stream()
                .map(role -> RoleInfo.builder()
                        .id(role.getId())
                        .name(role.getName())
                        .permissions(new ArrayList<>(role.getPermissions()))
                        .build())
                .collect(Collectors.toList());
    }
    
    default Set<String> getPermissions(Set<Role> roles) {
        if (roles == null) return new HashSet<>();
        Set<String> permissions = roles.stream()
                .map(Role::getPermissions)
                .filter(Objects::nonNull)
                .flatMap(Set::stream)
                .collect(Collectors.toSet());
        log.debug("Mapped permissions for roles: {}", permissions);
        return permissions;
    }
    
    default DepartmentInfo toDepartmentInfo(User user) {
        if (user == null || user.getDepartmentId() == null) return null;
        return DepartmentInfo.builder()
                .departmentId(user.getDepartmentId())
                .departmentName(user.getDepartment() != null ? user.getDepartment().getName() : null)
                .build();
    }

    default AuthResponse.DepartmentInfo toAuthDepartmentInfo(User user) {
        if (user == null || user.getDepartmentId() == null) return null;
        return AuthResponse.DepartmentInfo.builder()
                .departmentId(user.getDepartmentId())
                .departmentName(user.getDepartment() != null ? user.getDepartment().getName() : null)
                .build();
    }
}
