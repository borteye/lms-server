import { Request, Response } from "express";
import {
  generatePassword,
  ResponseStructure
} from "../../../utils/utils";
import * as commonQueries from "../../common/queries";
import pool from "../../../config/db";
import { hashValue } from "../../../helpers/bcrypt";
import {
  teacherCreationMailOptions,
  transporter
} from "../../../helpers/mailer";
import { teacherSingleRegisterSchema } from "../../../schema/common";

const createTeacher = async (req: Request, res: Response) => {
  const {
    first_name,
    last_name,
    contactEmail,
    phoneNumber,
    department,
    qualifications,
  } = req.body;
  const user = res.locals.user;

  try {
    await teacherSingleRegisterSchema
      .safeParseAsync({
        first_name,
        last_name,
        contactEmail,
        phoneNumber,
        department,
        qualifications,
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          return res.status(400).json(
            ResponseStructure({
              message: "Invalid request data.",
              code: 400,
              subCode: "VALIDATION_ERROR",
              errors: [
                {
                  errorMessage: "Invalid request data.",
                  field: "unknown",
                },
              ],
            })
          );
        }
      });

    const emailExist = await pool.query(commonQueries.CHECK_EMAIL_EXISTS, [
      contactEmail,
    ]);
    if (emailExist.rows[0]) {
      return res.status(400).json(
        ResponseStructure({
          message: "Email has already been taken.",
          code: 400,
          subCode: "FOUND",
          errors: [
            {
              errorMessage: "Email has already been taken.",
              field: "email",
            },
          ],
        })
      );
    }
    const teacher = await pool.query(commonQueries.CREATE_TEACHER, [
      first_name,
      last_name,
      phoneNumber,
      contactEmail,
      "teacher",
      user?.schoolId,
    ]);
    if (!teacher) {
      return res.status(500).json(
        ResponseStructure({
          message: "Error creating user",
          code: 500,
          subCode: "INTERNAL_ERROR",
          errors: [
            {
              field: "server",
              errorMessage: "Something went wrong. Please try again later.",
            },
          ],
        })
      );
    }
    const teacherId = teacher.rows[0].id;

    const password = generatePassword();
    const hashedPassword = await hashValue(password);
    if (hashedPassword) {
      await pool.query(commonQueries.CREATE_AUTH, [teacherId, hashedPassword]);
    }

    const pgArray = `{${qualifications.join(", ")}}`;

    await pool.query(commonQueries.CREATE_INTO_TEACHER_TABLE, [
      teacherId,
      pgArray || null,
      department || null,
    ]);

    try {
      const result = await transporter.sendMail(
        teacherCreationMailOptions({
          email: contactEmail,
          name: first_name,
          link: `${process.env.TEACHER_BASE_URL}/sign-in`,
          password,
        })
      );

      if (result?.accepted?.length > 0) {
        return res.status(200).json(
          ResponseStructure({
            message: "Teacher created successfully.",
            code: 200,
            subCode: "SUCCESS",
          })
        );
      }
    } catch (error) {
      console.log("error sending mail");
      return res.status(500).json(
        ResponseStructure({
          message: "Internal server error",
          code: 500,
          subCode: "INTERNAL_ERROR",
          errors: [
            {
              field: "server",
              errorMessage: "Something went wrong. Please try again later.",
            },
          ],
        })
      );
    }
  } catch (error) {
    console.log("error sending mail");
    return res.status(500).json(
      ResponseStructure({
        message: "Internal server error",
        code: 500,
        subCode: "INTERNAL_ERROR",
        errors: [
          {
            field: "server",
            errorMessage: "Something went wrong. Please try again later.",
          },
        ],
      })
    );
  }
};

export { createTeacher };
