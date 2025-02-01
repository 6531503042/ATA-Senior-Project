package dev.bengi.userservice.domain.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Set;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String fullname;
    private String username;
    private String password;
    private String email;
    private String gender;
    private String avatar;
    private Set<String> roles;

}
