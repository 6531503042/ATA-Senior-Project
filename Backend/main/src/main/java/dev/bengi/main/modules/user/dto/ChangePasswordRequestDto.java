package dev.bengi.main.modules.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequestDto(
        String currentPassword,  // Required for self-update, optional for admin

        @NotBlank
        @Size(min = 8, max = 100)
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&].*$", 
                message = "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character")
        String newPassword,

        @NotBlank
        String confirmPassword
) {}
