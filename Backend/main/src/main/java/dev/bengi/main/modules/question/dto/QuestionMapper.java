package dev.bengi.main.modules.question.dto;

import dev.bengi.main.modules.question.model.Question;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface QuestionMapper {
    @Mapping(target = "id", ignore = true)
    Question toEntity(QuestionRequestDto req);

    void updateEntity(@MappingTarget Question target, QuestionUpdateRequestDto req);

    QuestionResponseDto toResponse(Question entity);
}


