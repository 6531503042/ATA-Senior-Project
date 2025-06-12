package dev.bengi.userservice.domain.payload.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamMemberRequest {
    @NotNull
    private Long userId;
    
    private String role;
    private boolean isManager;
} 