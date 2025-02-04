package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.domain.model.Feedback;
import dev.bengi.feedbackservice.domain.model.Project;
import dev.bengi.feedbackservice.domain.payload.request.CreateFeedbackRequest;
import dev.bengi.feedbackservice.domain.payload.response.FeedbackResponse;
import dev.bengi.feedbackservice.repository.FeedbackRepository;
import dev.bengi.feedbackservice.repository.ProjectRepository;
import dev.bengi.feedbackservice.repository.QuestionRepository;
import dev.bengi.feedbackservice.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ProjectRepository projectRepository;
    private final QuestionRepository questionRepository;

    private FeedbackResponse mapToFeedbackResponse(Feedback feedback) {
        Project project = projectRepository.findById(feedback.getProjectId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        return FeedbackResponse.builder()
                .id(feedback.getId())
                .name(feedback.getTitle())
                .projectId(feedback.getProjectId())
                .questionIds(feedback.getQuestionIds())
                .description(feedback.getDescription())
                .feedbackStartDate(feedback.getFeedbackStartDate())
                .feedbackEndDate(feedback.getFeedbackEndDate())
                .memberIds(project.getMemberIds())
                .createdAt(feedback.getSubmittedAt())
                .updatedAt(feedback.getSubmittedAt())
                .build();
    }

    @Override
    @Transactional
    public FeedbackResponse createFeedback(CreateFeedbackRequest request) {
        log.info("Creating new feedback with name: {}", request.getName());

        // Verify project exists
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> {
                    log.error("Project not found with ID: {}", request.getProjectId());
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
                });

        Feedback feedback = Feedback.builder()
                .title(request.getName())
                .projectId(request.getProjectId())
                .description(request.getDescription())
                .feedbackStartDate(request.getFeedbackStartDate())
                .feedbackEndDate(request.getFeedbackEndDate())
                .build();

        try {
            Feedback savedFeedback = feedbackRepository.save(feedback);
            log.info("Feedback created successfully with ID: {}", savedFeedback.getId());
            return mapToFeedbackResponse(savedFeedback);
        } catch (Exception e) {
            log.error("Error creating feedback: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create feedback");
        }
    }

    @Override
    @Transactional
    public FeedbackResponse updateFeedback(Long id, CreateFeedbackRequest request) {
        log.info("Updating feedback with ID: {}", id);

        Feedback existingFeedback = feedbackRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Feedback not found with ID: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback not found");
                });

        // Verify project exists if project ID is being updated
        if (!existingFeedback.getProjectId().equals(request.getProjectId())) {
            projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> {
                        log.error("Project not found with ID: {}", request.getProjectId());
                        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
                    });
        }

        existingFeedback.setTitle(request.getName());
        existingFeedback.setProjectId(request.getProjectId());
        existingFeedback.setDescription(request.getDescription());
        existingFeedback.setFeedbackStartDate(request.getFeedbackStartDate());
        existingFeedback.setFeedbackEndDate(request.getFeedbackEndDate());

        try {
            Feedback updatedFeedback = feedbackRepository.save(existingFeedback);
            log.info("Feedback updated successfully with ID: {}", updatedFeedback.getId());
            return mapToFeedbackResponse(updatedFeedback);
        } catch (Exception e) {
            log.error("Error updating feedback: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update feedback");
        }
    }

    @Override
    @Transactional
    public void deleteFeedback(Long id) {
        log.info("Deleting feedback with ID: {}", id);

        if (!feedbackRepository.existsById(id)) {
            log.error("Feedback not found with ID: {}", id);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback not found");
        }

        try {
            feedbackRepository.deleteById(id);
            log.info("Feedback deleted successfully with ID: {}", id);
        } catch (Exception e) {
            log.error("Error deleting feedback: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete feedback");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public FeedbackResponse getFeedbackById(Long id) {
        log.info("Fetching feedback with ID: {}", id);

        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Feedback not found with ID: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback not found");
                });

        return mapToFeedbackResponse(feedback);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeedbackResponse> getAllFeedbacks() {
        log.info("Fetching all feedbacks");

        try {
            List<Feedback> feedbacks = feedbackRepository.findAll();
            List<FeedbackResponse> responses = feedbacks.stream()
                    .map(this::mapToFeedbackResponse)
                    .collect(Collectors.toList());
            log.info("Found {} feedbacks", responses.size());
            return responses;
        } catch (Exception e) {
            log.error("Error fetching feedbacks: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch feedbacks");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeedbackResponse> getFeedbacksByProjectId(Long projectId) {
        log.info("Fetching feedbacks for project ID: {}", projectId);

        // Verify project exists
        if (!projectRepository.existsById(projectId)) {
            log.error("Project not found with ID: {}", projectId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
        }

        try {
            Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by("submittedAt").descending());
            Page<Feedback> feedbacks = feedbackRepository.findByProjectId(projectId, pageable);
            List<FeedbackResponse> responses = feedbacks.getContent().stream()
                    .map(this::mapToFeedbackResponse)
                    .collect(Collectors.toList());
            log.info("Found {} feedbacks for project ID: {}", responses.size(), projectId);
            return responses;
        } catch (Exception e) {
            log.error("Error fetching feedbacks for project: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch feedbacks");
        }
    }

    @Override
    @Transactional
    public FeedbackResponse addQuestionsToFeedback(Long feedbackId, List<Long> questionIds) {
        log.info("Adding questions to feedback ID: {}", feedbackId);

        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> {
                    log.error("Feedback not found with ID: {}", feedbackId);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback not found");
                });

        // Verify all questions exist
        questionIds.forEach(questionId -> {
            if (!questionRepository.existsById(questionId)) {
                log.error("Question not found with ID: {}", questionId);
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found with ID: " + questionId);
            }
        });

        feedback.setQuestionIds(questionIds);

        try {
            Feedback updatedFeedback = feedbackRepository.save(feedback);
            log.info("Questions added successfully to feedback ID: {}", feedbackId);
            return mapToFeedbackResponse(updatedFeedback);
        } catch (Exception e) {
            log.error("Error adding questions to feedback: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to add questions to feedback");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeedbackResponse> getFeedbacksByUser(Long userId, int page, int size) {
        log.info("Fetching feedbacks for user ID: {} (page: {}, size: {})", userId, page, size);

        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("submittedAt").descending());
            Page<Feedback> feedbacks = feedbackRepository.findByUserId(userId, pageable);
            List<FeedbackResponse> responses = feedbacks.getContent().stream()
                    .map(this::mapToFeedbackResponse)
                    .collect(Collectors.toList());
            log.info("Found {} feedbacks for user ID: {}", responses.size(), userId);
            return responses;
        } catch (Exception e) {
            log.error("Error fetching feedbacks for user: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch feedbacks");
        }
    }
}
