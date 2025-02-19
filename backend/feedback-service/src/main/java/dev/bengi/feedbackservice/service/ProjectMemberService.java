package dev.bengi.feedbackservice.service;

import java.util.Set;

public interface ProjectMemberService {
    /**
     * Synchronize project members with user service
     * @param projectId The project ID
     * @param memberIds The set of member IDs to sync
     * @return true if sync was successful
     */
    boolean syncProjectMembers(Long projectId, Set<Long> memberIds);

    /**
     * Get project members from user service
     * @param projectId The project ID
     * @return Set of member IDs
     */
    Set<Long> getProjectMembers(Long projectId);

    /**
     * Check if a user is a member of a project
     * @param userId The user ID
     * @param projectId The project ID
     * @return true if user is a member
     */
    boolean isProjectMember(Long userId, Long projectId);
} 