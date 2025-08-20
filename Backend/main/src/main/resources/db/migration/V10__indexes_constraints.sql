-- Strengthen constraints and add indexes
ALTER TABLE projects ALTER COLUMN name SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_projects_name ON projects(name);

-- Enforce NOT NULL on feedbacks.project_id if business requires; keeping current nullable for DRAFT use cases
-- ALTER TABLE feedbacks ALTER COLUMN project_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_projects_department_id ON projects(department_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_project_id ON feedbacks(project_id);


