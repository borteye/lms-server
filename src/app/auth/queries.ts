const CHECK_EMAIL_EXISTS = "SELECT 1 FROM users WHERE email = $1 LIMIT 1";
const GET_USER_CREDENTIALS_BY_EMAIL =
  "SELECT u.id, u.email, u.name, u.role, u.is_onboarded, u.created_at, u.updated_at, a.password FROM users u JOIN auth a ON u.id = a.user_id WHERE u.email = $1";
const CREATE_USER =
  "INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING *";
const CREATE_AUTH = "INSERT INTO auth (user_id, password) VALUES ($1, $2)";

export {
  CHECK_EMAIL_EXISTS,
  GET_USER_CREDENTIALS_BY_EMAIL,
  CREATE_USER,
  CREATE_AUTH,
};
