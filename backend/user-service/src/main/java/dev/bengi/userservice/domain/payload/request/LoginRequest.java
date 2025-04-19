package dev.bengi.userservice.domain.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Login request payload
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    /**
     * Username or email used for login
     */
    @NotBlank
    private String username;  // Can be either username or email

    @NotBlank
    private String password;
}
