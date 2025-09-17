const CREATE_CLASSROOM =
  "INSERT INTO classes (name, department_id, class_teacher, class_level_id) VALUES ($1, $2, $3, $4) RETURNING id";
const UPDATE_CLASSROOM =
  "UPDATE classes SET name = $2, department_id = $3, class_teacher = $4, class_level_id = $5 WHERE id = $1 RETURNING id";
const CHECK_CLASS_NAME_EXIST_1 =
  "SELECT 1 FROM classes WHERE name ILIKE $1 AND class_level_id = $2 AND class_teacher = $3 LIMIT 1";
const CHECK_CLASS_NAME_EXIST_2 =
  "SELECT 1 FROM classes WHERE name ILIKE $1 AND class_level_id = $2 LIMIT 1";

export {
  CREATE_CLASSROOM,
  UPDATE_CLASSROOM,
  CHECK_CLASS_NAME_EXIST_1,
  CHECK_CLASS_NAME_EXIST_2,
};
