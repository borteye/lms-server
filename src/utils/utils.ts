require("dotenv").config();
import jwt, { Secret } from "jsonwebtoken";
import { ApiResponse } from "../types/shared";

export const generateAccessToken = (jwtPayload: any) => {
  return jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET_KEY as Secret, {
    expiresIn: "2d",
  });
};

export const generatePasswordResetToken = (jwtPayload: any) => {
  return jwt.sign(
    jwtPayload,
    process.env.PASSWORD_RESET_TOKEN_SECRET_KEY as Secret,
    { expiresIn: "30m" }
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
