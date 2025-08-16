const CREATE_SCHOOL =
  "INSERT INTO schools (admin_id, name, logo, phone_number, email, address, type, country, country_timezone, academic_year, academic_start_date, academic_end_date, current_term_or_semester, num_terms_or_semesters) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *";
const CREATE_GRADES =
  "INSERT INTO grades (school_id, min_score, max_score, grade, remark) VALUES ($1, $2, $3, $4, $5)";
const CHECK_SCHOOL_EXISTS = "SELECT 1 FROM schools WHERE name = $1 LIMIT 1";

export { CREATE_SCHOOL, CREATE_GRADES, CHECK_SCHOOL_EXISTS };
