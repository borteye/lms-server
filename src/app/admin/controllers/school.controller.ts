require("dotenv").config();

import { NextFunction, Request, Response } from "express";
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
  transporter,
} from "../../../helpers/mailer";
import {
  createNotification,
  createSingleReceipt,
} from "../../../helpers/notification";

const createSchool = async (req: EnhancedRequest, res: Response) => {
  const {
    schoolId,
    schoolName,
    institutionType,
    address,
    city,
    state,
    zipCode,
    country,
    contactEmail,
    phoneNumber,
    website,
    socialMedia,
  } = req.body;
  const user = res.locals.user;
  if (req.uploadResult && req.uploadResult.type === "image") {
    req.uploadResult.data.secure_url;
  }

  try {
    await schoolProfileSchema
      .safeParseAsync({
        schoolName,
        institutionType,
        address,
        city,
        state,
        zipCode,
        country,
        contactEmail,
        phoneNumber,
        website,
        socialMedia,
      })
      .catch((err) => {
        if (err) {
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

    if (!schoolId) {
      const existingSchool = await pool.query(
        schoolQueries.CHECK_SCHOOL_MAIL_EXISTS,
        [contactEmail]
      );
      if (existingSchool.rows.length > 0) {
        return res.status(400).json(
          ResponseStructure({
            message: "School email already exists.",
            code: 400,
            subCode: "EMAIL_EXISTS",
            errors: [
              {
                errorMessage: "Email already exists.",
                field: "email",
              },
            ],
          })
        );
      }

      const result = await pool.query(schoolQueries.CREATE_SCHOOL, [
        schoolName,
        institutionType,
        address,
        city,
        state,
        zipCode,
        country,
        contactEmail,
        phoneNumber,
        website || null,
        socialMedia || null,
        req.uploadResult?.data.secure_url || null,
      ]);
      if (result.rows.length === 0) {
        return res.status(500).json(
          ResponseStructure({
            message: "Failed to create school.",
            code: 500,
            subCode: "CREATION_FAILED",
            errors: [
              {
                errorMessage: "Failed to create school.",
                field: "server",
              },
            ],
          })
        );
      }

      const newSchoolId = result.rows[0].id;

      const updateUserSchoolResult = await pool.query(
        userQueries.UPDATE_USER_SCHOOL,
        [newSchoolId, user.id]
      );
      if (updateUserSchoolResult.rows.length === 0) {
        return res.status(500).json(
          ResponseStructure({
            message: "Failed to update user school.",
            code: 500,
            subCode: "UPDATE_FAILED",
            errors: [
              {
                errorMessage: "Failed to update user school.",
                field: "server",
              },
            ],
          })
        );
      }

      return res.status(201).json(
        ResponseStructure({
          message: "School created successfully.",
          code: 201,
          subCode: "CREATION_SUCCESS",
          data: { metaData: { schoolId: newSchoolId } },
        })
      );
    } else if (schoolId) {
      const result = await pool.query(schoolQueries.UPDATE_SCHOOL, [
        schoolId,
        schoolName,
        institutionType,
        address,
        city,
        state,
        zipCode,
        country,
        contactEmail,
        phoneNumber,
        website || null,
        socialMedia || {},
        req.uploadResult?.data.secure_url || null,
      ]);
      if (result.rows.length === 0) {
        return res.status(500).json(
          ResponseStructure({
            message: "Failed to update school.",
            code: 500,
            subCode: "UPDATE_FAILED",
            errors: [
              {
                errorMessage: "Failed to update school.",
                field: "server",
              },
            ],
          })
        );
      }
      return res.status(200).json(
        ResponseStructure({
          message: "School created successfully.",
          code: 200,
          subCode: "UPDATE_SUCCESS",
          data: { metaData: schoolId },
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

const createAcademicStructure = async (req: Request, res: Response) => {
  const {
    schoolId,
    levelSystem,
    departments,
    subjects,
    academicYearStart,
    academicYearEnd,
    termSystem,
    terms,
    currentTerm,
  } = req.body;

  console.log(
    schoolId,
    levelSystem,
    departments,
    subjects,
    academicYearStart,
    academicYearEnd,
    termSystem,
    terms,
    currentTerm
  );

  try {
    await academicStructureSchema
      .safeParseAsync({
        levelSystem,
        departments,
        subjects,
        academicYearStart,
        academicYearEnd,
        termSystem,
        terms,
        currentTerm,
      })
      .catch((err) => {
        if (err) {
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

    console.log(
      Number(schoolId),
      academicYearStart,
      academicYearEnd,
      termSystem,
      currentTerm
    );

    console.log("start academic structure");
    const academicStructureResult = await pool.query(
      schoolQueries.CREATE_ACADEMIC_STRUCTURE,
      [
        Number(schoolId),
        academicYearStart,
        academicYearEnd,
        termSystem,
        currentTerm,
      ]
    );
    if (academicStructureResult.rows.length === 0) {
      return res.status(500).json(
        ResponseStructure({
          message: "Failed to create academic structure.",
          code: 500,
          subCode: "CREATION_FAILED",
          errors: [
            {
              errorMessage: "Failed to create academic structure.",
              field: "server",
            },
          ],
        })
      );
    }
    console.log("end academic structure");
    const academicStructureId = academicStructureResult.rows[0].id;
    console.log("academicStructureId", academicStructureId);
    try {
      if (departments && departments.length > 0) {
        for (const dept of departments) {
          await pool.query(schoolQueries.CREATE_DEPARTMENT, [
            Number(schoolId),
            dept,
          ]);
        }
      }
      if (subjects && subjects.length > 0) {
        for (const subject of subjects) {
          console.log("subjects", subjects);
          await pool.query(schoolQueries.CREATE_SUBJECTS, [
            Number(schoolId),
            subject,
          ]);
        }
      }
      if (terms && terms.length > 0) {
        for (const term of terms) {
          console.log("subjects", terms);
          if (term.name && term.startDate && term.endDate) {
            await pool.query(schoolQueries.CREATE_TERMS, [
              academicStructureId,
              term.name,
              term.startDate,
              term.endDate,
            ]);
          }
        }
      }
    } catch (error) {
      console.error("Error creating departments, subjects, or terms:", error);
      return res.status(500).json(
        ResponseStructure({
          message: "Failed to create academic structure details.",
          code: 500,
          subCode: "CREATION_FAILED",
          errors: [
            {
              errorMessage: "Failed to create academic structure details.",
              field: "server",
            },
          ],
        })
      );
    }
    return res.status(200).json(
      ResponseStructure({
        message: "Academic structure created successfully.",
        code: 200,
        subCode: "CREATION_SUCCESS",
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

const createGradingSystem = async (req: Request, res: Response) => {
  const { schoolId, gradingSystem, gradeScale, passingGrade, timezone } =
    req.body;
  console.log(schoolId, gradingSystem, gradeScale, passingGrade, timezone);
  try {
    await configurationSchema
      .safeParseAsync({
        gradingSystem,
        gradeScale,
        passingGrade,
        timezone,
      })
      .catch((err) => {
        if (err) {
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

    const gradingSystemResult = await pool.query(
      schoolQueries.CREATE_GRADING_SYSTEM,
      [schoolId, gradingSystem, passingGrade]
    );
    if (gradingSystemResult.rows.length === 0) {
      return res.status(500).json(
        ResponseStructure({
          message: "Failed to create grading system.",
          code: 500,
          subCode: "CREATION_FAILED",
          errors: [
            {
              errorMessage: "Failed to create grading system.",
              field: "server",
            },
          ],
        })
      );
    }
    const gradingSystemId = gradingSystemResult.rows[0].id;

    try {
      if (gradeScale && gradeScale.length > 0) {
        for (const grade of gradeScale) {
          await pool.query(schoolQueries.CREATE_GRADE_SCALES, [
            gradingSystemId,
            grade.grade,
            Number(grade.minPercentage) || 0,
            Number(grade.maxPercentage) || 0,
            grade.remark || null,
          ]);
        }
      }
    } catch (error) {
      console.error("Error creating grade scale:", error);
      return res.status(500).json(
        ResponseStructure({
          message: "Failed to create grade scale.",
          code: 500,
          subCode: "CREATION_FAILED",
          errors: [
            {
              errorMessage: "Failed to create grade scale.",
              field: "server",
            },
          ],
        })
      );
    }

    return res.status(200).json(
      ResponseStructure({
        message: "Grading system created successfully.",
        code: 200,
        subCode: "CREATION_SUCCESS",
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

const successOnboarding = async (req: EnhancedRequest, res: Response) => {
  try {
    const { schoolId } = req.body;
    const user = res.locals.user;

    const updateUserOnboardingStatus = await pool.query(
      userQueries.UPDATE_USER_ONBOARDING_STATUS,
      [user?.id]
    );
    if (updateUserOnboardingStatus.rows.length === 0) {
      return res.status(500).json(
        ResponseStructure({
          message: "Error onboarding user.",
          code: 500,
          subCode: "CREATION_FAILED",
          errors: [
            {
              errorMessage: "Error onboarding user.",
              field: "server",
            },
          ],
        })
      );
    }

    const data = {
      id: user.id,
      role: user.role,
      schoolId: Number(schoolId),
    };

    const accessToken = generateAccessToken(data);
    if (!accessToken) {
      return res.status(500).json(
        ResponseStructure({
          message: "Error onboarding user.",
          code: 500,
          subCode: "CREATION_FAILED",
          errors: [
            {
              errorMessage: "Error onboarding user.",
              field: "server",
            },
          ],
        })
      );
    }

    res.status(200).json(
      ResponseStructure({
        message: "Onboarding completed successfully.",
        code: 200,
        data: {
          accessToken,
          metaData: {
            id: user.id,
            role: user.role,
            schoolId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        },
        subCode: "CREATION_SUCCESS",
      })
    );

    if (req.uploadResult && req.uploadResult.type === "excel") {
      setImmediate(async () => {
        await createStudents(req, Number(schoolId), user.id);
      });
    } else {
      return;
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

const createStudents = async (
  req: EnhancedRequest,
  schoolId: number,
  userId: number
) => {
  console.log("Starting background student creation...");

  if (req.uploadResult && req.uploadResult.type === "excel") {
    const students = req.uploadResult.data;
    console.log(`Processing ${students.length} students`);

    // Validate the data
    const { validData, invalidData } = validateData(students);
    console.log(`Valid: ${validData.length}, Invalid: ${invalidData.length}`);

    let successfulInsertions = 0;
    let failedInsertions = 0;

    // Process valid data - insert into database
    for (let i = 0; i < validData.length; i++) {
      const student = validData[i];
      const originalRowNumber = i + 2; // +2 because index starts at 0 and we skip header row

      try {
        const result = await pool.query(commonQueries.CREATE_STUDENT, [
          student.firstName,
          student.lastName,
          student.contactPhoneNumber,
          student.contactEmail,
          "student",
          schoolId,
        ]);
        const studentId = result.rows[0].id;

        const password = generatePassword();
        const hashedPassword = await hashValue(password);
        if (hashedPassword) {
          await pool.query(commonQueries.CREATE_AUTH, [
            studentId,
            hashedPassword,
          ]);
        }

        try {
          const result = await transporter.sendMail(
            studentCreationMailOptions({
              email: student.contactEmail,
              name: student.firstName,
              link: "http://localhost:3001/sign-in",
              password,
            })
          );

          if (result?.accepted?.length > 0) {
            console.log(`Email sent to ${student.contactEmail}`);
          }
        } catch (error) {
          console.error(
            `Failed to send email to ${student.contactEmail}:`,
            error
          );
        }

        successfulInsertions++;
      } catch (insertionError) {
        console.error(
          `Failed to insert student at row ${originalRowNumber}:`,
          insertionError
        );
        // Add failed insertion to invalid data
        addFailedInsertionToInvalidData(
          invalidData,
          student,
          originalRowNumber,
          insertionError instanceof Error
            ? insertionError.message
            : "Unknown error"
        );

        failedInsertions++;
      }
    }

    // Create and upload Excel file for invalid data if any exist
    if (invalidData.length > 0) {
      try {
        const invalidDataFileUrl =
          await createAndUploadInvalidDataExcel(invalidData);
        if (invalidDataFileUrl) {
          const notificationId = await createNotification({
            schoolId: schoolId,
            userId: userId,
            title: "Errors in uploaded file",
            message: "There were invalid data in the uploaded file",
            metadata: {
              validData: validData.length,
              invalidData: invalidData.length,
            },
            file_url: invalidDataFileUrl,
            type: "upload",
          });

          await createSingleReceipt(notificationId, userId);
          return;
        }
        console.log("invalidDataFileUrl", invalidDataFileUrl);
      } catch (uploadError) {
        console.error("Failed to upload invalid data file:", uploadError);
      }
    } else {
    }
  }
};

export {
  createSchool,
  createAcademicStructure,
  createGradingSystem,
  successOnboarding,
};
