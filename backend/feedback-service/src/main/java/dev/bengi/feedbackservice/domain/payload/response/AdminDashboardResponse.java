package dev.bengi.feedbackservice.domain.payload.response;

import dev.bengi.feedbackservice.domain.enums.AnswerType;
import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private SentimentAnalysis sentimentAnalysis;
    private FeedbackOverview feedbackOverview;
    private List<QuestionSetPerformance> questionSetPerformances;
    private List<RecentActivity> recentActivities;

    @Data
    @Builder
    public static class SentimentAnalysis {
        private Map<String, Long> sentimentDistribution;
        private Map<Long, Double> projectSentimentScores;
        private Double overallSentimentScore;
    }

    @Data
    @Builder
    public static class FeedbackOverview {
        private Long totalFeedbacks;
        private Long feedbacksThisMonth;
        private Map<QuestionCategory, Long> categoryDistribution;
        private Map<Long, Long> projectFeedbackCount;
    }

    @Data
    @Builder
    public static class QuestionSetPerformance {
        private Long questionSetId;
        private String questionSetName;
        private Map<AnswerType, Long> answerTypeDistribution;
        private Double averageScore;
    }

    @Data
    @Builder
    public static class RecentActivity {
        private Long feedbackId;
        private Long userId;
        private String userName;
        private String projectName;
        private ZonedDateTime timestamp;
        private String activityType;
    }
}