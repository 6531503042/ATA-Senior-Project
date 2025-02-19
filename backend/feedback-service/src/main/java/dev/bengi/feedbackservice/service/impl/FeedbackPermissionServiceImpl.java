package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.domain.model.Feedback;
import dev.bengi.feedbackservice.repository.FeedbackRepository;
import dev.bengi.feedbackservice.service.FeedbackPermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FeedbackPermissionServiceImpl implements FeedbackPermissionService {

    private final FeedbackRepository feedbackRepository;

    @Override
    public boolean hasPermissionToSubmitFeedback(String userId, Long feedbackId) {
        log.debug("Checking permission for user {} to submit feedback {}", userId, feedbackId);
        
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found with ID: " + feedbackId));
        
        // Check if feedback is active and within time window
        if (!feedback.isActive() || !isFeedbackActive(feedbackId)) {
            log.debug("Feedback {} is not active or outside time window", feedbackId);
            return false;
        }
        
        // Check if user is in project members
        Set<Long> projectMembers = feedback.getProject().getMemberIds();
        Long userIdLong = Long.parseLong(userId);
        boolean hasPermission = projectMembers != null && projectMembers.contains(userIdLong);
        
        log.debug("User {} {} permission to submit feedback {} (project members: {})", 
                 userId, hasPermission ? "has" : "does not have", feedbackId, projectMembers);
        return hasPermission;
    }

    @Override
    public List<Long> getPermittedFeedbackIds(String userId) {
        log.debug("Getting permitted feedback IDs for user {}", userId);
        
        Long userIdLong = Long.parseLong(userId);
        List<Long> permittedIds = feedbackRepository.findAll().stream()
                .filter(feedback -> {
                    Set<Long> projectMembers = feedback.getProject().getMemberIds();
                    boolean isMember = projectMembers != null && projectMembers.contains(userIdLong);
                    boolean active = isFeedbackActive(feedback.getId());
                    log.debug("Feedback {}: isMember={}, active={}", feedback.getId(), isMember, active);
                    return isMember && active;
                })
                .map(Feedback::getId)
                .collect(Collectors.toList());
        
        log.debug("Found {} permitted feedbacks for user {}: {}", permittedIds.size(), userId, permittedIds);
        return permittedIds;
    }

    @Override
    public boolean isFeedbackActive(Long feedbackId) {
        log.debug("Checking if feedback {} is active", feedbackId);
        
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found with ID: " + feedbackId));

        LocalDateTime now = LocalDateTime.now();
        boolean isActive = feedback.isActive() &&
                         now.isAfter(feedback.getStartDate()) &&
                         now.isBefore(feedback.getEndDate());
        
        log.debug("Feedback {} active status: isActive={}, currentTime={}, startDate={}, endDate={}", 
                 feedbackId, isActive, now, feedback.getStartDate(), feedback.getEndDate());
        return isActive;
    }

    @Override
    public boolean hasPermissionToViewFeedbackSubmissions(String userId, Long feedbackId) {
        log.debug("Checking permission for user {} to view submissions for feedback {}", userId, feedbackId);
        
        // Check if user has admin role
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        
        if (isAdmin) {
            log.debug("User {} has admin role, granting permission", userId);
            return true;
        }
        
        // Check if user is the feedback creator
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found with ID: " + feedbackId));
        
        boolean isCreator = feedback.getCreatedBy().equals(userId);
        log.debug("User {} {} the creator of feedback {}", 
                 userId, isCreator ? "is" : "is not", feedbackId);
        
        return isCreator;
    }
} 