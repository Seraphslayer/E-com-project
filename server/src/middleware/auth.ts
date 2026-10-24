import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { HttpError } from "./error";

export interface AuthPayload {
  sub: string;
  email: string;
  role: "admin";
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

/** Requires `Authorization: Bearer <token>` from a signed-in admin. */
export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw new HttpError(401, "Sign in required");
  try {
    const payload = jwt.verify(header.slice(7), config.JWT_SECRET) as AuthPayload;
    if (payload.role !== "admin") throw new Error("not admin");
    res_locals(req).user = payload;
    next();
  } catch {
    throw new HttpError(401, "Invalid or expired session");
  }
}

function res_locals(req: Request) {
  return req as Request & { user?: AuthPayload };
}
export const currentUser = (req: Request) => res_locals(req).user;
