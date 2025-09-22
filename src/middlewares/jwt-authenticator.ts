require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { ResponseStructure } from "../utils/utils";

export const authenticateAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(400).json(
      ResponseStructure({
        message: "Unauthorized",
        code: 400,
        subCode: "UNAUTHORIZED",
        errors: [
          {
            field: "unknown",
            errorMessage: "User not Authenticated",
          },
        ],
      })
    );
    return;
  }

  jwt.verify(
    token as string,
    process.env.ACCESS_TOKEN_SECRET_KEY as Secret,
    (error, decode) => {
      if (error) {
        res.status(401).json(
          ResponseStructure({
            message: "Unauthorized",
            code: 401,
            subCode: "UNAUTHORIZED",
            errors: [
              {
                field: "unknown",
                errorMessage: "User not Authenticated",
              },
            ],
          })
        );
        return;
      }

      res.locals.user = decode;

      next();
    }
  );
};
export const authenticateEmailVerificationToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(400).json(
      ResponseStructure({
        message: "Unauthorized",
        code: 400,
        subCode: "UNAUTHORIZED",
        errors: [
          {
            field: "unknown",
            errorMessage: "User not Authenticated",
          },
        ],
      })
    );
    return;
  }

  jwt.verify(
    token as string,
    process.env.EMAIL_VERIFICATION_TOKEN_SECRET_KEY as Secret,
    (error, decode) => {
      if (error) {
        res.status(401).json(
          ResponseStructure({
            message: "Unauthorized",
            code: 401,
            subCode: "UNAUTHORIZED",
            errors: [
              {
                field: "unknown",
                errorMessage: "User not Authenticated",
              },
            ],
          })
        );
        return;
      }

      res.locals.user = decode;

      next();
    }
  );
};
