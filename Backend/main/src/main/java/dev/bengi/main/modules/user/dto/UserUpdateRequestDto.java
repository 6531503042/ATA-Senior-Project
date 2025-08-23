package dev.bengi.main.modules.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserUpdateRequestDto(
        @Email
        String email,

        @Size(max = 100)
        String firstName,

        @Size(max = 100)
        String lastName,

        @Pattern(regexp = "^[\\+]?[0-9]{10,15}$", message = "Invalid phone number format")
        String phone,

        Long departmentId,

        Boolean active  // Only admins can change this
) {}
