const CREATE_SCHOOL =
  "INSERT INTO schools(school_name, institution_type, address, city, state, zip_code, country, contact_email, phone_number, website, social_media, logo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id";
const CHECK_SCHOOL_MAIL_EXISTS =
  "SELECT 1 FROM schools WHERE contact_email = $1 LIMIT 1";
const UPDATE_SCHOOL =
  "INSERT INTO schools(id, school_name, institution_type, address, city, state, zip_code, country, contact_email, phone_number, website, social_media, logo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (id) DO UPDATE SET school_name = EXCLUDED.school_name, institution_type = EXCLUDED.institution_type, address = EXCLUDED.address, city = EXCLUDED.city, state = EXCLUDED.state, zip_code = EXCLUDED.zip_code, country = EXCLUDED.country, contact_email = EXCLUDED.contact_email, phone_number = EXCLUDED.phone_number, website = EXCLUDED.website, social_media = EXCLUDED.social_media, logo = EXCLUDED.logo RETURNING id";
const CREATE_ACADEMIC_STRUCTURE =
  "INSERT INTO academic_structures(school_id, academic_year_start, academic_year_end, term_system, current_term) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (school_id) DO UPDATE SET academic_year_start = EXCLUDED.academic_year_start, academic_year_end = EXCLUDED.academic_year_end, term_system = EXCLUDED.term_system, current_term = EXCLUDED.current_term RETURNING id";
const CREATE_TERMS =
  "INSERT INTO terms(academic_structure_id, name, start_date, end_date) VALUES ($1, $2, $3, $4) ON CONFLICT (academic_structure_id, name) DO UPDATE SET start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date RETURNING id";
const CREATE_DEPARTMENT =
  "INSERT INTO departments(school_id, name) VALUES ($1, $2) ON CONFLICT (school_id, name) DO NOTHING RETURNING id";
const CREATE_SUBJECTS =
  "INSERT INTO subjects(school_id, name) VALUES ($1, $2) ON CONFLICT (school_id, name) DO NOTHING RETURNING id";
const CREATE_GRADING_SYSTEM =
  "INSERT INTO grading_systems(school_id, grading_type, minimum_passing_grade) VALUES ($1, $2, $3) ON CONFLICT (school_id) DO UPDATE SET grading_type = EXCLUDED.grading_type, minimum_passing_grade = EXCLUDED.minimum_passing_grade RETURNING id";
const CREATE_GRADE_SCALES =
  "INSERT INTO grade_scales(grading_system_id, grade, min_score, max_score, remark) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (grading_system_id, grade) DO UPDATE SET min_score = EXCLUDED.min_score, max_score = EXCLUDED.max_score, remark = EXCLUDED.remark RETURNING id";
const GET_ALL_TEACHERS_IN_SCHOOL =
  "SELECT * FROM users WHERE role = 'teacher' AND school_id = $1";
const TOTAL_DEPARTMENTS_IN_SCHOOL =
  "SELECT COUNT(DISTINCT id) FROM departments WHERE school_id = $1";
const TOTAL_STUDENTS_IN_SCHOOL =
  "SELECT COUNT(DISTINCT id) FROM users WHERE role = 'student' AND school_id = $1";
const TOTAL_TEACHERS_IN_SCHOOL =
  "SELECT COUNT(DISTINCT id) FROM users WHERE role = 'teacher' AND school_id = $1";
const TOTAL_CLASSES_IN_SCHOOL =
  "SELECT COUNT(*) AS total_classes_in_school FROM (SELECT c.id AS unit_id FROM classes c JOIN departments d ON d.id = c.department_id WHERE d.school_id = $1 AND NOT EXISTS (SELECT 1 FROM streams st WHERE st.class_id = c.id)  UNION ALL  SELECT st.id AS unit_id FROM streams st  JOIN classes c ON st.class_id = c.id JOIN departments d ON d.id = c.department_id WHERE d.school_id = $1) AS class_units";
