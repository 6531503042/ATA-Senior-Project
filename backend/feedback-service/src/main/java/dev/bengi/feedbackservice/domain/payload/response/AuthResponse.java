package dev.bengi.feedbackservice.domain.payload.response;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AuthResponse {
    private Long id;
    private String username;
    private String email;
    
    @JsonAlias({"fullname", "fullName"})
    private String fullName;
    
    private String department;
    private String position;
    private boolean active;
    private List<String> roles;
} 