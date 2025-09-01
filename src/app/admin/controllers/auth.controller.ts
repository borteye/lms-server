require("dotenv").config();

import { Request, Response } from "express";
import {
  generateEmailVerificationToken,
  ResponseStructure,
} from "../../../utils/utils";
import { adminRegisterSchema } from "../../../schema/auth-schema";
import pool from "../../../config/db";
import * as commonQueries from "../../common/queries";
import {
  adminOnboardingMailOptions,
  transporter,
} from "../../../helpers/mailer";
import { hashValue } from "../../../helpers/bcrypt";

const register = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    passwordConfirmation,
  } = req.body;

  try {
    await adminRegisterSchema
      .safeParseAsync({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        passwordConfirmation,
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
      email,
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

    const result = await pool.query(commonQueries.CREATE_USER, [
      firstName,
      lastName,
      phoneNumber,
      email,
      "admin",
    ]);
    if (!result) {
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
    const userId = result.rows[0].id;

    const hashedPassword = await hashValue(password);
    if (!hashedPassword) {
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

    const authResult = await pool.query(commonQueries.CREATE_AUTH, [
      userId,
      hashedPassword,
    ]);
    if (!authResult) {
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

    const data = {
      firstName,
      lastName,
      email,
      phoneNumber,
      role: "admin",
      id: userId,
    };
    const emailVerificationToken = generateEmailVerificationToken(data);
    if (!emailVerificationToken) {
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

    const link = `${process.env.BASE_URL}/onboarding?token=${emailVerificationToken}`;
    try {
      const result = await transporter.sendMail(
        adminOnboardingMailOptions({
          email,
          name: firstName,
          link,
        })
      );

      if (result?.accepted?.length > 0) {
        return res.status(200).json(
          ResponseStructure({
            message:
              "An email has been sent to your email. Please check to complete your onboarding.",
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

export { register };
