import { Types, SchemaOptions } from "mongoose";

/** String ids (e.g. "p1", "ORD-20101") so they match what the frontend already uses. */
export const stringId = {
  type: String,
  default: () => new Types.ObjectId().toString(),
};

/** Exposes `_id` as `id` and hides `__v` in API responses. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const jsonOptions: SchemaOptions<any> = {
  timestamps: true,
  toJSON: {
    versionKey: false,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.passwordHash;
      return ret;
    },
  },
};