const SCHOOL_STAT_FOR_DEPARTMENT =
  "SELECT (SELECT COUNT(DISTINCT id) FROM departments WHERE school_id = $1) AS total_departments, (SELECT COUNT(DISTINCT id) FROM users WHERE role = 'student' AND school_id = $1) AS total_students, (SELECT COUNT(DISTINCT id) FROM users WHERE role = 'teacher' AND school_id = $1) AS total_teachers, (SELECT COUNT(*) FROM (SELECT c.id AS unit_id FROM classes c JOIN departments d ON d.id = c.department_id WHERE d.school_id = $1 AND NOT EXISTS (SELECT 1 FROM streams st WHERE st.class_id = c.id) UNION ALL SELECT st.id AS unit_id FROM streams st JOIN classes c ON st.class_id = c.id JOIN departments d ON d.id = c.department_id WHERE d.school_id = $1) AS class_units) AS total_classes";
const SCHOOL_STAT_FOR_DASHBOARD =
  "SELECT (SELECT COUNT(DISTINCT id) FROM departments WHERE school_id = $1) AS total_departments, (SELECT COUNT(DISTINCT id) FROM subjects WHERE school_id = $1) AS total_subjects, (SELECT COUNT(DISTINCT id) FROM users WHERE role = 'student' AND school_id = $1) AS total_students, (SELECT COUNT(DISTINCT id) FROM users WHERE role = 'teacher' AND school_id = $1) AS total_teachers, (SELECT COUNT(*) FROM (SELECT c.id AS unit_id FROM classes c JOIN departments d ON d.id = c.department_id WHERE d.school_id = $1 AND NOT EXISTS (SELECT 1 FROM streams st WHERE st.class_id = c.id) UNION ALL SELECT st.id AS unit_id FROM streams st JOIN classes c ON st.class_id = c.id JOIN departments d ON d.id = c.department_id WHERE d.school_id = $1) AS class_units) AS total_classes";
const DEPARTMENTS_IN_SCHOOL = `
WITH department_classes AS (
    SELECT 
        d.id as department_id,
        d.name as department_name,
        sch.institution_type,
        COUNT(DISTINCT c.id) as class_count
    FROM departments d
    JOIN schools sch ON sch.id = d.school_id
    LEFT JOIN classes c ON c.department_id = d.id
    WHERE d.school_id = $1
    GROUP BY d.id, d.name, sch.institution_type
),
department_streams AS (
    SELECT 
        d.id as department_id,
        COUNT(DISTINCT st.id) as stream_count,
        ARRAY_AGG(DISTINCT st.name) FILTER (WHERE st.id IS NOT NULL) as available_streams
    FROM departments d
    LEFT JOIN classes c ON c.department_id = d.id
    LEFT JOIN streams st ON st.class_id = c.id
    WHERE d.school_id = $1
    GROUP BY d.id
),
department_students AS (
    SELECT 
        d.id as department_id,
        COUNT(DISTINCT s.id) as student_count
    FROM departments d
    LEFT JOIN classes c ON c.department_id = d.id
    LEFT JOIN streams st ON st.class_id = c.id
    LEFT JOIN students s ON (s.class_id = c.id OR s.stream_id = st.id)
    WHERE d.school_id = $1
    GROUP BY d.id
),
department_teachers AS (
    SELECT 
        d.id as department_id,
        COUNT(DISTINCT tc.user_id) as teacher_count
    FROM departments d
    LEFT JOIN classes c ON c.department_id = d.id
    LEFT JOIN streams st ON st.class_id = c.id
    LEFT JOIN courses co ON (co.class_id = c.id OR co.stream_id = st.id)
    LEFT JOIN teacher_courses tc ON tc.course_id = co.id
    WHERE d.school_id = $1
    GROUP BY d.id
)
SELECT 
    dc.department_id,
    dc.department_name,
    CASE 
        WHEN dc.institution_type = 'junior-high' AND dc.department_name ILIKE '%primary%' 
            THEN 'Class 1 - Class 6'
        WHEN dc.institution_type = 'junior-high' AND dc.department_name ILIKE '%JHS%' 
            THEN 'JHS 1 - JHS 3'
        WHEN dc.institution_type = 'senior-high' 
            THEN 'SHS 1 - SHS 3'
        ELSE 'N/A'
    END AS class_range,
    COALESCE(ds.available_streams, ARRAY[]::text[]) AS available_streams,
    COALESCE(dc.class_count, 0) + COALESCE(ds.stream_count, 0) AS total_classes,
    COALESCE(dst.student_count, 0) AS total_students,
    COALESCE(dt.teacher_count, 0) AS total_teachers
FROM department_classes dc
LEFT JOIN department_streams ds ON ds.department_id = dc.department_id
LEFT JOIN department_students dst ON dst.department_id = dc.department_id
LEFT JOIN department_teachers dt ON dt.department_id = dc.department_id`;

