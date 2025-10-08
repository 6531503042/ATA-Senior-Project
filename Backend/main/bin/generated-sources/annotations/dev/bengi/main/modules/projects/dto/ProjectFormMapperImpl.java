package dev.bengi.main.modules.projects.dto;

import java.time.LocalDateTime;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-08T05:35:23+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class ProjectFormMapperImpl implements ProjectFormMapper {

    @Override
    public ProjectRequestDto toRequest(ProjectCreateForm form) {
        if ( form == null ) {
            return null;
        }

        String name = null;
        String description = null;
        boolean active = false;

        name = form.getName();
        description = form.getDescription();
        active = form.isActive();

        LocalDateTime startDate = parseDate(form.getStartDate());
        LocalDateTime endDate = parseDate(form.getEndDate());
        List<Long> members = parseMembers(form.getMembers());

        ProjectRequestDto projectRequestDto = new ProjectRequestDto( name, description, startDate, endDate, active, members );

        return projectRequestDto;
    }

    @Override
    public ProjectUpdateRequestDto toUpdateRequest(ProjectUpdateForm form) {
        if ( form == null ) {
            return null;
        }

        String name = null;
        String description = null;
        boolean active = false;

        name = form.getName();
        description = form.getDescription();
        active = form.isActive();

        LocalDateTime startDate = parseDate(form.getStartDate());
        LocalDateTime endDate = parseDate(form.getEndDate());
        List<Long> members = parseMembers(form.getMembers());
        List<Long> existingMembers = parseMembers(form.getExistingMembers());

        ProjectUpdateRequestDto projectUpdateRequestDto = new ProjectUpdateRequestDto( name, description, startDate, endDate, active, members, existingMembers );

        return projectUpdateRequestDto;
    }
}
