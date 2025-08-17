import { Request, Response } from "express";
import * as queries from "./queries";

import pool from "../../config/db";
import { compareValue, hashValue } from "../../helpers/bcrypt";
import { signInSchema, signUpSchema } from "../../schema/auth-schema";
import { IUser } from "../../types/user";
import { generateAccessToken, ResponseStructure } from "../../utils/utils";

const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    await signInSchema.validate({ email, password }).catch((err) => {
      if (err) console.log("Invalid request data.", err);
      res.status(400).json(
        ResponseStructure({
          message: "Invalid request data.",
          code: 400,
          subCode: "VALIDATION_ERROR",
          errors: [{ errorMessage: "Invalid request data.", field: "unknown" }],
        })
      );
      return;
    });

    const emailExist = await pool.query(queries.CHECK_EMAIL_EXISTS, [email]);
    if (!emailExist.rows[0]) {
      console.log("Invalid email or password");
      res.status(404).json(
        ResponseStructure({
          message: "Invalid email or password",
          code: 404,
          subCode: "NOT_FOUND",
          errors: [
            {
              errorMessage: "Email & Password does not match with our record.",
              field: "unknown",
            },
          ],
        })
      );
      return;
    }

    const result = await pool.query(queries.GET_USER_CREDENTIALS_BY_EMAIL, [
      email,
    ]);

    const user: IUser = result.rows[0];

    const isPasswordValid = await compareValue(
      password,
      user.password as string
    );
    if (!isPasswordValid) {
      console.log("Invalid email or password");
      res.status(401).json(
        ResponseStructure({
          message: "Invalid email or password",
          code: 404,
          subCode: "NOT_FOUND",
          errors: [
            {
              errorMessage: "Email & Password does not match with our record.",
              field: "unknown",
            },
          ],
        })
      );
      return;
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      school_id: user.school_id,
      is_onboarded: user.is_onboarded,
    };

    const accessTokenPayload = {
      id: user.id,
      school_id: user.school_id,
      role: user.role,
    };
    const accessToken = generateAccessToken(accessTokenPayload);
    if (!accessToken) {
      console.log("Token generation failed");
      res.status(500).json(
        ResponseStructure({
          message: "Token generation failed",
          code: 500,
          subCode: "TOKEN_ERROR",
          errors: [
            {
              field: "token",
              errorMessage: "Could not generate access token",
            },
          ],
        })
      );
      return;
    }

    res.status(200).json(
      ResponseStructure({
        message: "Logged in successfully",
        code: 200,
        subCode: "LOGIN_SUCCESS",
        data: {
          user: userData,
          token: accessToken,
        },
        errors: null,
      })
    );
    return;
  } catch (error) {
    console.log("Internal server error", error);
    res.status(500).json(
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
    return;
  }
};

const signUp = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, passwordConfirmation, role } =
    req.body;

  const name = firstName + " " + lastName;
  try {
    await signUpSchema
      .validate({ firstName, lastName, email, password, passwordConfirmation })
      .catch((err) => {
        if (err)
          res.status(400).json(
            ResponseStructure({
              message: "Invalid request data.",
              code: 400,
              subCode: "VALIDATION_ERROR",
              errors: [
                { errorMessage: "Invalid request data.", field: "unknown" },
              ],
            })
          );
        return;
      });

    const emailExist = await pool.query(queries.CHECK_EMAIL_EXISTS, [email]);
    if (emailExist.rows[0]) {
      res.status(400).json(
        ResponseStructure({
          message: "Email has already been taken.",
          code: 400,
          subCode: "FOUND",
          errors: [
            {
              errorMessage: "Email has already been taken.",
              field: "unknown",
            },
          ],
        })
      );
      return;
    }

    const result = await pool.query(queries.CREATE_USER, [name, email, role]);
    const user: IUser = result.rows[0];

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      school_id: user.school_id,
      is_onboarded: user.is_onboarded,
    };

    const accessTokenPayload = {
      id: user.id,
      school_id: user.school_id,
      role: user.role,
    };
    const accessToken = generateAccessToken(accessTokenPayload);
    if (!accessToken) {
      res.status(500).json(
        ResponseStructure({
          message: "Token generation failed",
          code: 500,
          subCode: "TOKEN_ERROR",
          errors: [
            {
              field: "token",
              errorMessage: "Could not generate access token",
            },
          ],
        })
      );
      return;
    }

    const hashedPassword = await hashValue(password);
    await pool.query(queries.CREATE_AUTH, [user.id, hashedPassword]);

    res.status(200).json(
      ResponseStructure({
        message: "Account registered in successfully",
        code: 200,
        subCode: "SIGNUP_SUCCESS",
        data: {
          user: userData,
          token: accessToken,
        },
        errors: null,
      })
    );

    return;
  } catch (error) {
    res.status(500).json(
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

export { signIn, signUp };
