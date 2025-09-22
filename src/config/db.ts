require("dotenv").config();

import { Pool } from "pg";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// pool.connect();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "lms",
  password: "P@ssw0rd",
  port: 5432,
});

export default pool;
