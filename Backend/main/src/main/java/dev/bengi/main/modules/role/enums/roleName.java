package dev.bengi.main.modules.role.enums;

public enum roleName {
    USER, ADMIN, SUPER_ADMIN;

    public String asString() {
        return name();
    }
}