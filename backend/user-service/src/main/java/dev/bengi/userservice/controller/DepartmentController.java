package dev.bengi.userservice.controller;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import dev.bengi.userservice.domain.model.Department;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.domain.payload.response.UserResponse;
import dev.bengi.userservice.repository.DepartmentRepository;
import dev.bengi.userservice.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;
    private final DepartmentRepository departmentRepository;

    @PostMapping
    public ResponseEntity<Department> createDepartment(@Valid @RequestBody Department department) {
        return ResponseEntity.ok(departmentService.createDepartment(department));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody Department department) {
        return ResponseEntity.ok(departmentService.updateDepartment(id, department));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartment(@PathVariable Long id) {
        return ResponseEntity.ok(departmentService.getDepartment(id));
    }

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Department>> getActiveDepartments() {
        return ResponseEntity.ok(departmentService.getActiveDepartments());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{departmentId}/users/{userId}")
    public ResponseEntity<Department> addUserToDepartment(
            @PathVariable Long departmentId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(departmentService.addUserToDepartment(departmentId, userId));
    }
    
    @DeleteMapping("/{departmentId}/users/{userId}")
    public ResponseEntity<Department> removeUserFromDepartment(
            @PathVariable Long departmentId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(departmentService.removeUserFromDepartment(departmentId, userId));
    }
    
    @GetMapping("/{departmentId}/users")
    public ResponseEntity<List<UserResponse>> getUsersByDepartmentId(@PathVariable Long departmentId) {
        List<User> departmentUsers = departmentRepository.findUsersByDepartmentId(departmentId);
        
        List<UserResponse> userResponses = departmentUsers.stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .fullname(user.getFullname())
                        .email(user.getEmail())
                        .avatar(user.getAvatar())
                        .gender(user.getGender())
                        .departmentId(departmentId)
                        .departmentName(user.getDepartment().getName())
                        .roles(user.getRoles().stream()
                                .map(role -> role.getName().name())
                                .collect(Collectors.toList()))
                        // Other fields can be mapped as needed
                        .build())
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(userResponses);
    }
    
    @GetMapping("/{departmentId}/users/count")
    public ResponseEntity<Long> countUsersByDepartmentId(@PathVariable Long departmentId) {
        Long userCount = departmentRepository.countUsersByDepartmentId(departmentId);
        return ResponseEntity.ok(userCount);
    }
} 