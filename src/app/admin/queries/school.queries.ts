const CREATE_SCHOOL =
  "INSERT INTO schools(school_name, institution_type, address, city, state, zip_code, country, contact_email, phone_number, website, social_media, logo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id";
const CHECK_SCHOOL_MAIL_EXISTS =
  "SELECT 1 FROM schools WHERE contact_email = $1 LIMIT 1";
const UPDATE_SCHOOL =
  "INSERT INTO schools(id, school_name, institution_type, address, city, state, zip_code, country, contact_email, phone_number, website, social_media, logo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (id) DO UPDATE SET school_name = EXCLUDED.school_name, institution_type = EXCLUDED.institution_type, address = EXCLUDED.address, city = EXCLUDED.city, state = EXCLUDED.state, zip_code = EXCLUDED.zip_code, country = EXCLUDED.country, contact_email = EXCLUDED.contact_email, phone_number = EXCLUDED.phone_number, website = EXCLUDED.website, social_media = EXCLUDED.social_media, logo = EXCLUDED.logo RETURNING id";
const CREATE_ACADEMIC_STRUCTURE =
  "INSERT INTO academic_structures(school_id, academic_year_start, academic_year_end, term_system, current_term) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (school_id) DO UPDATE SET academic_year_start = EXCLUDED.academic_year_start, academic_year_end = EXCLUDED.academic_year_end, term_system = EXCLUDED.term_system, current_term = EXCLUDED.current_term RETURNING id";
const CREATE_TERMS =
  "INSERT INTO terms(academic_structure_id, name, start_date, end_date) VALUES ($1, $2, $3, $4) ON CONFLICT (academic_structure_id, name) DO UPDATE SET start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date RETURNING id";
const CREATE_DEPARTMENT =
  "INSERT INTO departments(school_id, name) VALUES ($1, $2) ON CONFLICT (school_id, name) DO NOTHING RETURNING id";
const CREATE_SUBJECTS =
  "INSERT INTO subjects(school_id, name) VALUES ($1, $2) ON CONFLICT (school_id, name) DO NOTHING RETURNING id";
const CREATE_GRADING_SYSTEM =
  "INSERT INTO grading_systems(school_id, grading_type, minimum_passing_grade) VALUES ($1, $2, $3) ON CONFLICT (school_id) DO UPDATE SET grading_type = EXCLUDED.grading_type, minimum_passing_grade = EXCLUDED.minimum_passing_grade RETURNING id";
const CREATE_GRADE_SCALES =
  "INSERT INTO grade_scales(grading_system_id, grade, min_score, max_score, remark) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (grading_system_id, grade) DO UPDATE SET min_score = EXCLUDED.min_score, max_score = EXCLUDED.max_score, remark = EXCLUDED.remark RETURNING id";

export {
  CREATE_SCHOOL,
  UPDATE_SCHOOL,
  CREATE_ACADEMIC_STRUCTURE,
  CREATE_TERMS,
  CREATE_DEPARTMENT,
  CREATE_SUBJECTS,
  CREATE_GRADING_SYSTEM,
  CREATE_GRADE_SCALES,
  CHECK_SCHOOL_MAIL_EXISTS,
};
