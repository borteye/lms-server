const CREATE_ADMIN =
  "INSERT INTO users (first_name, last_name, phone_number, role, school_id) VALUES ($1, $2, $3, $4, $5) RETURNING id";
const CREATE_AUTH = "INSERT INTO auth (user_id, password) VALUES ($1, $2)";

export { CREATE_ADMIN, CREATE_AUTH };
