import { Request, Response } from "express";
import * as schoolQueries from "./queries";
import * as userQueries from "../user/queries";
import { createSchoolSchema } from "../../schema/school";
import { ResponseStructure } from "../../utils/utils";
import pool from "../../config/db";

const createSchool = async (req: Request, res: Response) => {
  const {
    schoolName,
    schoolAddress,
    schoolEmail,
    schoolPhoneNumber,
    schoolType,
    country,
    timezone,
    academicYear,
    academicStartDate,
    academicEndDate,
    numberOfTermsOrSemesters,
    currentTermOrSemester,
  } = req.body;

  const gradingSystem = JSON.parse(req.body.gradingSystem);
  const schoolLogo = res.locals.secure_url;
  const admin = res.locals.user;

  if (admin.role !== "admin") {
    res.status(403).json(
      ResponseStructure({
        message: "You are not authorized to create a school.",
        code: 403,
        subCode: "UNAUTHORIZED",
        errors: [
          {
            errorMessage: "You are not authorized to create a school.",
            field: "unknown",
          },
        ],
      })
    );
    return;
  }

  try {
    await createSchoolSchema
      .validate({
        schoolName,
        schoolAddress,
        schoolEmail,
        schoolPhoneNumber,
        schoolType,
        country,
        timezone,
        academicYear,
        academicStartDate,
        academicEndDate,
        numberOfTermsOrSemesters,
        currentTermOrSemester,
        gradingSystem,
        schoolLogo,
      })
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

    const schoolExist = await pool.query(schoolQueries.CHECK_SCHOOL_EXISTS, [
      schoolName,
    ]);
    if (schoolExist.rows[0]) {
      res.status(400).json(
        ResponseStructure({
          message: "School already exists.",
          code: 400,
          subCode: "FOUND",
          errors: [
            {
              errorMessage: "School already exists.",
              field: "unknown",
            },
          ],
        })
      );
      return;
    }

    const result = await pool.query(schoolQueries.CREATE_SCHOOL, [
      admin.id,
      schoolName,
      schoolLogo || null,
      schoolPhoneNumber,
      schoolEmail,
      schoolAddress,
      schoolType,
      country,
      timezone,
      academicYear,
      academicStartDate,
      academicEndDate,
      currentTermOrSemester,
      Number(numberOfTermsOrSemesters),
    ]);
    if (!result.rows[0]) {
      res.status(400).json(
        ResponseStructure({
          message: "An error happened while creating school.",
          code: 400,
          subCode: "SCHOOL_CREATION_ERROR",
          errors: [
            {
              errorMessage: "An error happened while creating school",
              field: "unknown",
            },
          ],
        })
      );
    }
    const schoolId = result.rows[0].id;

    if (gradingSystem?.length > 0) {
      try {
        await Promise.all(
          gradingSystem.map((grade: any) =>
            pool.query(schoolQueries.CREATE_GRADES, [
              schoolId,
              Number(grade.min),
              Number(grade.max),
              grade.grade,
              grade.remark,
            ])
          )
        );
      } catch (error) {
        console.error(error);
        res.status(400).json(
          ResponseStructure({
            message: "Error while creating school grades",
            code: 400,
            subCode: "SCHOOL_GRADES_ERROR",
            errors: [
              {
                errorMessage: "Error while creating school grades",
                field: "unknown",
              },
            ],
          })
        );
      }
    }

    const updateUserSchool = await pool.query(userQueries.UPDATE_USER_SCHOOL, [
      schoolId,
      admin.id,
    ]);
    const user = updateUserSchool.rows[0];

    res.status(200).json(
      ResponseStructure({
        message: "School onboarded successfully",
        code: 200,
        subCode: "SCHOOL_ONBOARDING_SUCCESS",
        data: {
          is_onboarded: user.is_onboarded,
          schoolId,
        },
        errors: null,
      })
    );
  } catch (error) {
    res.status(500).json(
      ResponseStructure({
        message: "Internal server error",
        code: 500,
        subCode: "INTERNAL_ERROR",
        errors: [
          {
            field: "server",
            errorMessage: "Something went. Please try again later.",
          },
        ],
      })
    );
  }
};

export { createSchool };
