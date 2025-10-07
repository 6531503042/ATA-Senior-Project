package dev.bengi.main.modules.department.dto;

import dev.bengi.main.modules.department.model.Department;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface DepartmentMapper {

    // Create: DTO -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Department toEntity(DepartmentRequestDto req);

    // Update (partial)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(@MappingTarget Department target, DepartmentUpdateRequestDto req);

    // Entity -> Response
    @Mapping(target = "memberCount", constant = "0L")
    DepartmentResponseDto toResponse(Department entity);
}