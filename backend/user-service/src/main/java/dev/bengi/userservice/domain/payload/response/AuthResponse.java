package dev.bengi.userservice.domain.payload.response;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

public class AuthResponse {

    @JsonProperty("id")
    private Long id;
    
    @JsonProperty("username")
    private String username;
    
    @JsonProperty("fullname")
    private String fullname;
    
    @JsonProperty("email")
    private String email;
    
    @JsonProperty("avatar")
    private String avatar;
    
    @JsonProperty("gender")
    private String gender;
    
    @JsonProperty("department_id")
    private Long departmentId;
    
    @JsonProperty("department_name")
    private String departmentName;
    
    @JsonProperty("roles")
    private List<String> roles;
    
    // Default constructor
    public AuthResponse() {
    }
    
    // All args constructor
    public AuthResponse(Long id, String username, String fullname, String email, String avatar, String gender, Long departmentId, String departmentName, List<String> roles) {
        this.id = id;
        this.username = username;
        this.fullname = fullname;
        this.email = email;
        this.avatar = avatar;
        this.gender = gender;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.roles = roles;
    }
    
    // Builder pattern
    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getFullname() {
        return fullname;
    }
    
    public void setFullname(String fullname) {
        this.fullname = fullname;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getAvatar() {
        return avatar;
    }
    
    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
    
    public String getGender() {
        return gender;
    }
    
    public void setGender(String gender) {
        this.gender = gender;
    }
    
    public Long getDepartmentId() {
        return departmentId;
    }
    
    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }
    
    public String getDepartmentName() {
        return departmentName;
    }
    
    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }
    
    public List<String> getRoles() {
        return roles;
    }
    
    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
    
    // Builder class
    public static class AuthResponseBuilder {
        private Long id;
        private String username;
        private String fullname;
        private String email;
        private String avatar;
        private String gender;
        private Long departmentId;
        private String departmentName;
        private List<String> roles;
        
        AuthResponseBuilder() {
        }
        
        public AuthResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }
        
        public AuthResponseBuilder username(String username) {
            this.username = username;
            return this;
        }
        
        public AuthResponseBuilder fullname(String fullname) {
            this.fullname = fullname;
            return this;
        }
        
        public AuthResponseBuilder email(String email) {
            this.email = email;
            return this;
        }
        
        public AuthResponseBuilder avatar(String avatar) {
            this.avatar = avatar;
            return this;
        }
        
        public AuthResponseBuilder gender(String gender) {
            this.gender = gender;
            return this;
        }
        
        public AuthResponseBuilder departmentId(Long departmentId) {
            this.departmentId = departmentId;
            return this;
        }
        
        public AuthResponseBuilder departmentName(String departmentName) {
            this.departmentName = departmentName;
            return this;
        }
        
        public AuthResponseBuilder roles(List<String> roles) {
            this.roles = roles;
            return this;
        }
        
        public AuthResponse build() {
            return new AuthResponse(id, username, fullname, email, avatar, gender, departmentId, departmentName, roles);
        }
    }
}
