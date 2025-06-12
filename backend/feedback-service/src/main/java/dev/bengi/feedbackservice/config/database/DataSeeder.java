package dev.bengi.feedbackservice.config.database;

import java.time.LocalDateTime;
import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.r2dbc.connection.init.ConnectionFactoryInitializer;
import org.springframework.r2dbc.connection.init.ResourceDatabasePopulator;

import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.enums.QuestionType;
import dev.bengi.feedbackservice.repository.ProjectRepository;
import dev.bengi.feedbackservice.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final Environment env;
    private final ProjectRepository projectRepository;
    private final QuestionRepository questionRepository;

    /**
     * Initialize default questions after application context is ready
     */
    @EventListener(ContextRefreshedEvent.class)
    public void initializeDefaultQuestions() {
        log.info("Initializing default questions...");
        
        // Add some default questions if none exist
        questionRepository.count()
            .flatMap(count -> {
                if (count == 0) {
                    log.info("No questions found. Creating default questions...");
                    return createDefaultQuestions();
                } else {
                    log.info("Found {} existing questions. Skipping initialization.", count);
                    return Mono.empty();
                }
            })
            .subscribe(
                result -> log.info("Default questions initialization completed successfully"),
                error -> log.error("Error initializing default questions: {}", error.getMessage())
            );
    }
    
    private Mono<Void> createDefaultQuestions() {
        // Create some common feedback questions
        return Mono.zip(
            // Project satisfaction questions
            createQuestion("How would you rate the overall project?", 
                      "Please rate your overall satisfaction with the project", 
                      QuestionType.RATING, 
                      QuestionCategory.PROJECT_SATISFACTION),
                      
            createQuestion("What aspects of the project were most successful?", 
                      "Describe what worked well during the project", 
                      QuestionType.TEXT_BASED, 
                      QuestionCategory.PROJECT_SATISFACTION),
                      
            // Team collaboration questions
            createQuestion("How effectively did the team collaborate?", 
                      "Rate the team's collaboration effectiveness", 
                      QuestionType.RATING, 
                      QuestionCategory.TEAM_COLLABORATION),
                      
            // Communication questions
            createQuestion("How would you rate the communication during the project?", 
                      "Evaluate the clarity and frequency of communication", 
                      QuestionType.RATING, 
                      QuestionCategory.COMMUNICATION)
        ).then();
    }
    
    private Mono<Object> createQuestion(String text, String description, QuestionType type, QuestionCategory category) {
        return questionRepository.save(dev.bengi.feedbackservice.domain.model.Question.builder()
                .text(text)
                .description(description)
                .questionType(type)
                .category(category)
                .required(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build()
            )
            .doOnSuccess(question -> log.info("Created question: {}", question.getText()))
            .doOnError(error -> log.error("Error creating question: {}", error.getMessage()))
            .cast(Object.class);
    }
} 