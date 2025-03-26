package dev.bengi.userservice.service.impl;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.bengi.userservice.domain.model.Department;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.repository.DepartmentRepository;
import dev.bengi.userservice.repository.UserRepository;
import dev.bengi.userservice.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Department createDepartment(Department department) {
        log.info("Creating new department: {}", department.getName());
        return departmentRepository.save(department);
    }

    @Override
    @Transactional
    public Department updateDepartment(Long id, Department department) {
        log.info("Updating department with id: {}", id);
        Department existingDepartment = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));

        existingDepartment.setName(department.getName());
        existingDepartment.setDescription(department.getDescription());
        existingDepartment.setActive(department.isActive());

        return departmentRepository.save(existingDepartment);
    }

    @Override
    @Transactional(readOnly = true)
    public Department getDepartment(Long id) {
        log.info("Fetching department with id: {}", id);
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
        // Initialize the users collection to prevent LazyInitializationException
        department.getUsers().size();
        return department;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Department> getAllDepartments() {
        log.info("Fetching all departments");
        List<Department> departments = departmentRepository.findAll();
        // Initialize the users collection for each department
        departments.forEach(department -> department.getUsers().size());
        return departments;
    }

    @Override
    @Transactional
    public void deleteDepartment(Long id) {
        log.info("Deleting department with id: {}", id);
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));

        // Remove department reference from all users
        Set<User> users = department.getUsers();
        users.forEach(user -> {
            user.setDepartment(null);
            userRepository.save(user);
        });

        departmentRepository.delete(department);
    }

    @Override
    @Transactional
    public Department addUserToDepartment(Long departmentId, Long userId) {
        log.info("Adding user {} to department {}", userId, departmentId);
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + departmentId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.setDepartment(department);
        userRepository.save(user);
        
        // Initialize the users collection to prevent LazyInitializationException
        department.getUsers().size();
        return department;
    }

    @Override
    @Transactional
    public Department removeUserFromDepartment(Long departmentId, Long userId) {
        log.info("Removing user {} from department {}", userId, departmentId);
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + departmentId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (user.getDepartment() != null && user.getDepartment().getId().equals(departmentId)) {
            user.setDepartment(null);
            userRepository.save(user);
        }
        
        // Initialize the users collection to prevent LazyInitializationException
        department.getUsers().size();
        return department;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Department> getActiveDepartments() {
        log.info("Fetching all active departments");
        List<Department> departments = departmentRepository.findByActive(true);
        // Initialize the users collection for each department
        departments.forEach(department -> department.getUsers().size());
        return departments;
    }
} 