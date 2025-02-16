package dev.bengi.userservice.domain.payload.request;

import java.util.Set;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class AddUserRequest {

    private Long id;
    private String username;
    private String fullname;
    private String password;
    private String email;
    private String gender;
    private String avatar;
    private Set<String> roles;
}
