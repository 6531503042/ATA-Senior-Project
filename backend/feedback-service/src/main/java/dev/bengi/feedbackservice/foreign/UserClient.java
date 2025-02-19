package dev.bengi.feedbackservice.foreign;

import dev.bengi.feedbackservice.domain.payload.response.UserDto;
import dev.bengi.feedbackservice.domain.payload.response.TokenValidationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "user-service", url = "${services.user-service.url}")
public interface UserClient {
    @GetMapping("/api/manager/user/{userId}")
    UserDto getUserById(@PathVariable("userId") Long id);

    @GetMapping("/api/manager/exists/{userId}")
    ResponseEntity<Boolean> checkUserExists(@PathVariable Long userId);

    @GetMapping("/api/manager/validate-username/{username}")
    ResponseEntity<Boolean> checkUsernameExists(@PathVariable String username);

    @GetMapping("/api/auth/validate")
    TokenValidationResponse validateToken(@RequestHeader("Authorization") String token);
}