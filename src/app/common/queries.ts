const CHECK_EMAIL_EXISTS = "SELECT 1 FROM users WHERE email = $1 LIMIT 1";
const GET_USER_BY_EMAIL = "SELECT * FROM users WHERE email = $1  LIMIT 1";
const CREATE_AUTH = "INSERT INTO auth (user_id, password) VALUES ($1, $2)";
const GET_USER_PASSWORD =
  "SELECT password FROM auth WHERE user_id = $1 LIMIT 1";
const CREATE_STUDENT =
  "INSERT INTO users (first_name, last_name, phone_number, email, role, school_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";
const CREATE_TEACHER =
  "INSERT INTO users (first_name, last_name, phone_number, email, role, school_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";
const CREATE_INTO_STUDENT_TABLE =
  "INSERT INTO students (user_id, class_id, stream_id) VALUES ($1, $2, $3)";
const CREATE_INTO_TEACHER_TABLE =
  "INSERT INTO teachers (user_id, specialization, department_id) VALUES ($1, $2, $3)";
const CREATE_NOTIFICATION =
  "INSERT INTO notifications (school_id, user_id, role_target, title, message, file_url, metadata, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id";
const CREATE_SINGLE_NOTIFICATION_RECEIPT =
  "INSERT INTO notification_receipts (notification_id, user_id) VALUES ($1, $2)";
const CREATE_BULK_NOTIFICATION_RECEIPTS =
  "INSERT INTO notification_receipts (notification_id, user_id) SELECT $1, unnest($2::int[])";
const GET_CLASS_LEVELS = `SELECT cl.id, cl.name
FROM class_levels cl
JOIN schools s ON s.id = $1
WHERE
    (s.institution_type = 'senior-high' AND cl.name LIKE 'SHS%')
 OR (s.institution_type = 'junior-high' AND cl.name ~ '^(Class|JHS)')
ORDER BY cl.id
`;
const GET_DEPARTMENTS_NAME_AND_ID =
  "SELECT id, name FROM departments WHERE school_id = $1";
const GET_SUBJECTS = "SELECT id, name FROM subjects WHERE school_id = $1";
const CLASSES_WITH_STREAMS = `
    -- Get classes that have NO streams
    SELECT 
        c.id as class_id,
        c.name as class_name,
        NULL as stream_id,
        NULL as stream_name,
        'class' as type,
        cl.id as class_level_id,
        cl.name as class_level_name
    FROM classes c
    INNER JOIN departments d ON c.department_id = d.id
    INNER JOIN class_levels cl ON c.class_level_id = cl.id
    WHERE d.school_id = $1
      AND NOT EXISTS (
          SELECT 1 FROM streams s WHERE s.class_id = c.id
      )
    
    UNION ALL
    
    -- Get streams for classes that HAVE streams
    SELECT 
        c.id as class_id,
        c.name as class_name,
        s.id as stream_id,
        s.name as stream_name,
        'stream' as type,
        cl.id as class_level_id,
        cl.name as class_level_name
    FROM streams s
    INNER JOIN classes c ON s.class_id = c.id
    INNER JOIN departments d ON c.department_id = d.id
    INNER JOIN class_levels cl ON c.class_level_id = cl.id
    WHERE d.school_id = $1
    
    ORDER BY class_level_name, class_name, stream_name;
`;

export {
  CHECK_EMAIL_EXISTS,
  GET_USER_BY_EMAIL,
  CREATE_AUTH,
  GET_USER_PASSWORD,
  CREATE_STUDENT,
  CREATE_INTO_STUDENT_TABLE,
  CREATE_NOTIFICATION,
  CREATE_SINGLE_NOTIFICATION_RECEIPT,
  CREATE_BULK_NOTIFICATION_RECEIPTS,
  GET_CLASS_LEVELS,
  GET_DEPARTMENTS_NAME_AND_ID,
  CREATE_TEACHER,
  CREATE_INTO_TEACHER_TABLE,
  GET_SUBJECTS,
  CLASSES_WITH_STREAMS,
};
