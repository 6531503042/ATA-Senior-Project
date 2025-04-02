package dev.bengi.userservice.domain.payload.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private Long id;
    private String username;
    private String fullname;
    private String email;
    private String avatar;
    private String gender;
    private Long departmentId;
    private String departmentName;
    private List<String> roles;
}
