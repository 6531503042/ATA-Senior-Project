package dev.bengi.main.modules.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.Set;

public record UserCreateRequestDto(
        @NotBlank
        @Size(min = 3, max = 50)
        @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers, and underscores")
        String username,

        @NotBlank
        @Email
        String email,

        @NotBlank
        @Size(min = 6, max = 100)
        @Pattern(regexp = "^[A-Za-z\\d@$!%*?&]+$", 
                message = "Password can contain letters, numbers, and special characters")
        String password,

        @Size(max = 100)
        String firstName,

        @Size(max = 100)
        String lastName,

        @Pattern(regexp = "^[\\+]?[0-9]{10,15}$", message = "Invalid phone number format")
        String phone,

        Long departmentId,

        Set<String> roles,

        boolean active
) {}
