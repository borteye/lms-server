require("dotenv").config();

import { Request, Response } from "express";
import { ResponseStructure } from "../../../utils/utils";
import pool from "../../../config/db";
import * as classQueries from "../queries/classes.queries";

const createClassroom = async (req: Request, res: Response) => {
  const { name, department, classTeacher, level } = req.body;

  try {
    let nameExits;
    if (classTeacher) {
      nameExits = await pool.query(classQueries.CHECK_CLASS_NAME_EXIST_1, [
        name,
        Number(level),
        classTeacher,
      ]);
      if (nameExits.rows.length > 0) {
        return res.status(400).json(
          ResponseStructure({
            message: "Class name already exists.",
            code: 400,
            subCode: "NAME_EXISTS",
            errors: [
              {
                field: "name",
                errorMessage: "Class name already exists.",
              },
            ],
          })
        );
      }
    } else if (!classTeacher) {
      const nameExits = await pool.query(
        classQueries.CHECK_CLASS_NAME_EXIST_2,
        [name, Number(level)]
      );
      if (nameExits.rows.length > 0) {
        return res.status(400).json(
          ResponseStructure({
            message: "Class name already exists.",
            code: 400,
            subCode: "NAME_EXISTS",
            errors: [
              {
                field: "name",
                errorMessage: "Class name already exists.",
              },
            ],
          })
        );
      }
    }

    const classroom = await pool.query(classQueries.CREATE_CLASSROOM, [
      name,
      Number(department),
      Number(classTeacher) || null,
      Number(level),
    ]);
    if (!classroom.rows.length) {
      return res.status(500).json(
        ResponseStructure({
          message: "Error creating classroom.",
          code: 500,
          subCode: "CREATE_FAILED",
          errors: [
            {
              errorMessage: "Error creating classroom.",
              field: "server",
            },
          ],
        })
      );
    }

    return res.status(200).json(
      ResponseStructure({
        message: "Classroom created successfully.",
        code: 200,
        subCode: "SUCCESS",
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

const updateClassroom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, departmentId, classTeacher, classLevelId } = req.body;

  try {
    const classroom = await pool.query(classQueries.UPDATE_CLASSROOM, [
      id,
      name,
      departmentId,
      classTeacher || null,
      classLevelId,
    ]);
    if (!classroom.rows.length) {
      return res.status(500).json(
        ResponseStructure({
          message: "Error updating classroom.",
          code: 500,
          subCode: "UPDATE_FAILED",
          errors: [
            {
              errorMessage: "Error updating classroom.",
              field: "server",
            },
          ],
        })
      );
    }

    return res.status(200).json([
      ResponseStructure({
        message: "Classroom updated successfully.",
        code: 200,
        subCode: "SUCCESS",
      }),
    ]);
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

export { createClassroom, updateClassroom };
