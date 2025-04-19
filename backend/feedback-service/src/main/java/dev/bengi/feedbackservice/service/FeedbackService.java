package dev.bengi.feedbackservice.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import dev.bengi.feedbackservice.domain.model.Feedback;
import dev.bengi.feedbackservice.domain.payload.response.FeedbackDetailsResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface FeedbackService {
    Mono<Feedback> createFeedback(Feedback feedback);
    Mono<Feedback> updateFeedback(Long id, Feedback feedback);
    Mono<Void> deleteFeedback(Long id);
    Mono<Feedback> getFeedbackById(Long id);
    Flux<Feedback> getAllFeedbacks();
    Flux<Feedback> getFeedbacksByDepartment(String departmentId);
    Flux<Feedback> getDepartmentWideFeedbacks(String departmentId);
    Flux<Feedback> getFeedbacksByUser(String userId);
    Mono<Feedback> activateFeedback(Long id);
    Mono<Feedback> closeFeedback(Long id);
    Mono<Feedback> addTargetUser(Long feedbackId, String userId);
    Mono<Feedback> removeTargetUser(Long feedbackId, String userId);
    Mono<Feedback> addTargetDepartment(Long feedbackId, String departmentId);
    Mono<Feedback> removeTargetDepartment(Long feedbackId, String departmentId);
    Flux<Feedback> getFeedbacksByProject(Long projectId);
    Flux<FeedbackDetailsResponse> getAvailableFeedbacksForUser(String userId);
    Mono<FeedbackDetailsResponse> getFeedbackDetails(Long feedbackId);
    Mono<Map<String, Long>> getFeedbackStatistics();
    Mono<Map<String, Double>> getFeedbackMetrics();
    Flux<Feedback> getRecentFeedbacks();
}
