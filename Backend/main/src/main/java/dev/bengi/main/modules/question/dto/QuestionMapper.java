package dev.bengi.main.modules.question.dto;

import dev.bengi.main.modules.question.model.Question;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        imports = {java.util.List.class})
public interface QuestionMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categoryString", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "choices", ignore = true)
    Question toEntity(QuestionRequestDto req);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categoryString", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "choices", ignore = true)
    void updateEntity(@MappingTarget Question target, QuestionUpdateRequestDto req);

    // Avoid automatic bean mapping to DTO with lists; responses are assembled in the service
}


