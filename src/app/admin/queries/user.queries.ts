const CREATE_ADMIN =
  "INSERT INTO users (first_name, last_name, phone_number, email, role) VALUES ($1, $2, $3, $4, $5) RETURNING id";

const UNONBOARDED_ADMINS_72_HOURS =
  "SELECT id, school_id, email, first_name FROM users WHERE role = 'admin' AND onboarded = false AND created_at >= NOW() - INTERVAL '72 hours' AND created_at < NOW() - INTERVAL '71 hours'";
const DELETE_UNONBOARDED_ADMINS = "DELETE FROM users WHERE id = ANY($1::int[])";
const DELETE_UNONBOARDED_ADMIN_SCHOOL =
  "DELETE FROM schools WHERE id = ANY($1::int[])";
const UNONBOARDED_ADMINS_DETAILS =
  "SELECT u.id, u.email, u.created_at, s.school_name FROM users u JOIN schools s ON u.school_id = s.id WHERE u.role = 'admin' AND u.onboarded = false";
const UPDATE_USER_SCHOOL =
  "UPDATE users SET school_id = $1 WHERE id = $2 RETURNING id";
const UPDATE_USER_ONBOARDING_STATUS =
  "UPDATE users SET onboarded = TRUE WHERE id = $1 RETURNING id";

export {
  CREATE_ADMIN,
  UNONBOARDED_ADMINS_72_HOURS,
  DELETE_UNONBOARDED_ADMINS,
  DELETE_UNONBOARDED_ADMIN_SCHOOL,
  UNONBOARDED_ADMINS_DETAILS,
  UPDATE_USER_SCHOOL,
  UPDATE_USER_ONBOARDING_STATUS,
};
