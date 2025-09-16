-- Add role column to users table for role-based authentication
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin'));

-- Update existing users to have student role
UPDATE users SET role = 'student' WHERE role IS NULL;

-- Create an admin user for testing
INSERT INTO users (full_name, email, password_hash, role) 
VALUES ('Admin User', 'admin@pminternship.gov.in', 'YWRtaW4xMjM=', 'admin')
ON CONFLICT (email) DO NOTHING;
