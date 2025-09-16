-- Seed data for PM Internship Recommendation Engine
-- Insert initial data for skills, sectors, and sample internships

-- Insert common skills
INSERT INTO skills (name, category) VALUES
('JavaScript', 'Technical'),
('Python', 'Technical'),
('React', 'Technical'),
('Node.js', 'Technical'),
('HTML', 'Technical'),
('CSS', 'Technical'),
('SQL', 'Technical'),
('Data Analysis', 'Technical'),
('Excel', 'Technical'),
('Communication', 'Soft Skills'),
('Leadership', 'Soft Skills'),
('Project Management', 'Soft Skills'),
('Problem Solving', 'Soft Skills'),
('Teamwork', 'Soft Skills'),
('Time Management', 'Soft Skills'),
('Critical Thinking', 'Soft Skills'),
('Digital Marketing', 'Marketing'),
('Social Media', 'Marketing'),
('Content Writing', 'Marketing'),
('SEO', 'Marketing'),
('Analytics', 'Marketing'),
('Finance', 'Finance'),
('Accounting', 'Finance'),
('Investment Analysis', 'Finance'),
('Risk Management', 'Finance'),
('Healthcare Knowledge', 'Healthcare'),
('Patient Care', 'Healthcare'),
('Medical Administration', 'Healthcare'),
('Teaching', 'Education'),
('Curriculum Development', 'Education'),
('Student Assessment', 'Education'),
('Engineering', 'Engineering'),
('Quality Control', 'Engineering'),
('Process Improvement', 'Engineering'),
('Manufacturing', 'Engineering'),
('Research', 'Research'),
('Policy Analysis', 'Research'),
('Writing', 'Communication'),
('Presentation', 'Communication'),
('Customer Service', 'Service'),
('Sales', 'Sales'),
('Inventory Management', 'Operations'),
('E-commerce', 'Technology'),
('Computer Skills', 'Technical'),
('Organization', 'Soft Skills'),
('Administration', 'Administrative'),
('Documentation', 'Administrative'),
('Statistics', 'Technical'),
('Mathematics', 'Technical'),
('Patience', 'Soft Skills'),
('Subject Knowledge', 'Education'),
('Technical Skills', 'Technical'),
('Community Work', 'Social'),
('Event Management', 'Management')
ON CONFLICT (name) DO NOTHING;

-- Insert sectors
INSERT INTO sectors (name, description) VALUES
('Technology & IT', 'Software development, IT services, and technology companies'),
('Healthcare', 'Hospitals, clinics, pharmaceutical companies, and health services'),
('Finance & Banking', 'Banks, financial institutions, insurance companies, and fintech'),
('Education', 'Schools, universities, educational technology, and training organizations'),
('Manufacturing', 'Industrial production, automotive, textiles, and manufacturing companies'),
('Government', 'Government departments, public sector organizations, and civil services'),
('Non-Profit', 'NGOs, charitable organizations, and social development agencies'),
('Media & Communications', 'Advertising, marketing, journalism, and media companies'),
('Retail & E-commerce', 'Retail stores, online marketplaces, and e-commerce platforms'),
('Agriculture', 'Farming, food processing, and agricultural technology'),
('Tourism & Hospitality', 'Hotels, travel agencies, and hospitality services'),
('Other', 'Other sectors not listed above')
ON CONFLICT (name) DO NOTHING;

-- Insert sample internships
INSERT INTO internships (title, organization, sector_id, location, description, education_requirement) VALUES
('Software Development Intern', 'TechCorp India', 
 (SELECT id FROM sectors WHERE name = 'Technology & IT'), 
 'Karnataka', 
 'Work on web applications using modern JavaScript frameworks. Learn full-stack development and agile methodologies.',
 'UG (Undergraduate)'),

('Digital Marketing Intern', 'Marketing Solutions Ltd', 
 (SELECT id FROM sectors WHERE name = 'Media & Communications'), 
 'Maharashtra', 
 'Assist in creating digital marketing campaigns, social media management, and content creation.',
 'UG (Undergraduate)'),

('Data Analysis Intern', 'DataTech Solutions', 
 (SELECT id FROM sectors WHERE name = 'Technology & IT'), 
 'Karnataka', 
 'Analyze business data, create reports, and support data-driven decision making using Python and SQL.',
 'UG (Undergraduate)'),

('Healthcare Administration Intern', 'City General Hospital', 
 (SELECT id FROM sectors WHERE name = 'Healthcare'), 
 'Tamil Nadu', 
 'Support hospital administration, patient records management, and healthcare operations.',
 'UG (Undergraduate)'),

('Financial Analysis Intern', 'National Bank', 
 (SELECT id FROM sectors WHERE name = 'Finance & Banking'), 
 'Maharashtra', 
 'Assist in financial analysis, risk assessment, and investment research for banking operations.',
 'UG (Undergraduate)'),

('Teaching Assistant Intern', 'State Education Board', 
 (SELECT id FROM sectors WHERE name = 'Education'), 
 'Delhi', 
 'Support teachers in classroom activities, curriculum development, and student assessment.',
 'UG (Undergraduate)'),

