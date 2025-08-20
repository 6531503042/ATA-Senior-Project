package dev.bengi.main.modules.submit.dto;

import dev.bengi.main.modules.submit.model.Submit;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SubmitMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "anonymous", expression = "java(req.privacyLevel().name().equals(\"ANONYMOUS\"))")
    @Mapping(target = "reviewed", constant = "false")
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
                entity.getUpdatedAt()
        );
    }
}


