package dev.bengi.userservice.domain.payload.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserWithDepartmentDTO {
    // User information
    private Long id;
    private String username;
    private String email;
    private String fullname;
    private String position;
    private boolean active;
    private List<String> roles;

    // Department information
    private Long departmentId;
    private String departmentName;
    private String departmentDescription;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 