('Manufacturing Process Intern', 'Industrial Manufacturing Co', 
 (SELECT id FROM sectors WHERE name = 'Manufacturing'), 
 'Gujarat', 
 'Learn manufacturing processes, quality control, and production optimization techniques.',
 'UG (Undergraduate)'),

('Government Policy Research Intern', 'Ministry of Rural Development', 
 (SELECT id FROM sectors WHERE name = 'Government'), 
 'Delhi', 
 'Research policy impacts, analyze government programs, and support policy development initiatives.',
 'PG (Postgraduate)'),

('NGO Program Coordinator Intern', 'Rural Development Foundation', 
 (SELECT id FROM sectors WHERE name = 'Non-Profit'), 
 'Rajasthan', 
 'Coordinate community development programs, organize events, and support rural development initiatives.',
 'UG (Undergraduate)'),

('E-commerce Operations Intern', 'Online Retail Hub', 
 (SELECT id FROM sectors WHERE name = 'Retail & E-commerce'), 
 'Karnataka', 
 'Support online store operations, inventory management, and customer service for e-commerce platform.',
 'UG (Undergraduate)');

-- Link internships with required skills
-- Software Development Intern skills
INSERT INTO internship_skills (internship_id, skill_id, is_required) VALUES
((SELECT id FROM internships WHERE title = 'Software Development Intern'), (SELECT id FROM skills WHERE name = 'JavaScript'), true),
((SELECT id FROM internships WHERE title = 'Software Development Intern'), (SELECT id FROM skills WHERE name = 'React'), true),
((SELECT id FROM internships WHERE title = 'Software Development Intern'), (SELECT id FROM skills WHERE name = 'Node.js'), true),
((SELECT id FROM internships WHERE title = 'Software Development Intern'), (SELECT id FROM skills WHERE name = 'HTML'), true),
((SELECT id FROM internships WHERE title = 'Software Development Intern'), (SELECT id FROM skills WHERE name = 'CSS'), true);

-- Digital Marketing Intern skills
INSERT INTO internship_skills (internship_id, skill_id, is_required) VALUES
((SELECT id FROM internships WHERE title = 'Digital Marketing Intern'), (SELECT id FROM skills WHERE name = 'Digital Marketing'), true),
((SELECT id FROM internships WHERE title = 'Digital Marketing Intern'), (SELECT id FROM skills WHERE name = 'Social Media'), true),
((SELECT id FROM internships WHERE title = 'Digital Marketing Intern'), (SELECT id FROM skills WHERE name = 'Content Writing'), true),
((SELECT id FROM internships WHERE title = 'Digital Marketing Intern'), (SELECT id FROM skills WHERE name = 'Analytics'), true),
((SELECT id FROM internships WHERE title = 'Digital Marketing Intern'), (SELECT id FROM skills WHERE name = 'Communication'), true);

-- Data Analysis Intern skills
INSERT INTO internship_skills (internship_id, skill_id, is_required) VALUES
((SELECT id FROM internships WHERE title = 'Data Analysis Intern'), (SELECT id FROM skills WHERE name = 'Python'), true),
((SELECT id FROM internships WHERE title = 'Data Analysis Intern'), (SELECT id FROM skills WHERE name = 'SQL'), true),
((SELECT id FROM internships WHERE title = 'Data Analysis Intern'), (SELECT id FROM skills WHERE name = 'Data Analysis'), true),
((SELECT id FROM internships WHERE title = 'Data Analysis Intern'), (SELECT id FROM skills WHERE name = 'Excel'), true),
((SELECT id FROM internships WHERE title = 'Data Analysis Intern'), (SELECT id FROM skills WHERE name = 'Statistics'), true);

-- Healthcare Administration Intern skills
INSERT INTO internship_skills (internship_id, skill_id, is_required) VALUES
((SELECT id FROM internships WHERE title = 'Healthcare Administration Intern'), (SELECT id FROM skills WHERE name = 'Administration'), true),
((SELECT id FROM internships WHERE title = 'Healthcare Administration Intern'), (SELECT id FROM skills WHERE name = 'Communication'), true),
((SELECT id FROM internships WHERE title = 'Healthcare Administration Intern'), (SELECT id FROM skills WHERE name = 'Healthcare Knowledge'), true),
((SELECT id FROM internships WHERE title = 'Healthcare Administration Intern'), (SELECT id FROM skills WHERE name = 'Computer Skills'), true),
((SELECT id FROM internships WHERE title = 'Healthcare Administration Intern'), (SELECT id FROM skills WHERE name = 'Organization'), true);

-- Financial Analysis Intern skills
INSERT INTO internship_skills (internship_id, skill_id, is_required) VALUES
((SELECT id FROM internships WHERE title = 'Financial Analysis Intern'), (SELECT id FROM skills WHERE name = 'Finance'), true),
((SELECT id FROM internships WHERE title = 'Financial Analysis Intern'), (SELECT id FROM skills WHERE name = 'Excel'), true),
((SELECT id FROM internships WHERE title = 'Financial Analysis Intern'), (SELECT id FROM skills WHERE name = 'Data Analysis'), true),
((SELECT id FROM internships WHERE title = 'Financial Analysis Intern'), (SELECT id FROM skills WHERE name = 'Mathematics'), true),
((SELECT id FROM internships WHERE title = 'Financial Analysis Intern'), (SELECT id FROM skills WHERE name = 'Communication'), true);

