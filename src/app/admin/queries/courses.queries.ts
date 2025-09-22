const CREATE_SUBJECT =
  "INSERT INTO subjects (school_id, name) VALUES ($1, $2) RETURNING id";
const SUBJECT_EXISTS =
  "SELECT 1 FROM subjects WHERE LOWER(name) = LOWER($1) AND school_id = $2 LIMIT 1";
const COURSE_EXIST = `
SELECT 1 
FROM courses 
WHERE subject_id = $1 
  AND (
    (scope = 'school' AND class_id = $2) OR
    (scope = 'class' AND class_id = $2) OR
    (scope = 'stream' AND class_id = $2 AND stream_id = $3 )
  )
LIMIT 1;
`;
const CREATE_COURSE =
  "INSERT INTO courses (scope, class_id, stream_id, subject_id) VALUES ($1, $2, $3, $4) RETURNING id";
const CREATE_TEACHER_COURSE =
  "INSERT INTO teacher_courses (teacher_id, course_id) VALUES ($1, $2) RETURNING *";

export {
  CREATE_SUBJECT,
  SUBJECT_EXISTS,
  COURSE_EXIST,
  CREATE_COURSE,
  CREATE_TEACHER_COURSE,
};
