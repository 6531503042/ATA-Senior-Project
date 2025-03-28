package dev.bengi.userservice.domain.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private Long id;
    private String username;
    private String fullname;
    private String email;
    private String avatar;
    private String gender;
    private List<String> roles;
}
