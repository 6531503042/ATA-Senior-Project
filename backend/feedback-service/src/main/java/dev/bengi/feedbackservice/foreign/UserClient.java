package dev.bengi.feedbackservice.foreign;

import dev.bengi.feedbackservice.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "user-service", url = "${user-service.url:http://localhost:8088}")
public interface UserClient {
    @GetMapping("/api/users/{userId}")
    UserDto getUserById(@PathVariable("userId") Long userId);

    @GetMapping("/api/users/email/{email}")
    UserDto getUserByEmail(@PathVariable("email") String email);

    @PostMapping("/api/auth/validate")
    UserDto validateToken(@RequestHeader("Authorization") String token);
}