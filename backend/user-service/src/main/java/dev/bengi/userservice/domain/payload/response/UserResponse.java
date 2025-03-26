package dev.bengi.userservice.domain.payload.response;

import java.util.List;

import lombok.AllArgsConstructor;
import dev.bengi.userservice.domain.payload.response.DepartmentResponse;
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
    private DepartmentResponse department;
    private List<String> roles;
}
