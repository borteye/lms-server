const CHECK_EMAIL_EXISTS = "SELECT 1 FROM users WHERE email = $1 LIMIT 1";
const GET_USER_BY_EMAIL = "SELECT * FROM users WHERE email = $1  LIMIT 1";
const CREATE_AUTH = "INSERT INTO auth (user_id, password) VALUES ($1, $2)";
const GET_USER_PASSWORD =
  "SELECT password FROM auth WHERE user_id = $1 LIMIT 1";
const CREATE_STUDENT =
  "INSERT INTO users (first_name, last_name, phone_number, email, role, school_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";
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

export {
  CHECK_EMAIL_EXISTS,
  GET_USER_BY_EMAIL,
  CREATE_AUTH,
  GET_USER_PASSWORD,
  CREATE_STUDENT,
  CREATE_NOTIFICATION,
  CREATE_SINGLE_NOTIFICATION_RECEIPT,
  CREATE_BULK_NOTIFICATION_RECEIPTS,
  GET_CLASS_LEVELS,
  GET_DEPARTMENTS_NAME_AND_ID,
};
