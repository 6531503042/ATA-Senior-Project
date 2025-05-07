package dev.bengi.userservice.domain.mapper;

import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.domain.payload.response.AuthResponse;
import dev.bengi.userservice.domain.payload.response.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", source = "department.name")
    @Mapping(target = "roles", expression = "java(user.getRoles().stream().map(role -> role.getName()).toList())")
    AuthResponse toAuthResponse(User user);

    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", source = "department.name")
    @Mapping(target = "roles", expression = "java(user.getRoles().stream().map(role -> role.getName()).toList())")
    UserResponse toUserResponse(User user);
}
