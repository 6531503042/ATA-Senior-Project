package dev.bengi.userservice.domain.payload.request;

import java.util.Set;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class AddUserRequest {
    private Long id;
    private String fullname;
    private String password;
    private String email;
    private String avatar;
    private Long departmentId;
    private Set<String> roles;
} 