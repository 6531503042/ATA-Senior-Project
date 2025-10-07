package dev.bengi.main.modules.feedback.dto;

import dev.bengi.main.modules.feedback.model.Feedback;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        imports = {java.util.List.class})
public interface FeedbackMapper {

    // Create: DTO -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "active", expression = "java(req.active() != null ? req.active() : true)")
    Feedback toEntity(FeedbackCreateRequestDto req);

    // Update (partial): DTO -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(@MappingTarget Feedback target, FeedbackUpdateRequestDto req);

    // Basic Entity -> Response (without relationships)
    @Mapping(target = "projectName", ignore = true)
    @Mapping(target = "questionIds", ignore = true)
    @Mapping(target = "questionTitles", ignore = true)
    @Mapping(target = "targetUserIds", ignore = true)
    @Mapping(target = "targetUsernames", ignore = true)
    @Mapping(target = "targetDepartmentIds", ignore = true)
    @Mapping(target = "targetDepartmentNames", ignore = true)
    @Mapping(target = "submissionCount", ignore = true)
    @Mapping(target = "canSubmit", ignore = true)
    FeedbackResponseDto toBasicResponse(Feedback entity);
}