-- Teaching Assistant Intern skills
INSERT INTO internship_skills (internship_id, skill_id, is_required) VALUES
((SELECT id FROM internships WHERE title = 'Teaching Assistant Intern'), (SELECT id FROM skills WHERE name = 'Teaching'), true),
((SELECT id FROM internships WHERE title = 'Teaching Assistant Intern'), (SELECT id FROM skills WHERE name = 'Communication'), true),
((SELECT id FROM internships WHERE title = 'Teaching Assistant Intern'), (SELECT id FROM skills WHERE name = 'Subject Knowledge'), true),
((SELECT id FROM internships WHERE title = 'Teaching Assistant Intern'), (SELECT id FROM skills WHERE name = 'Patience'), true),
((SELECT id FROM internships WHERE title = 'Teaching Assistant Intern'), (SELECT id FROM skills WHERE name = 'Organization'), true);

-- Manufacturing Process Intern skills
INSERT INTO internship_skills (internship_id, skill_id, is_required) VALUES
((SELECT id FROM internships WHERE title = 'Manufacturing Process Intern'), (SELECT id FROM skills WHERE name = 'Engineering'), true),
((SELECT id FROM internships WHERE title = 'Manufacturing Process Intern'), (SELECT id FROM skills WHERE name = 'Quality Control'), true),
((SELECT id FROM internships WHERE title = 'Manufacturing Process Intern'), (SELECT id FROM skills WHERE name = 'Process Improvement'), true),
((SELECT id FROM internships WHERE title = 'Manufacturing Process Intern'), (SELECT id FROM skills WHERE name = 'Technical Skills'), true),
((SELECT id FROM internships WHERE title = 'Manufacturing Process Intern'), (SELECT id FROM skills WHERE name = 'Problem Solving'), true);

-- Government Policy Research Intern skills
INSERT INTO internship_skills (internship_id, skill_id, is_required) VALUES
((SELECT id FROM internships WHERE title = 'Government Policy Research Intern'), (SELECT id FROM skills WHERE name = 'Research'), true),
((SELECT id FROM internships WHERE title = 'Government Policy Research Intern'), (SELECT id FROM skills WHERE name = 'Policy Analysis'), true),
((SELECT id FROM internships WHERE title = 'Government Policy Research Intern'), (SELECT id FROM skills WHERE name = 'Writing'), true),
((SELECT id FROM internships WHERE title = 'Government Policy Research Intern'), (SELECT id FROM skills WHERE name = 'Communication'), true),
((SELECT id FROM internships WHERE title = 'Government Policy Research Intern'), (SELECT id FROM skills WHERE name = 'Critical Thinking'), true);

-- NGO Program Coordinator Intern skills
INSERT INTO internship_skills (internship_id, skill_id, is_required) VALUES
((SELECT id FROM internships WHERE title = 'NGO Program Coordinator Intern'), (SELECT id FROM skills WHERE name = 'Project Management'), true),
((SELECT id FROM internships WHERE title = 'NGO Program Coordinator Intern'), (SELECT id FROM skills WHERE name = 'Communication'), true),
((SELECT id FROM internships WHERE title = 'NGO Program Coordinator Intern'), (SELECT id FROM skills WHERE name = 'Community Work'), true),
((SELECT id FROM internships WHERE title = 'NGO Program Coordinator Intern'), (SELECT id FROM skills WHERE name = 'Organization'), true),
((SELECT id FROM internships WHERE title = 'NGO Program Coordinator Intern'), (SELECT id FROM skills WHERE name = 'Leadership'), true);

-- E-commerce Operations Intern skills
INSERT INTO internship_skills (internship_id, skill_id, is_required) VALUES
((SELECT id FROM internships WHERE title = 'E-commerce Operations Intern'), (SELECT id FROM skills WHERE name = 'E-commerce'), true),
((SELECT id FROM internships WHERE title = 'E-commerce Operations Intern'), (SELECT id FROM skills WHERE name = 'Customer Service'), true),
((SELECT id FROM internships WHERE title = 'E-commerce Operations Intern'), (SELECT id FROM skills WHERE name = 'Inventory Management'), true),
((SELECT id FROM internships WHERE title = 'E-commerce Operations Intern'), (SELECT id FROM skills WHERE name = 'Computer Skills'), true),
((SELECT id FROM internships WHERE title = 'E-commerce Operations Intern'), (SELECT id FROM skills WHERE name = 'Communication'), true);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash, full_name, email) VALUES
('admin', '$2b$10$rOzJqQZJqQZJqQZJqQZJqO', 'System Administrator', 'admin@pminternship.gov.in')
ON CONFLICT (username) DO NOTHING;
