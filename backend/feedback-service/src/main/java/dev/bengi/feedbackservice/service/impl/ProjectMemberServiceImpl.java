package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.client.UserClient;
import dev.bengi.feedbackservice.domain.payload.response.AuthResponse;
import dev.bengi.feedbackservice.service.ProjectMemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectMemberServiceImpl implements ProjectMemberService {

    private final UserClient userClient;

    @Override
    public boolean syncProjectMembers(Long projectId, Set<Long> memberIds) {
        try {
            String token = getCurrentToken();
            if (token == null) {
                log.error("No authorization token found in request");
                return false;
            }
            
            // Add new members
            boolean allSuccess = memberIds.stream().allMatch(userId -> {
                try {
                    return userClient.addProjectAuthority(userId, projectId, token);
                } catch (Exception e) {
                    log.error("Failed to add authority for user {}: {}", userId, e.getMessage());
                    return false;
                }
            });
            
            if (allSuccess) {
                log.info("Successfully synced {} members for project {}", memberIds.size(), projectId);
                return true;
            } else {
                log.error("Failed to sync some members for project {}", projectId);
                return false;
            }
        } catch (Exception e) {
            log.error("Error syncing project members: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public Set<Long> getProjectMembers(Long projectId) {
        try {
            String token = getCurrentToken();
            if (token == null) {
                log.error("No authorization token found in request");
                return new HashSet<>();
            }
            
            return userClient.getUsersByProjectId(projectId, token)
                    .stream()
                    .map(AuthResponse::getId)
                    .collect(Collectors.toSet());
        } catch (Exception e) {
            log.error("Error getting project members: {}", e.getMessage(), e);
            return new HashSet<>();
        }
    }

    @Override
    public boolean isProjectMember(Long userId, Long projectId) {
        try {
            String token = getCurrentToken();
            if (token == null) {
                log.error("No authorization token found in request");
                return false;
            }
            
            return userClient.checkUserExists(userId, token) &&
                   userClient.hasProjectAuthority(userId, projectId, token);
        } catch (Exception e) {
            log.error("Error checking project membership: {}", e.getMessage());
            return false;
        }
    }

    private String getCurrentToken() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                String authHeader = attributes.getRequest().getHeader("Authorization");
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    return authHeader;
                }
            }
            log.warn("No Authorization header found in request");
            return null;
        } catch (Exception e) {
            log.error("Error getting authorization token: {}", e.getMessage());
            return null;
        }
    }
} 