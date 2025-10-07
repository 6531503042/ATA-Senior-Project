package dev.bengi.main.modules.role.dto;

import dev.bengi.main.modules.role.model.Role;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    // Create: DTO -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Role toEntity(RoleRequestCreate req);

    // Update (partial)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(@MappingTarget Role target, RoleRequestUpdate req);

    // Entity -> Response
    @Mapping(target = "name", expression = "java(role.getName() != null ? role.getName().name() : null)")
    RoleResponse toResponse(Role role);
}
