package dev.bengi.main.modules.projects.dto;

import java.util.List;

public class ProjectUpdateForm {
    private String name;
    private String description;
    private String startDate;
    private String endDate;
    private boolean active = true;
    private List<String> members;
    private List<String> existingMembers;

    // Default constructor
    public ProjectUpdateForm() {}

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public List<String> getMembers() {
        return members;
    }

    public void setMembers(List<String> members) {
        this.members = members;
    }

    public List<String> getExistingMembers() {
        return existingMembers;
    }

    public void setExistingMembers(List<String> existingMembers) {
        this.existingMembers = existingMembers;
    }
}
