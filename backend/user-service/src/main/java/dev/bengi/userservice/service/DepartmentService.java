package dev.bengi.userservice.service;

import java.util.List;

import dev.bengi.userservice.domain.model.Department;

public interface DepartmentService {
    Department createDepartment(Department department);
    Department updateDepartment(Long id, Department department);
    Department getDepartment(Long id);
    List<Department> getAllDepartments();
    void deleteDepartment(Long id);
    Department addUserToDepartment(Long departmentId, Long userId);
    Department removeUserFromDepartment(Long departmentId, Long userId);
    List<Department> getActiveDepartments();
} 