package dev.bengi.main.modules.department.dto;

import dev.bengi.main.modules.department.model.Department;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-08T05:30:41+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class DepartmentMapperImpl implements DepartmentMapper {

    @Override
    public Department toEntity(DepartmentRequestDto req) {
        if ( req == null ) {
            return null;
        }

        Department department = new Department();

        department.setDescription( req.description() );
        department.setName( req.name() );

        department.setActive( true );

        return department;
    }

    @Override
    public void updateEntity(Department target, DepartmentUpdateRequestDto req) {
        if ( req == null ) {
            return;
        }

        target.setActive( req.active() );
        if ( req.description() != null ) {
            target.setDescription( req.description() );
        }
        if ( req.name() != null ) {
            target.setName( req.name() );
        }
    }

    @Override
    public DepartmentResponseDto toResponse(Department entity) {
        if ( entity == null ) {
            return null;
        }

        Long id = null;
        String name = null;
        String description = null;
        boolean active = false;
        LocalDateTime createdAt = null;
        LocalDateTime updatedAt = null;

        id = entity.getId();
        name = entity.getName();
        description = entity.getDescription();
        active = entity.isActive();
        createdAt = entity.getCreatedAt();
        updatedAt = entity.getUpdatedAt();

        Long memberCount = (long) 0L;

        DepartmentResponseDto departmentResponseDto = new DepartmentResponseDto( id, name, description, active, createdAt, updatedAt, memberCount );

        return departmentResponseDto;
    }
}
