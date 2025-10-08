package dev.bengi.main.modules.role.dto;

import dev.bengi.main.modules.role.model.Role;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-08T05:30:41+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class RoleMapperImpl implements RoleMapper {

    @Override
    public Role toEntity(RoleRequestCreate req) {
        if ( req == null ) {
            return null;
        }

        Role role = new Role();

        role.setDescription( req.description() );
        role.setName( req.name() );

        return role;
    }

    @Override
    public void updateEntity(Role target, RoleRequestUpdate req) {
        if ( req == null ) {
            return;
        }

        target.setDescription( req.description() );
    }

    @Override
    public RoleResponse toResponse(Role role) {
        if ( role == null ) {
            return null;
        }

        Long id = null;
        String description = null;
        LocalDateTime createdAt = null;
        LocalDateTime updatedAt = null;

        id = role.getId();
        description = role.getDescription();
        createdAt = role.getCreatedAt();
        updatedAt = role.getUpdatedAt();

        String name = role.getName() != null ? role.getName().name() : null;

        RoleResponse roleResponse = new RoleResponse( id, name, description, createdAt, updatedAt );

        return roleResponse;
    }
}
