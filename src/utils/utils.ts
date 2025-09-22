require("dotenv").config();
import jwt, { Secret } from "jsonwebtoken";
import { ApiResponse } from "../types/shared";

export const generateAccessToken = (jwtPayload: any) => {
  return jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET_KEY as Secret, {
    expiresIn: "1d",
  });
};

export const generatePasswordResetToken = (jwtPayload: any) => {
  return jwt.sign(
    jwtPayload,
    process.env.PASSWORD_RESET_TOKEN_SECRET_KEY as Secret,
    { expiresIn: "30m" }
  );
};

export const generateEmailVerificationToken = (jwtPayload: any) => {
  return jwt.sign(
    jwtPayload,
    process.env.EMAIL_VERIFICATION_TOKEN_SECRET_KEY as Secret,
    { expiresIn: "1h" }
  );
};

export default function generateVerificationCode() {
  var random_string = "";
  var characters = "0123456789";

  for (var i = 0; i < 4; i++) {
    random_string += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return random_string;
}

export function ResponseStructure<T>(props: ApiResponse<T>): ApiResponse<T> {
  return {
    message: props.message,
    code: props.code,
    data: props.data,
    subCode: props.subCode,
    errors: props.errors ?? null,
  };
}

export const imageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
];

export const excelMimeTypes = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
  "text/csv", // .csv (often used with Excel data)
  "application/vnd.ms-excel.sheet.macroEnabled.12", // .xlsm
  "application/vnd.ms-excel.template.macroEnabled.12", // .xltm
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template", // .xltx
];

export const isImageFile = (mimetype: string): boolean => {
  return imageMimeTypes.includes(mimetype);
};

export const isExcelFile = (mimetype: string): boolean => {
  return excelMimeTypes.includes(mimetype);
};

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0; // random number 0-15
    const v = c === "x" ? r : (r & 0x3) | 0x8; // for "y" keep it in 8–b range
    return v.toString(16);
  });
}

export function generatePassword(): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
