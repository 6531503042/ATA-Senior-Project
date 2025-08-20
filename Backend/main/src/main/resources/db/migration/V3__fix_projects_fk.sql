ALTER TABLE projects
    ALTER COLUMN department_id TYPE BIGINT USING department_id::bigint;

-- You may have departments table; if so, enforce FK. Otherwise, keep type fix only.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'departments'
    ) THEN
        ALTER TABLE projects
            DROP CONSTRAINT IF EXISTS fk_projects_department,
            ADD CONSTRAINT fk_projects_department FOREIGN KEY (department_id)
                REFERENCES departments(id) ON DELETE SET NULL;
    END IF;
END$$;


