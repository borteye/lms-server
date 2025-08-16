const UPDATE_USER_SCHOOL =
  "UPDATE users SET school_id = $1, is_onboarded = TRUE WHERE id = $2 RETURNING *";

export { UPDATE_USER_SCHOOL };
