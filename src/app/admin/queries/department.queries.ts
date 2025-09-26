const GET_ALL_DEPARTMENTS = "SELECT * FROM departments WHERE school_id = $1";
const CHECK_DEPARTMENT_NAME_EXISTS =
  "SELECT 1 FROM departments WHERE LOWER(name) = LOWER($1) AND school_id = $2 LIMIT 1";
const CHECK_DEPARTMENT_EXIST_BY_ID =
  "SELECT 1 FROM departments WHERE id = $1 LIMIT 1";
const CHECK_HOD_EXISTS =
  "SELECT name FROM departments WHERE head_of_department = $1 AND school_id = $2 LIMIT 1";
const CREATE_DEPARTMENT =
  "INSERT INTO departments(school_id, name, head_of_department, department_code) VALUES ($1, $2, $3, $4) ON CONFLICT (school_id, name) DO NOTHING RETURNING id";
const UPDATE_DEPARTMENT =
  "UPDATE departments SET name = $2, head_of_department = $3, department_code = $4 WHERE id = $1 RETURNING id";
const DELETE_DEPARTMENT = "DELETE FROM departments WHERE id = $1 RETURNING true";
const TOTAL_COURSES_IN_DEPARTMENT =
  "SELECT COUNT(DISTINCT c.id) FROM courses c LEFT JOIN classes cl ON c.class_id = cl.id LEFT JOIN streams s ON c.stream_id = s.id WHERE c.scope = 'school' OR (c.scope = 'class' AND cl.department_id = $1) OR (c.scope = 'stream' AND cl.department_id = $1)";
const TOTAL_TEACHERS_IN_DEPARTMENT =
  "SELECT COUNT(DISTINCT tc.teacher_id) FROM teacher_courses tc JOIN courses c ON tc.course_id = c.id LEFT JOIN classes cl ON c.class_id = cl.id WHERE c.scope = 'school' OR (c.scope = 'class' AND cl.department_id = $1) OR (c.scope = 'stream' AND cl.department_id = $1)";
const TOTAL_STUDENTS_IN_DEPARTMENT =
  "SELECT COUNT(DISTINCT s.id) from students s LEFT JOIN classes cl ON s.class_id = cl.id WHERE cl.department_id = $1";
const ALL_COURSES_IN_DEPARTMENT =
  "SELECT c.* FROM courses c LEFT JOIN classes cl ON c.class_id = cl.id WHERE c.scope = 'school' OR (c.scope = 'class' AND cl.department_id = $1) OR (c.scope = 'stream' AND cl.department_id = $1)";
const ALL_TEACHERS_IN_DEPARTMENT =
  "SELECT u.id AS teacher_id, u.name AS teacher_name, u.email, CASE WHEN d.head_of_department = u.id THEN 'Head of Department' ELSE t.specialization END AS role_in_department, COUNT(DISTINCT c.id) AS total_courses FROM users u LEFT JOIN teachers t ON t.user_id = u.id LEFT JOIN teacher_courses tc ON tc.teacher_id = u.id LEFT JOIN courses c ON c.id = tc.course_id LEFT JOIN classes cl ON c.class_id = cl.id LEFT JOIN streams st ON c.stream_id = st.id LEFT JOIN departments d ON ( (c.scope = 'class' AND cl.department_id = d.id) OR (c.scope = 'stream' AND cl.department_id = d.id) OR (c.scope = 'school') ) WHERE u.role = 'teacher' AND d.id = $1 GROUP BY u.id, u.name, u.email, role_in_department";
const ALL_STUDENTS_IN_DEPARTMENT =
  "SELECT u.id AS student_id, u.name AS student_name, c.name AS class_name, st.name AS stream_name, u.created_at AS enrollment_date FROM students s JOIN users u ON u.id = s.user_id JOIN classes c ON c.id = s.class_id LEFT JOIN streams st ON st.id = s.stream_id JOIN departments d ON d.id = c.department_id WHERE u.role = 'student' AND d.id = $1 ORDER BY c.name, st.name, u.name";
const GET_DEPARTMENTS = `
SELECT 
    d.id AS department_id,
    d.name AS department_name,
    d.department_code AS department_code,
    COALESCE(NULLIF(CONCAT(u.first_name, ' ', u.last_name), ''), 'Not Assigned') AS hod,
    COUNT(DISTINCT c.id) AS total_classes,
    COUNT(DISTINCT stu.user_id) AS total_students,
    COUNT(DISTINCT tch.user_id) AS total_teachers,
    JSON_AGG(
        DISTINCT JSONB_BUILD_OBJECT(
            'class_id', c.id,
            'class_name', c.name,
            'streams', (
                SELECT JSON_AGG(
                    DISTINCT JSONB_BUILD_OBJECT(
                        'stream_id', s.id,
                        'stream_name', s.name
                    )
                )
                FROM streams s
                WHERE s.class_id = c.id
            )
        )
    ) FILTER (WHERE c.id IS NOT NULL) AS classes_with_streams
FROM departments d
LEFT JOIN users u ON d.head_of_department = u.id
LEFT JOIN classes c ON d.id = c.department_id
LEFT JOIN students stu ON c.id = stu.class_id
LEFT JOIN teachers tch ON d.id = tch.department_id
WHERE d.school_id = $1
GROUP BY d.id, d.name, u.first_name, u.last_name
ORDER BY d.name
`;

