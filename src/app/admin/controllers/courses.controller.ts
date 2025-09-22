require("dotenv").config();

import { Request, Response } from "express";
import { ResponseStructure } from "../../../utils/utils";
import pool from "../../../config/db";
import * as coursesQueries from "../queries/courses.queries";
import { createCourseSchema } from "../../../schema/common";

const createSubject = async (req: Request, res: Response) => {
  const { subjects } = req.body;
  const user = res.locals.user;

  try {
    if (!subjects || subjects.length === 0) {
      return res.status(400).json(
        ResponseStructure({
          message: "No subjects provided",
          code: 400,
          subCode: "INVALID_INPUT",
          errors: [
            {
              field: "subjects",
              errorMessage: "At least one subject is required",
            },
          ],
        })
      );
    }

    const existingSubjects: string[] = [];
    const newSubjects: string[] = [];
    const createdSubjects: string[] = [];
    const failedSubjects: { subject: string; error: string }[] = [];

    // First, check which subjects already exist
    for (const subject of subjects) {
      try {
        const subjectExist = await pool.query(coursesQueries.SUBJECT_EXISTS, [
          subject,
          user?.schoolId,
        ]);

        if (subjectExist.rows.length > 0) {
          existingSubjects.push(subject);
        } else {
          newSubjects.push(subject);
        }
      } catch (error) {
        failedSubjects.push({
          subject,
          error: "Failed to check subject existence",
        });
      }
    }

    // Create new subjects
    for (const subject of newSubjects) {
      try {
        await pool.query(coursesQueries.CREATE_SUBJECT, [
          Number(user?.schoolId),
          subject,
        ]);
        createdSubjects.push(subject);
      } catch (error) {
        failedSubjects.push({
          subject,
          error: "Failed to create subject",
        });
      }
    }

    // Prepare response based on results
    const hasCreatedSubjects = createdSubjects.length > 0;
    const hasExistingSubjects = existingSubjects.length > 0;
    const hasFailedSubjects = failedSubjects.length > 0;

    // If we have existing subjects, return error with details
    if (hasExistingSubjects) {
      const responseData: any = {
        message: hasCreatedSubjects
          ? "Some subjects already exist, others were created successfully"
          : "Subject(s) already exist",
        code: hasCreatedSubjects ? 207 : 400, // 207 Multi-Status for partial success
        subCode: hasCreatedSubjects ? "PARTIAL_SUCCESS" : "EXIST",
        data: {
          existingSubjects,
          ...(hasCreatedSubjects && { createdSubjects }),
          ...(hasFailedSubjects && { failedSubjects }),
        },
        errors: [
          {
            field: "subjects",
            errorMessage: `The following subjects already exist: ${existingSubjects.join(", ")}`,
          },
        ],
      };

      return res
        .status(responseData.code)
        .json(ResponseStructure(responseData));
    }

    // If only new subjects were processed
    if (hasCreatedSubjects) {
      const responseData: any = {
        message: "Subject(s) created successfully",
        code: 200,
        subCode: "SUCCESS",
        data: {
          createdSubjects,
          ...(hasFailedSubjects && { failedSubjects }),
        },
      };

      // If some subjects failed, adjust the response
      if (hasFailedSubjects) {
        responseData.message =
          "Some subjects created successfully, others failed";
        responseData.code = 207;
        responseData.subCode = "PARTIAL_SUCCESS";
        responseData.errors = [
          {
            field: "subjects",
            errorMessage: `Failed to process: ${failedSubjects.map((f) => f.subject).join(", ")}`,
          },
        ];
      }

      return res
        .status(responseData.code)
        .json(ResponseStructure(responseData));
    }

    // If all subjects failed
    return res.status(400).json(
      ResponseStructure({
        message: "Failed to create any subjects",
        code: 400,
        subCode: "CREATION_FAILED",
        data: { failedSubjects },
        errors: [
          {
            field: "subjects",
            errorMessage: "All subjects failed to be created",
          },
        ],
      })
    );
  } catch (error) {
    console.error("Unexpected error in createSubject:", error);
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

const createCourse = async (req: Request, res: Response) => {
  const {
    scope,
    subject,
    class: class_id,
    stream,
    teacher,
    class_assigned_subject_teacher,
  } = req.body;

  try {
    await createCourseSchema
      .safeParseAsync({
        scope,
        subject,
        class: class_id,
        stream,
        teacher,
        class_assigned_subject_teacher,
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
    if (scope === "class" || scope === "stream") {
      const courseExistInClass = await pool.query(coursesQueries.COURSE_EXIST, [
        Number(subject),
        Number(class_id),
        Number(stream),
      ]);

      if (courseExistInClass.rows.length > 0) {
        return res.status(400).json(
          ResponseStructure({
            message: "Course already exists in class.",
            code: 400,
            subCode: "EXIST",
            errors: [
              {
                errorMessage: "Course already exists in class.",
                field: "course",
              },
            ],
          })
        );
      }

      const result = await pool.query(coursesQueries.CREATE_COURSE, [
        scope,
        Number(class_id),
        Number(stream) || null,
        Number(subject),
      ]);
      if (!result.rows.length) {
        return res.status(400).json(
          ResponseStructure({
            message: "Failed to create course.",
            code: 400,
            subCode: "CREATION_FAILED",
            errors: [
              {
                errorMessage: "Failed to create course.",
                field: "course",
              },
            ],
          })
        );
      }

      const courseId = result.rows[0].id;

      const createdTeacherCourse = await pool.query(
        coursesQueries.CREATE_TEACHER_COURSE,
        [Number(teacher), courseId]
      );

      if (!createdTeacherCourse.rows.length) {
        return res.status(400).json(
          ResponseStructure({
            message: "Failed to create teacher course.",
            code: 400,
            subCode: "CREATION_FAILED",
            errors: [
              {
                errorMessage: "Failed to create teacher course.",
                field: "teacherCourse",
              },
            ],
          })
        );
      }

      return res.status(200).json(
        ResponseStructure({
          message: "Course created successfully.",
          code: 200,
          subCode: "SUCCESS",
        })
      );
    } else if (scope === "school") {
      if (
        class_assigned_subject_teacher &&
        class_assigned_subject_teacher.length > 0
      ) {
        for (const course of class_assigned_subject_teacher) {
          const result = await pool.query(coursesQueries.CREATE_COURSE, [
            scope,
            Number(course?.class),
            null,
            Number(subject),
          ]);
          if (!result.rows.length) {
            return res.status(400).json(
              ResponseStructure({
                message: "Failed to create course.",
                code: 400,
                subCode: "CREATION_FAILED",
                errors: [
                  {
                    errorMessage: "Failed to create course.",
                    field: "course",
                  },
                ],
              })
            );
          }

          const courseId = result.rows[0].id;

          const createdTeacherCourse = await pool.query(
            coursesQueries.CREATE_TEACHER_COURSE,
            [Number(course?.teacher), courseId]
          );

          if (!createdTeacherCourse.rows.length) {
            return res.status(400).json(
              ResponseStructure({
                message: "Failed to create teacher course.",
                code: 400,
                subCode: "CREATION_FAILED",
                errors: [
                  {
                    errorMessage: "Failed to create teacher course.",
                    field: "teacherCourse",
                  },
                ],
              })
            );
          }
        }

        return res.status(200).json(
          ResponseStructure({
            message: "Course created successfully.",
            code: 200,
            subCode: "SUCCESS",
          })
        );
      }
    }
  } catch (error) {
    console.error("Unexpected error in createSubject:", error);
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

export { createSubject, createCourse };
