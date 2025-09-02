package dev.bengi.main.modules.projects.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProjectFormMapper {

    @Mapping(target = "startDate", expression = "java(parseDate(form.getStartDate()))")
    @Mapping(target = "endDate", expression = "java(parseDate(form.getEndDate()))")
    @Mapping(target = "members", expression = "java(parseMembers(form.getMembers()))")
    ProjectRequestDto toRequest(ProjectCreateForm form);

    @Mapping(target = "startDate", expression = "java(parseDate(form.getStartDate()))")
    @Mapping(target = "endDate", expression = "java(parseDate(form.getEndDate()))")
    @Mapping(target = "members", expression = "java(parseMembers(form.getMembers()))")
    @Mapping(target = "existingMembers", expression = "java(parseMembers(form.getExistingMembers()))")
    ProjectUpdateRequestDto toUpdateRequest(ProjectUpdateForm form);

    default LocalDateTime parseDate(String date) {
        return (date != null && !date.isEmpty()) ? LocalDateTime.parse(date + "T00:00:00") : null;
        }

    default List<Long> parseMembers(List<String> members) {
        return members != null ? members.stream().map(Long::parseLong).toList() : List.of();
        }
}
