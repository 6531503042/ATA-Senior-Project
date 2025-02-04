package dev.bengi.feedbackservice.foreign;

import dev.bengi.feedbackservice.dto.UserDto;
import dev.bengi.feedbackservice.domain.payload.response.TokenValidationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "user-service", url = "${user-service.url:http://localhost:8081}")
public interface UserClient {
    @GetMapping("/api/users/{userId}")
    UserDto getUserById(@PathVariable("userId") Long id);

    @GetMapping("/api/users/email/{email}")
    UserDto getUserByEmail(@PathVariable("email") String email);
    
    @GetMapping("/api/v1/users/exists/{userId}")
    ResponseEntity<Boolean> checkUserExists(@PathVariable Long userId);

    @GetMapping("/api/auth/validate")
    TokenValidationResponse validateToken(@RequestHeader("Authorization") String token);

    
}