import { Router } from "express";
import { z } from "zod";
import { User, verifyPassword } from "../models/User";
import { signToken, requireAdmin, currentUser } from "../middleware/auth";
import { HttpError, parse } from "../middleware/error";
import { loginLimiter } from "../middleware/limits";

export const authRouter = Router();

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
const DUMMY_HASH = "$2a$12$C6UzMDM.H6dfI/f/IKcEeO5Q0l5mUq0m7yq4q6hE6q8s3Yk1bQ6bW";

authRouter.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = parse(loginSchema, req.body);
  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  const ok = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) throw new HttpError(401, "Incorrect email or password");
  const token = signToken({ sub: user.id, email: user.email, role: "admin" });
  res.json({ token, user });
});

authRouter.get("/me", requireAdmin, async (req, res) => {
  const payload = currentUser(req)!;
  const user = await User.findById(payload.sub);
  if (!user) throw new HttpError(401, "Account no longer exists");
  res.json({ user });
});
