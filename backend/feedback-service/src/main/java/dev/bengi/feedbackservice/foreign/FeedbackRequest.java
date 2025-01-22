package dev.bengi.feedbackservice.payload;

import dev.bengi.feedbackservice.dto.UserDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackRequest {
    @NotBlank(message = "Feedback content cannot be empty")
    @Size(min = 10, max = 1000, message = "Feedback content must be between 10 and 1000 characters")
    private String content;

    @NotBlank(message = "Project ID is required")
    private Long projectId;
    
    // Additional metadata for context
    private Map<String, String> metadata;
    
    // User context fields
    private UserContext userContext;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserContext {
        private Long userId;
        private String email;
        private String fullName;
        private String avatar;
        private LocalDateTime authenticatedAt;
        private String authenticationSource;
        private String ipAddress;
        private String deviceInfo;

        public static UserContext fromUserDto(UserDto userDto, String ipAddress, String deviceInfo) {
            return UserContext.builder()
                .userId(userDto.getId())
                .email(userDto.getEmail())
                .fullName(userDto.getFullName())
                .avatar(userDto.getAvatar())
                .authenticatedAt(LocalDateTime.now())
                .authenticationSource("JWT")
                .ipAddress(ipAddress)
                .deviceInfo(deviceInfo)
                .build();
        }
    }
}