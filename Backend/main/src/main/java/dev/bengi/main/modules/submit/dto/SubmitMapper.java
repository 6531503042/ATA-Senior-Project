package dev.bengi.main.modules.submit.dto;

import dev.bengi.main.modules.submit.model.Submit;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring",
        imports = {java.util.List.class})
public interface SubmitMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "anonymous", expression = "java(req.privacyLevel().name().equals(\"ANONYMOUS\"))")
    @Mapping(target = "reviewed", constant = "false")
    @Mapping(target = "submittedAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "adminRating", ignore = true)
    @Mapping(target = "adminSentiment", ignore = true)
    @Mapping(target = "analysisNotes", ignore = true)
    @Mapping(target = "analyzedAt", ignore = true)
    @Mapping(target = "analyzedBy", ignore = true)
    @Mapping(target = "feedbackTitle", ignore = true)
    @Mapping(target = "projectName", ignore = true)
    @Mapping(target = "projectId", ignore = true)
    @Mapping(target = "feedbackEndDate", ignore = true)
    Submit toEntity(SubmitRequestDto req);

    default SubmitResponseDto toResponse(Submit entity) {
        String submittedBy = entity.getPrivacyLevel() == null || entity.getPrivacyLevel().name().equals("ANONYMOUS")
                ? null : entity.getUserId();
        return new SubmitResponseDto(
                entity.getId(),
                entity.getFeedbackId(),
                submittedBy,
                entity.getResponses(),
                entity.getOverallComments(),
                entity.getPrivacyLevel(),
                entity.getSubmittedAt(),
                entity.getUpdatedAt(),
                entity.getAdminRating(),
                entity.getAdminSentiment(),
                entity.getAnalysisNotes(),
                entity.getAnalyzedAt(),
                entity.getAnalyzedBy(),
                entity.getFeedbackTitle(),
                entity.getProjectName(),
                entity.getProjectId(),
                entity.getFeedbackEndDate()
        );
    }
}


