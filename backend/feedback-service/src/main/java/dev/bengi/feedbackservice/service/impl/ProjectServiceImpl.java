package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.domain.model.Project;
import dev.bengi.feedbackservice.domain.payload.request.CreateProjectRequest;
import dev.bengi.feedbackservice.exception.ProjectAlreadyExistsException;
import dev.bengi.feedbackservice.repository.ProjectRepository;
import dev.bengi.feedbackservice.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;


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
            .memberIds(createProjectRequest.getMemberIds())
            .projectStartDate(createProjectRequest.getProjectStartDate())
            .projectEndDate(createProjectRequest.getProjectEndDate())
            .createdAt(ZonedDateTime.now())
            .updatedAt(null)
            .build();

        // Save Project
        try {
            log.info("Attempting to save project: {}", project);
            Project savedProject = projectRepository.save(project);
            log.info("Project saved successfully with ID: {}", savedProject.getId());
            return savedProject;
        } catch (DataAccessException e) {
            log.error("DataAccessException while saving project: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create project", e);
        } catch (Exception e) {
            log.error("Unexpected error while saving project: {}", e.getMessage(), e);
            throw new RuntimeException("Unexpected error creating project", e);
        }

    }

    @Override
    @Transactional
    public Project updatedProject(Long id, Project project) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        existingProject.setName(project.getName());
        existingProject.setDescription(project.getDescription());
        existingProject.setProjectStartDate(project.getProjectStartDate());
        existingProject.setProjectEndDate(project.getProjectEndDate());
        existingProject.setMemberIds(project.getMemberIds());
        existingProject.setUpdatedAt(ZonedDateTime.now());
        return projectRepository.save(existingProject);
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

//    @Override
//    @Transactional(readOnly = true)
//    public Page<Project> getProjects(int page, int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        return projectRepository.findAll(pageable);
//    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> getProjects() {
        return projectRepository.findAll(); // Remove pagination
    }


    @Override
    @Transactional(readOnly = true)
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }
}
