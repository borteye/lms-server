import { Request, Response } from "express";
import { signInSchema } from "../../schema/auth-schema";
import { generateAccessToken, ResponseStructure } from "../../utils/utils";
import pool from "../../config/db";
import * as commonQueries from "./queries";
import { compareValue } from "../../helpers/bcrypt";

const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    await signInSchema.safeParseAsync({ email, password }).catch((err) => {
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
    if (!emailExist.rows.length) {
      return res.status(400).json(
        ResponseStructure({
          message: "Invalid email or password.",
          code: 400,
          subCode: "VALIDATION_ERROR",
          errors: [
            {
              errorMessage: "Invalid email or password.",
              field: "email",
            },
          ],
        })
      );
    }

    const user = await pool.query(commonQueries.GET_USER_BY_EMAIL, [email]);
    if (!user.rows.length) {
      return res.status(400).json(
        ResponseStructure({
          message: "Invalid email or password.",
          code: 400,
          subCode: "VALIDATION_ERROR",
          errors: [
            {
              errorMessage: "Invalid email or password.",
              field: "email",
            },
          ],
        })
      );
    }

    const data = {
      schoolId: user.rows[0].school_id,
      role: user.rows[0].role,
      id: user.rows[0].id,
    };

    const passwordResult = await pool.query(commonQueries.GET_USER_PASSWORD, [
      data.id,
    ]);
    if (!passwordResult.rows.length) {
      return res.status(400).json(
        ResponseStructure({
          message: "Invalid email or password.",
          code: 400,
          subCode: "VALIDATION_ERROR",
          errors: [
            {
              errorMessage: "Invalid email or password.",
              field: "password",
            },
          ],
        })
      );
    }

    const userPassword = passwordResult.rows[0].password;

    const passwordMatch = await compareValue(password, userPassword);
    if (!passwordMatch) {
      return res.status(400).json(
        ResponseStructure({
          message: "Invalid email or password.",
          code: 400,
          subCode: "VALIDATION_ERROR",
          errors: [
            {
              errorMessage: "Invalid email or password.",
              field: "password",
            },
          ],
        })
      );
    }

    const schoolDetails = await pool.query(commonQueries.GET_SCHOOL_DETAILS, [
      data.schoolId,
    ]);
    if (!schoolDetails.rows.length) {
      return res.status(400).json(
        ResponseStructure({
          message: "Invalid email or password.",
          code: 400,
          subCode: "VALIDATION_ERROR",
          errors: [
            {
              errorMessage: "Invalid email or password.",
              field: "password",
            },
          ],
        })
      );
    }

    const accessToken = generateAccessToken(data);
    if (!accessToken) {
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

    return res.status(200).json(
      ResponseStructure({
        message: "Sign in successfully.",
        code: 200,
        data: {
          accessToken,
          metaData: {
            id: data.id,
            role: data.role,
            schoolId: data.schoolId,
            schoolName: schoolDetails.rows[0].school_name,
            schoolLogo: schoolDetails.rows[0].logo,
            email: user.rows[0].email,
            firstName: user.rows[0].first_name,
            lastName: user.rows[0].last_name,
          },
        },
        subCode: "SIGN_IN_SUCCESS",
      })
    );
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

const getClassLevels = async (req: Request, res: Response) => {
  const user = res.locals.user;

  try {
    const classLevels = await pool.query(commonQueries.GET_CLASS_LEVELS, [
      user?.schoolId,
    ]);
    return res.status(200).json(
      ResponseStructure({
        message: "Success.",
        code: 200,
        subCode: "SUCCESS",
        data: classLevels.rows,
      })
    );
  } catch (error) {
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
    });
  }
};

const getDepartments = async (req: Request, res: Response) => {
  const user = res.locals.user;
  try {
    const schoolDepartments = await pool.query(
      commonQueries.GET_DEPARTMENTS_NAME_AND_ID,
      [user?.schoolId]
    );
    return res.status(200).json(
      ResponseStructure({
        message: "Success.",
        code: 200,
        subCode: "SUCCESS",
        data: schoolDepartments.rows,
      })
    );
  } catch (error) {
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
    });
  }
};

const getSubjects = async (req: Request, res: Response) => {
  const user = res.locals.user;
  try {
    const subjects = await pool.query(commonQueries.GET_SUBJECTS, [
      user?.schoolId,
    ]);
    if (!subjects.rows.length) {
      return res.status(404).json(
        ResponseStructure({
          message: "No subjects found",
          code: 404,
          subCode: "NOT_FOUND",
          errors: [
            {
              field: "subjects",
              errorMessage: "No subjects found",
            },
          ],
        })
      );
    }
    return res.status(200).json(
      ResponseStructure({
        message: "Success.",
        code: 200,
        subCode: "SUCCESS",
        data: subjects.rows,
      })
    );
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

const getClassesWithStreams = async (req: Request, res: Response) => {
  const user = res.locals.user;

  try {
    const result = await pool.query(commonQueries.CLASSES_WITH_STREAMS, [
      user?.schoolId,
    ]);
    if (result.rows.length === 0) {
      return res.status(400).json(
        ResponseStructure({
          message: "No class found.",
          code: 400,
          subCode: "NOT_FOUND",
          errors: [
            {
              field: "unknown",
              errorMessage: "No class found.",
            },
          ],
        })
      );
    }
    return res.status(200).json(
      ResponseStructure({
        message: "Success",
        code: 200,
        subCode: "SUCCESS",
        data: result.rows,
      })
    );
  } catch (error) {
    return ResponseStructure({
      message: "Internal server error",
      code: 500,
      subCode: "INTERNAL_ERROR",
      errors: [
        {
          field: "server",
          errorMessage: "Something went wrong. Please try again later.",
        },
      ],
    });
  }
};

export {
  signIn,
  getClassLevels,
  getDepartments,
  getSubjects,
  getClassesWithStreams,
};
