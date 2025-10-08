package dev.bengi.main.modules.feedback.dto;

import dev.bengi.main.modules.feedback.model.Feedback;
import java.time.LocalDateTime;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-08T05:40:03+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class FeedbackMapperImpl implements FeedbackMapper {

    @Override
    public Feedback toEntity(FeedbackCreateRequestDto req) {
        if ( req == null ) {
            return null;
        }

        Feedback feedback = new Feedback();

        feedback.setDescription( req.description() );
        feedback.setEndDate( req.endDate() );
        feedback.setProjectId( req.projectId() );
        feedback.setStartDate( req.startDate() );
        feedback.setTitle( req.title() );

        feedback.setActive( req.active() != null ? req.active() : true );

        return feedback;
    }

    @Override
    public void updateEntity(Feedback target, FeedbackUpdateRequestDto req) {
        if ( req == null ) {
            return;
        }

        if ( req.active() != null ) {
            target.setActive( req.active() );
        }
        if ( req.description() != null ) {
            target.setDescription( req.description() );
        }
        if ( req.endDate() != null ) {
            target.setEndDate( req.endDate() );
        }
        if ( req.projectId() != null ) {
            target.setProjectId( req.projectId() );
        }
        if ( req.startDate() != null ) {
            target.setStartDate( req.startDate() );
        }
        if ( req.title() != null ) {
            target.setTitle( req.title() );
        }
    }

    @Override
    public FeedbackResponseDto toBasicResponse(Feedback entity) {
        if ( entity == null ) {
            return null;
        }

        Long id = null;
        String title = null;
        String description = null;
        Long projectId = null;
        LocalDateTime startDate = null;
        LocalDateTime endDate = null;
        boolean active = false;
        LocalDateTime createdAt = null;
        LocalDateTime updatedAt = null;

        id = entity.getId();
        title = entity.getTitle();
        description = entity.getDescription();
        projectId = entity.getProjectId();
        startDate = entity.getStartDate();
        endDate = entity.getEndDate();
        active = entity.isActive();
        createdAt = entity.getCreatedAt();
        updatedAt = entity.getUpdatedAt();

        String projectName = null;
        List<Long> questionIds = null;
        List<String> questionTitles = null;
        List<Long> targetUserIds = null;
        List<String> targetUsernames = null;
        List<Long> targetDepartmentIds = null;
        List<String> targetDepartmentNames = null;
        Long submissionCount = null;
        boolean canSubmit = false;

        FeedbackResponseDto feedbackResponseDto = new FeedbackResponseDto( id, title, description, projectId, projectName, startDate, endDate, active, createdAt, updatedAt, questionIds, questionTitles, targetUserIds, targetUsernames, targetDepartmentIds, targetDepartmentNames, submissionCount, canSubmit );

        return feedbackResponseDto;
    }
}
