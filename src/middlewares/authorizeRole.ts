import { Request, Response, NextFunction } from "express";
import { ResponseStructure } from "../utils/utils";

export function authorizeRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user?.role || user.role !== role) {
      return res.status(401).json(
        ResponseStructure({
          message: "Unauthorized access.",
          code: 401,
          subCode: "UNAUTHORIZED",
          errors: [
            {
              field: "unknown",
              errorMessage: "Unauthorized.",
            },
          ],
        })
      );
    }

    next();
  };
}