const GET_SINGLE_DEPARTMENT = `
SELECT 
    d.id AS department_id,
    d.name AS department_name,
    d.created_at AS department_created_at,
    d.department_code,
    COALESCE(NULLIF(CONCAT(u.first_name, ' ', u.last_name), ''), 'Not Assigned') AS hod_name,

    -- Department-level stats array
    (
      SELECT JSON_AGG(
        JSONB_BUILD_OBJECT(
          'id', stat_id,
          'label', stat_label,
          'value', stat_value
        )
      )
      FROM (
        VALUES
          (
            'subjects',
            'Total Courses',
            (SELECT COUNT(DISTINCT co.id)
             FROM courses co
             JOIN classes cl ON co.class_id = cl.id
             WHERE cl.department_id = d.id)::text
          ),
          (
            'students',
            'Total Students',
            (SELECT COUNT(DISTINCT stu.user_id)
             FROM students stu
             JOIN classes cl ON stu.class_id = cl.id
             WHERE cl.department_id = d.id)::text
          ),
          (
            'teachers',
            'Total Teachers',
            (SELECT COUNT(DISTINCT t.user_id)
             FROM teachers t
             WHERE t.department_id = d.id)::text
          ),
          (
            'created_at',
            'Department Created At',
            d.created_at::text
          )
      ) AS stats(stat_id, stat_label, stat_value)
    ) AS department_stats,

    -- Courses in department (now includes correct total_students per course)
    (
      SELECT JSON_AGG(
        DISTINCT JSONB_BUILD_OBJECT(
          'course_id', co.id,
          'course_name', sub.name,
          'teacher', (
            SELECT JSON_AGG(
              JSONB_BUILD_OBJECT(
                'teacher_id', tu.id,
                'teacher_name', CONCAT(tu.first_name, ' ', tu.last_name)
              )
            )
            FROM teacher_courses tc
            JOIN teachers t2 ON tc.teacher_id = t2.user_id
            JOIN users tu ON t2.user_id = tu.id
            WHERE tc.course_id = co.id
          ),
          -- count students in the course's class; if the course has a stream_id, only count students in that stream
          'total_students', (
            SELECT COUNT(DISTINCT s.user_id)
            FROM students s
            WHERE s.class_id = co.class_id
              AND (co.stream_id IS NULL OR s.stream_id = co.stream_id)
          )
        )
      )
      FROM courses co
      JOIN subjects sub ON co.subject_id = sub.id
      JOIN classes cl ON co.class_id = cl.id
      WHERE cl.department_id = d.id
    ) AS courses_in_department,

    -- Teachers in department
    (
      SELECT JSON_AGG(
        JSONB_BUILD_OBJECT(
          'teacher_id', t.user_id,
          'teacher_name', CONCAT(u2.first_name, ' ', u2.last_name),
          'teacher_email', u2.email,
          'teacher_phone', u2.phone_number,
          'role', CASE WHEN t.user_id = d.head_of_department THEN 'Head of Department' ELSE 'Teacher' END,
          'total_courses', (
            SELECT COUNT(DISTINCT tc.course_id)
            FROM teacher_courses tc
            JOIN courses co ON tc.course_id = co.id
            JOIN classes cl ON co.class_id = cl.id
            WHERE tc.teacher_id = t.user_id
              AND cl.department_id = d.id
          )
        )
      )
      FROM teachers t
      JOIN users u2 ON t.user_id = u2.id
      WHERE t.department_id = d.id
    ) AS teachers_in_department,

    -- Students in department
    (
      SELECT JSON_AGG(
        JSONB_BUILD_OBJECT(
          'student_id', s.user_id,
          'student_name', CONCAT(u3.first_name, ' ', u3.last_name),
          'enrolled', u3.created_at,
          'student_class', cl.name,
          'student_stream', st.name,
          'belongs_to_stream', CASE WHEN s.stream_id IS NOT NULL THEN true ELSE false END
        )
      )
      FROM students s
      JOIN users u3 ON s.user_id = u3.id
      JOIN classes cl ON s.class_id = cl.id
      LEFT JOIN streams st ON s.stream_id = st.id
      WHERE cl.department_id = d.id
    ) AS students_in_department

FROM departments d
LEFT JOIN users u ON d.head_of_department = u.id
WHERE d.id = $1;
`;


export {
  GET_ALL_DEPARTMENTS,
  CHECK_DEPARTMENT_NAME_EXISTS,
  CHECK_DEPARTMENT_EXIST_BY_ID,
  CHECK_HOD_EXISTS,
  CREATE_DEPARTMENT,
  UPDATE_DEPARTMENT,
  DELETE_DEPARTMENT,
  TOTAL_COURSES_IN_DEPARTMENT,
  TOTAL_TEACHERS_IN_DEPARTMENT,
  TOTAL_STUDENTS_IN_DEPARTMENT,
  ALL_COURSES_IN_DEPARTMENT,
  ALL_TEACHERS_IN_DEPARTMENT,
  ALL_STUDENTS_IN_DEPARTMENT,
  GET_DEPARTMENTS,
  GET_SINGLE_DEPARTMENT,
};
