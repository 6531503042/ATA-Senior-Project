package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.domain.model.Project;
import dev.bengi.feedbackservice.domain.payload.request.CreateProjectRequest;
import dev.bengi.feedbackservice.domain.payload.response.ProjectResponse;
import dev.bengi.feedbackservice.exception.ProjectAlreadyExistsException;
import dev.bengi.feedbackservice.repository.ProjectRepository;
import dev.bengi.feedbackservice.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZonedDateTime;

@RequiredArgsConstructor
@Service
@Slf4j
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

//    @Transactional
//    @Override
//    public Mono<Project> createProject(CreateProjectRequest createProjectRequest) {
//        return Mono.fromCallable(() -> projectRepository.existsByNameIgnoreCase(createProjectRequest.getName()))
//                .subscribeOn(Schedulers.boundedElastic())
//                .flatMap(exists -> {
//                    if (exists) {
//                        return Mono.error(new RuntimeException(
//                                "Project with name " + createProjectRequest.getName() + " already exists"));
//                    }
//                    Project project = Project.builder()
//                            .name(createProjectRequest.getName())
//                            .description(createProjectRequest.getDescription())
//                            .feedbackStartDate(createProjectRequest.getFeedbackStartDate())
//                            .feedbackEndDate(createProjectRequest.getFeedbackEndDate())
//                            .totalEmployees(createProjectRequest.getTotalEmployees())
//                            .createdAt(Instant.now())
//                            .updatedAt(Instant.now())
//                            .build();
//                    return Mono.fromCallable(() -> projectRepository.save(project))
//                            .subscribeOn(Schedulers.boundedElastic());
//                });
//    }

    @Transactional
    @Override
    public Project createProject(CreateProjectRequest createProjectRequest) {

        // Check condition
        if (projectRepository.existsByNameIgnoreCase(createProjectRequest.getName())) {
            throw new ProjectAlreadyExistsException("Project with name " + createProjectRequest.getName() + " already exists");
        }

        // Create a new Project Instance
        Project project = Project.builder()
                .name(createProjectRequest.getName())
                .description(createProjectRequest.getDescription())
                .feedbackStartDate(ZonedDateTime.from(createProjectRequest.getFeedbackStartDate()))
                .feedbackEndDate(ZonedDateTime.from(createProjectRequest.getFeedbackEndDate()))
                .totalEmployees(createProjectRequest.getTotalEmployees())
                .createdAt(ZonedDateTime.now())
                .updatedAt(null)
                .build();

        // Save Project
        try {
            return projectRepository.save(project);
        } catch (DataAccessException e) {
            throw new RuntimeException("Failed to create project", e);
        }

    }

    private ProjectResponse mapToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .feedbackStartDate(project.getFeedbackStartDate())
                .feedbackEndDate(project.getFeedbackEndDate())
                .totalEmployees(project.getTotalEmployees())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional
    public Project updatedProject(Long id, Project project) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        existingProject.setName(project.getName());
        existingProject.setDescription(project.getDescription());
        existingProject.setFeedbackStartDate(project.getFeedbackStartDate());
        existingProject.setFeedbackEndDate(project.getFeedbackEndDate());
        existingProject.setTotalEmployees(project.getTotalEmployees());
        existingProject.setUpdatedAt(ZonedDateTime.now());
        return projectRepository.save(existingProject);
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Project> getProjects(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return projectRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }
}
