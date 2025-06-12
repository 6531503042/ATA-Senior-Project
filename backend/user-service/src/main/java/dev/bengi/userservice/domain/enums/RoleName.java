package dev.bengi.userservice.domain.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RoleName {
    ROLE_USER, ROLE_ADMIN, ROLE_MANAGER;

    public String getRole() {
        return this.name();
    }
}
