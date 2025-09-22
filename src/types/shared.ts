import { Request, Response } from "express";

export interface ApiError {
  field: string;
  errorMessage: string;
}

export interface ApiResponse<T = Record<string, unknown>> {
  message: string;
  code: number;
  data?: T;
  subCode: string;
  errors?: ApiError[] | null;
}

export interface EnhancedRequest extends Request {
  uploadResult?: {
    type: "image" | "excel";
    data: any;
  };
}

export interface ValidatedRow {
  firstName: string;
  lastName: string;
  contactEmail: string;
  contactPhoneNumber: string;
}

export interface InvalidRow extends Partial<ValidatedRow> {
  rowNumber: number;
  errors: string[];
}