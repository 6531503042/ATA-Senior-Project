package dev.bengi.main.modules.projects.dto;

import dev.bengi.main.modules.projects.model.Project;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-08T05:30:41+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class ProjectMapperImpl implements ProjectMapper {

    @Override
    public Project toEntity(ProjectRequestDto req) {
        if ( req == null ) {
            return null;
        }

        Project project = new Project();

        project.setActive( req.active() );
        project.setDescription( req.description() );
        project.setEndDate( req.endDate() );
        project.setName( req.name() );
        project.setStartDate( req.startDate() );

        return project;
    }

    @Override
    public void updateEntity(Project target, ProjectUpdateRequestDto req) {
        if ( req == null ) {
            return;
        }

        target.setActive( req.active() );
        if ( req.description() != null ) {
            target.setDescription( req.description() );
        }
        if ( req.endDate() != null ) {
            target.setEndDate( req.endDate() );
        }
        if ( req.name() != null ) {
            target.setName( req.name() );
        }
        if ( req.startDate() != null ) {
            target.setStartDate( req.startDate() );
        }
    }

    @Override
    public ProjectResponseDto toResponse(Project entity) {
        if ( entity == null ) {
            return null;
        }

        Long id = null;
        String name = null;
        String description = null;
        LocalDateTime startDate = null;
        LocalDateTime endDate = null;
        boolean active = false;
        LocalDateTime createdAt = null;
        LocalDateTime updatedAt = null;

        id = entity.getId();
        name = entity.getName();
        description = entity.getDescription();
        startDate = entity.getStartDate();
        endDate = entity.getEndDate();
        active = entity.isActive();
        createdAt = entity.getCreatedAt();
        updatedAt = entity.getUpdatedAt();

        Long memberCount = (long) 0L;

        ProjectResponseDto projectResponseDto = new ProjectResponseDto( id, name, description, startDate, endDate, active, createdAt, updatedAt, memberCount );

        return projectResponseDto;
    }
}
