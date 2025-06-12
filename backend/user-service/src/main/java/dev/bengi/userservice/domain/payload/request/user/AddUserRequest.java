package dev.bengi.userservice.domain.payload.request.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddUserRequest {
    private Long id;

    @NotBlank
    @Size(max = 50)
    private String fullname;

    @NotBlank
    @Size(min = 6, max = 120)
    private String password;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    private Long departmentId;
    private Set<String> roles;
    private String team;
    private Long managerId;
    private String teamRole;
} 