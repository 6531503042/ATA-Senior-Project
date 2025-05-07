package dev.bengi.userservice.domain.payload.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

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
    private String username;
    private String fullname;
    private String email;
    private String avatar;
    private String gender;
    private Long departmentId;
    private String departmentName;
    private List<String> roles;
    
    // Department & Organization Details
    private String team;
    private Long managerId;
    private String teamRole;

    // Static factory method for converting User to UserResponse
    public static UserResponse fromUser(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullname(user.getFullname())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .gender(user.getGender() != null ? user.getGender().name() : null)
                .roles(user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toList()))
                .departmentId(user.getDepartment() != null ? user.getDepartment().getId() : null)
                .departmentName(user.getDepartment() != null ? user.getDepartment().getName() : null)
                .team(user.getTeam())
                .managerId(user.getManagerId())
                .teamRole(user.getTeamRole())
                .build();
    }
}
