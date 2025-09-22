import { Request, Response } from "express";
import { EnhancedRequest } from "../../../types/shared";
import {
  academicStructureSchema,
  configurationSchema,
  schoolProfileSchema,
} from "../../../schema/school";
import {
  generateAccessToken,
  generatePassword,
  ResponseStructure,
} from "../../../utils/utils";
import * as schoolQueries from "../queries/school.queries";
import * as userQueries from "../queries/user.queries";
import * as commonQueries from "../../common/queries";
import pool from "../../../config/db";
import {
  addFailedInsertionToInvalidData,
  createAndUploadInvalidDataExcel,
  validateData,
} from "../../../helpers/validateExcelData";
import { hashValue } from "../../../helpers/bcrypt";
import {
  studentCreationMailOptions,
  teacherCreationMailOptions,
  transporter,
} from "../../../helpers/mailer";
import {
  createNotification,
  createSingleReceipt,
} from "../../../helpers/notification";
import {
  studentSingleRegisterSchema,
  teacherSingleRegisterSchema,
} from "../../../schema/common";

const createStudent = async (req: Request, res: Response) => {
  const { first_name, last_name, phoneNumber, contactEmail, class_id, stream } =
    req.body;
  const user = res.locals.user;

  try {
    await studentSingleRegisterSchema
      .safeParseAsync({
        first_name,
        last_name,
        contactEmail,
        phoneNumber,
        class_id,

        stream,
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
    const student = await pool.query(commonQueries.CREATE_STUDENT, [
      first_name,
      last_name,
      phoneNumber,
      contactEmail,
      "student",
      user?.schoolId,
    ]);
    if (!student) {
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
    const studentId = student.rows[0].id;

    const password = generatePassword();
    const hashedPassword = await hashValue(password);
    if (hashedPassword) {
      await pool.query(commonQueries.CREATE_AUTH, [studentId, hashedPassword]);
    }

    await pool.query(commonQueries.CREATE_INTO_STUDENT_TABLE, [
      studentId,
      class_id || null,
      stream || null,
    ]);

    try {
      const result = await transporter.sendMail(
        studentCreationMailOptions({
          email: contactEmail,
          name: first_name,
          link: "http://localhost:3001/sign-in",
          password,
        })
      );

      if (result?.accepted?.length > 0) {
        return res.status(200).json(
          ResponseStructure({
            message: "Student created successfully.",
            code: 200,
            subCode: "SUCCESS",
          })
        );
      }
    } catch (error) {
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

export { createStudent };
