package dev.bengi.main.modules.department.dto;

import dev.bengi.main.modules.department.model.Department;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface DepartmentMapper {

    // Create: DTO -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "true")
    Department toEntity(DepartmentRequestDto req);

    // Update (partial)
    void updateEntity(@MappingTarget Department target, DepartmentUpdateRequestDto req);

    // Entity -> Response
    DepartmentResponseDto toResponse(Department entity);
}