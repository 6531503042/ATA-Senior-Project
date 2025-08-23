-- Create project_roles table
CREATE TABLE IF NOT EXISTS project_roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    permissions TEXT NOT NULL DEFAULT '[]', -- JSON array of permissions
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create project_member_roles table  
CREATE TABLE IF NOT EXISTS project_member_roles (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES project_roles(id) ON DELETE CASCADE,
    assigned_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_project_member_roles_project_id ON project_member_roles(project_id);
CREATE INDEX idx_project_member_roles_user_id ON project_member_roles(user_id);
CREATE INDEX idx_project_member_roles_role_id ON project_member_roles(role_id);
CREATE INDEX idx_project_member_roles_project_user ON project_member_roles(project_id, user_id);
CREATE INDEX idx_project_member_roles_active ON project_member_roles(is_active);

-- Ensure unique active assignment per project-user combination
CREATE UNIQUE INDEX idx_project_member_roles_unique_active 
ON project_member_roles(project_id, user_id) 
WHERE is_active = true;

-- Insert default project roles
INSERT INTO project_roles (name, description, permissions, is_default) VALUES
('Owner', 'Project owner with full permissions', 
 '["project.read","project.write","project.delete","members.read","members.write","members.delete","feedback.read","feedback.write","feedback.delete","authority.manage"]', 
 false),
('Manager', 'Project manager with management permissions', 
 '["project.read","project.write","members.read","members.write","feedback.read","feedback.write"]', 
 false),
('Contributor', 'Project contributor with read/write access', 
 '["project.read","feedback.read","feedback.write"]', 
 true),
('Viewer', 'Project viewer with read-only access', 
 '["project.read","feedback.read"]', 
 false)
ON CONFLICT (name) DO NOTHING;
