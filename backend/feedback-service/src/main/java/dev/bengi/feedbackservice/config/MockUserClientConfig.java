package dev.bengi.feedbackservice.config;

import dev.bengi.feedbackservice.client.UserClient;
import dev.bengi.feedbackservice.domain.payload.response.AuthResponse;
import dev.bengi.feedbackservice.domain.payload.response.TokenValidationResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class MockUserClientConfig {

    @Bean
    @Primary
    public UserClient mockUserClient() {
        return new UserClient() {
            private final Map<Long, AuthResponse> users = new ConcurrentHashMap<>();
            private final Map<Long, List<Long>> projectMembers = new ConcurrentHashMap<>();

            @Override
            public AuthResponse getUserById(Long id, String token) {
                return users.computeIfAbsent(id, userId -> 
                    AuthResponse.builder()
                        .id(userId)
                        .username("user" + userId)
                        .email("user" + userId + "@example.com")
                        .roles(List.of("USER"))
                        .build());
            }

            @Override
            public boolean checkUserExists(Long userId, String token) {
                return true;
            }

            @Override
            public boolean checkUsernameExists(String username, String token) {
                return true;
            }

            @Override
            public TokenValidationResponse validateToken(String token) {
                return TokenValidationResponse.builder()
                    .valid(true)
                    .userId(1L)
                    .roles(List.of("USER"))
                    .build();
            }

            @Override
            public boolean addProjectAuthority(Long userId, Long projectId, String token) {
                projectMembers.computeIfAbsent(projectId, k -> new ArrayList<>()).add(userId);
                return true;
            }

            @Override
            public boolean removeProjectAuthority(Long userId, Long projectId, String token) {
                if (projectMembers.containsKey(projectId)) {
                    projectMembers.get(projectId).remove(userId);
                    return true;
                }
                return false;
            }

            @Override
            public boolean hasProjectAuthority(Long userId, Long projectId, String token) {
                return projectMembers.getOrDefault(projectId, List.of()).contains(userId);
            }

            @Override
            public List<AuthResponse> getUsersByProjectId(Long projectId, String token) {
                List<Long> memberIds = projectMembers.getOrDefault(projectId, List.of());
                List<AuthResponse> members = new ArrayList<>();
                for (Long memberId : memberIds) {
                    members.add(getUserById(memberId, token));
                }
                return members;
            }
        };
    }
} 