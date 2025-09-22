require("dotenv").config();

import * as userQueries from "../queries/user.queries";
import pool from "../../../config/db";
import {
  transporter,
  adminUnOnboardingDeleteMailOptions,
} from "../../../helpers/mailer";

const link = `${process.env.BASE_URL}/sign-up`;

const cronDeleteUnonboardedAdminAccounts = async () => {
  const { rows } = await pool.query(userQueries.UNONBOARDED_ADMINS_72_HOURS);

  if (rows.length > 0) {
    const ids = rows.map((row) => row.id);
    const schoolIds = rows
      .map((row) => row.school_id)
      .filter((schoolId) => schoolId !== null);

    const recipients = rows.map((row) => ({
      email: row.email,
      name: row.first_name,
    }));

    try {
      const deletedAdmins = await pool.query(
        userQueries.DELETE_UNONBOARDED_ADMINS,
        [ids]
      );

      const deletedSchools = await pool.query(
        userQueries.DELETE_UNONBOARDED_ADMIN_SCHOOL,
        [schoolIds]
      );

      for (const { email, name } of recipients) {
        const result = await transporter.sendMail(
          adminUnOnboardingDeleteMailOptions({
            name,
            email,
            link,
          })
        );

        // optional logging
        if (result?.accepted?.length > 0) {
          console.log(`Mail sent successfully to ${name} <${email}>`);
        }
      }

      console.log(
        `Deleted ${deletedAdmins.rowCount} unonboarded admin accounts and ${deletedSchools.rowCount} schools.`
      );

      return;
    } catch (error) {
      console.error("Error sending mail:", error);
    }
  } else {
    console.log("No unonboarded admins found.");
  }
};

export { cronDeleteUnonboardedAdminAccounts };
