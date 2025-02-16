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
    private String fullname;
    private String username;
    private String email;
    private String gender;
    private String avatar;
    private List<String> roles;
}
