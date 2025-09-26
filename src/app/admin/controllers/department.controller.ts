require("dotenv").config();

import { Request, Response } from "express";
import { ResponseStructure } from "../../../utils/utils";
import pool from "../../../config/db";
import * as departmentQueries from "../queries/department.queries";

const createDepartment = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const { name, headOfDepartment, departmentCode } = req.body;

  try {
    const nameExits = await pool.query(
      departmentQueries.CHECK_DEPARTMENT_NAME_EXISTS,
      [name, user?.schoolId]
    );
    if (nameExits.rows.length > 0) {
      return res.status(400).json(
        ResponseStructure({
          message: "Department name already exists.",
          code: 400,
          subCode: "NAME_EXISTS",
          errors: [
            {
              field: "name",
              errorMessage: "Department name already exists.",
            },
          ],
        })
      );
    }

    if (headOfDepartment) {
      const hodExists = await pool.query(departmentQueries.CHECK_HOD_EXISTS, [
        headOfDepartment,
        user?.schoolId,
      ]);
      if (hodExists.rows.length > 0) {
        return res.status(400).json(
          ResponseStructure({
            message: `User is already head of ${hodExists.rows[0].name} department.`,
            code: 400,
            subCode: "HOD_EXISTS",
            errors: [
              {
                field: "headOfDepartment",
                errorMessage: "Head of department already exists.",
              },
            ],
          })
        );
      }
    }

    const department = await pool.query(departmentQueries.CREATE_DEPARTMENT, [
      user?.schoolId,
      name,
      headOfDepartment || null,
      departmentCode || null,
    ]);
    if (!department.rows.length) {
      return res.status(500).json(
        ResponseStructure({
          message: "Error creating department.",
          code: 500,
          subCode: "CREATION_FAILED",
          errors: [
            {
              errorMessage: "Error creating department.",
              field: "server",
            },
          ],
        })
      );
    }

    return res.status(200).json(
      ResponseStructure({
        message: "Department created successfully.",
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

const updateDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, headOfDepartment, departmentCode } = req.body;
  const sanitizedHead = headOfDepartment?.trim() || null;

  try {
    const department = await pool.query(departmentQueries.UPDATE_DEPARTMENT, [
      Number(id),
      name,
      sanitizedHead,
      departmentCode,
    ]);
    if (!department.rows.length) {
      return res.status(500).json(
        ResponseStructure({
          message: "Error updating department.",
          code: 500,
          subCode: "UPDATE_FAILED",
          errors: [
            {
              errorMessage: "Error updating department.",
              field: "server",
            },
          ],
        })
      );
    }

    return res.status(200).json(
      ResponseStructure({
        message: "Department updated successfully.",
        code: 200,
        subCode: "SUCCESS",
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

const getDepartments = async (req: Request, res: Response) => {
  const user = res.locals.user;
  try {
    const departments = await pool.query(departmentQueries.GET_DEPARTMENTS, [
      user?.schoolId,
    ]);
    if (departments.rows.length === 0) {
      return res.status(404).json(
        ResponseStructure({
          message: "No department found.",
          code: 404,
          subCode: "NOT_FOUND",
          errors: [
            {
              field: "unknown",
              errorMessage: "No department found.",
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
        data: departments.rows,
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

const getSingleDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const departments = await pool.query(
      departmentQueries.GET_SINGLE_DEPARTMENT,
      [Number(id)]
    );
    if (departments.rows.length === 0) {
      return res.status(404).json(
        ResponseStructure({
          message: "No department found.",
          code: 404,
          subCode: "NOT_FOUND",
          errors: [
            {
              field: "unknown",
              errorMessage: "No department found.",
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
        data: departments.rows,
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

const deleteDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(departmentQueries.DELETE_DEPARTMENT, [
      Number(id),
    ]);

    if (result.rows.length === 0) {
      // nothing was deleted → likely invalid id
      return res.status(404).json(
        ResponseStructure({
          message: "Department not found",
          code: 404,
          subCode: "NOT_FOUND",
          errors: [
            {
              errorMessage: "No department exists with that ID.",
              field: "id",
            },
          ],
        })
      );
    }

    // success
    return res.status(200).json(
      ResponseStructure({
        message: "Department deleted successfully",
        code: 200,
        subCode: "DELETION_SUCCESS",
        data: { deletedId: result.rows[0].id },
      })
    );
  } catch (error) {
    console.error("Delete error", error);
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

export {
  createDepartment,
  getDepartments,
  updateDepartment,
  getSingleDepartment,
  deleteDepartment,
};
