package dev.bengi.main.modules.role.controller;

import dev.bengi.main.modules.role.dto.RoleRequestCreate;
import dev.bengi.main.modules.role.dto.RoleRequestUpdate;
import dev.bengi.main.modules.role.dto.RoleResponse;
import dev.bengi.main.modules.role.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<RoleResponse>> create(@RequestBody @Valid RoleRequestCreate req) {
        return roleService.create(req)
                .map(d -> ResponseEntity.status(HttpStatus.CREATED).body(d));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Flux<RoleResponse> list() {
        return roleService.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<RoleResponse>> get(@PathVariable Long id) {
        return roleService.getById(id).map(ResponseEntity::ok);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<RoleResponse>> update(@PathVariable Long id, @RequestBody @Valid RoleRequestUpdate req) {
        return roleService.update(id, req).map(ResponseEntity::ok);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> delete(@PathVariable Long id) {
        return roleService.delete(id).thenReturn(ResponseEntity.noContent().build());
    }
}


