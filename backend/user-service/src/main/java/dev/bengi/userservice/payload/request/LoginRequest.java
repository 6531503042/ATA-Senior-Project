package dev.bengi.userservice.payload.request;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class LoginRequest {
    
    private String username;
    private String password;
}
