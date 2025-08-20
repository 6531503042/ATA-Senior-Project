package dev.bengi.main.modules.role.dto;

import dev.bengi.main.modules.role.model.Role;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    // Create: DTO -> Entity
    @Mapping(target = "id", ignore = true)
    Role toEntity(RoleRequestCreate req);

    // Update (partial)
    void updateEntity(@MappingTarget Role target, RoleRequestUpdate req);

    // Entity -> Response
    RoleResponse toResponse(Role entity);
}
