package dev.bengi.userservice.domain.payload.response;

import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
import dev.bengi.userservice.domain.model.Role;
import dev.bengi.userservice.domain.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String fullname;
    private DepartmentInfo department;
    private List<RoleInfo> roles;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentInfo {
        private Long departmentId;
        private String departmentName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoleInfo {
        private Long id;
        private String name;
        private List<String> permissions;
    }

    // Static factory method for converting User to UserResponse
    public static UserResponse fromUser(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullname(user.getFullname())
                .department(DepartmentInfo.builder()
                        .departmentId(user.getDepartmentId())
                        .departmentName(user.getDepartment() != null ? user.getDepartment().getName() : null)
                        .build())
                .roles(user.getRoles().stream()
                        .map(role -> RoleInfo.builder()
                                .id(role.getId())
                                .name(role.getName())
                                .permissions(new ArrayList<>(role.getPermissions()))
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