const SCHOOL_STAT_FOR_CLASSES = `WITH class_sizes AS (
    SELECT c.id AS unit_id, c.department_id, COUNT(stu.user_id) AS class_size
    FROM classes c
    LEFT JOIN students stu ON stu.class_id = c.id AND stu.stream_id IS NULL
    WHERE NOT EXISTS (SELECT 1 FROM streams st WHERE st.class_id = c.id)
    GROUP BY c.id, c.department_id
    UNION ALL
    SELECT st.id AS unit_id, c.department_id, COUNT(stu.user_id) AS class_size
    FROM streams st
    JOIN classes c ON c.id = st.class_id
    LEFT JOIN students stu ON stu.stream_id = st.id
    GROUP BY st.id, c.department_id
),
student_counts AS (
    SELECT 
        CASE 
            WHEN $2::int IS NOT NULL 
            THEN COUNT(DISTINCT u.id) FILTER (WHERE d.id = $2 AND EXISTS (
                SELECT 1 FROM classes c JOIN departments d2 ON d2.id = c.department_id 
                WHERE c.id = (SELECT class_id FROM students stu WHERE stu.user_id = u.id LIMIT 1)
                AND d2.id = $2
            ))
            ELSE COUNT(DISTINCT u.id) FILTER (WHERE u.school_id = $1 AND u.role = 'student')
        END AS total_students
    FROM users u
    LEFT JOIN departments d ON d.school_id = u.school_id
    WHERE u.school_id = $1
),
subject_counts AS (
    SELECT 
        CASE 
            WHEN $2::int IS NOT NULL 
            THEN COUNT(DISTINCT subj.id) FILTER (WHERE d.id = $2)
            ELSE COUNT(DISTINCT subj.id) FILTER (WHERE subj.school_id = $1)
        END AS total_subjects
    FROM subjects subj
    LEFT JOIN courses co ON co.subject_id = subj.id
    LEFT JOIN classes c ON c.id = co.class_id
    LEFT JOIN departments d ON d.id = c.department_id
    WHERE (d.school_id = $1 OR d.school_id IS NULL) OR co.id IS NULL
)
SELECT 
    COUNT(DISTINCT c.id) AS total_classes,
    (SELECT total_students FROM student_counts) AS total_students,
    ROUND(AVG(cs.class_size), 2) AS average_class_size,
    (SELECT total_subjects FROM subject_counts) AS total_subjects
FROM departments d
JOIN classes c ON c.department_id = d.id
LEFT JOIN students stu ON stu.class_id = c.id 
    OR stu.stream_id IN (SELECT id FROM streams WHERE class_id = c.id)
LEFT JOIN courses co ON co.class_id = c.id
LEFT JOIN subjects subj ON subj.id = co.subject_id
LEFT JOIN class_sizes cs ON cs.unit_id IN (c.id, (SELECT id FROM streams WHERE class_id = c.id))
WHERE d.school_id = $1
    AND ($2::int IS NULL OR d.id = $2)`;

export {
  CREATE_SCHOOL,
  UPDATE_SCHOOL,
  CREATE_ACADEMIC_STRUCTURE,
  CREATE_TERMS,
  CREATE_DEPARTMENT,
  CREATE_SUBJECTS,
  CREATE_GRADING_SYSTEM,
  CREATE_GRADE_SCALES,
  CHECK_SCHOOL_MAIL_EXISTS,
  GET_ALL_TEACHERS_IN_SCHOOL,
  TOTAL_DEPARTMENTS_IN_SCHOOL,
  TOTAL_STUDENTS_IN_SCHOOL,
  TOTAL_TEACHERS_IN_SCHOOL,
  TOTAL_CLASSES_IN_SCHOOL,
  SCHOOL_STAT_FOR_DEPARTMENT,
  SCHOOL_STAT_FOR_DASHBOARD,
  SCHOOL_STAT_FOR_CLASSES,
  DEPARTMENTS_IN_SCHOOL,
};
