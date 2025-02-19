package dev.bengi.feedbackservice.domain.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponse {
    private Long id;
    private String title;
    private String description;
    private ProjectResponse project;
    private List<QuestionResponse> questions;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Set<UserDto> allowedUsers;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int totalSubmissions;
    private int pendingReviews;
    private double averageScore;
}
