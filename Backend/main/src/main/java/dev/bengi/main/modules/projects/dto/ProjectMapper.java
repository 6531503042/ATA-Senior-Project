package dev.bengi.main.modules.projects.dto;

import dev.bengi.main.modules.projects.model.Project;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProjectMapper {

    @Mapping(target = "id", ignore = true)
    Project toEntity(ProjectRequestDto req);

    void updateEntity(@MappingTarget Project target, ProjectUpdateRequestDto req);

    ProjectResponseDto toResponse(Project entity);
}


