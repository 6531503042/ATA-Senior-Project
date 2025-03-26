package dev.bengi.userservice.controller;

import dev.bengi.userservice.domain.model.Department;
import dev.bengi.userservice.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

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
} 