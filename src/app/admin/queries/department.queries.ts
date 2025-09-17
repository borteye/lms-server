const GET_ALL_DEPARTMENTS = "SELECT * FROM departments WHERE school_id = $1";
const CHECK_DEPARTMENT_NAME_EXISTS =
  "SELECT 1 FROM departments WHERE LOWER(name) = LOWER($1) LIMIT 1";
const CHECK_DEPARTMENT_EXIST_BY_ID =
  "SELECT 1 FROM departments WHERE id = $1 LIMIT 1";
const CHECK_HOD_EXISTS =
  "SELECT name FROM departments WHERE head_of_department = $1 AND school_id = $2 LIMIT 1";
const CREATE_DEPARTMENT =
  "INSERT INTO departments(school_id, name, head_of_department, department_code) VALUES ($1, $2, $3, $4) ON CONFLICT (school_id, name) DO NOTHING RETURNING id";
const UPDATE_DEPARTMENT =
  "UPDATE departments SET name = $2, head_of_department = $3, department_code = $4 WHERE id = $1 RETURNING id";
const DELETE_DEPARTMENT = "DELETE FROM departments WHERE id = $1 RETURNING id";
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
};
