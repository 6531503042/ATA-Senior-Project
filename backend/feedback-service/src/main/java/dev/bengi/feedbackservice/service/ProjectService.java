package dev.bengi.feedbackservice.service;

import dev.bengi.feedbackservice.domain.model.Project;
import dev.bengi.feedbackservice.domain.payload.request.CreateProjectRequest;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.List;

public interface ProjectService {
    @Transactional
    Project createProject(CreateProjectRequest createProjectRequest);

    Project updatedProject(Long id, Project project);

    void deleteProject(Long id);

//    Page<Project> getProjects(int page, int size);

    @Transactional(readOnly = true)
    List<Project> getProjects();

    @Transactional(readOnly = true)
    Project getProjectById(Long id);
}
