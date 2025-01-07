package dev.bengi.userservice.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Set;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String fullName;
    private String username;
    private String password;
    private String email;
    private String gender;
    private String avatar;
    private Set<String> roles;

}
