import type { db } from "../config/db.js";
import type { Models } from "../../prisma/contract.js";

export type AuthUser = Pick<
  Models.public_User,
  "id" | "email" | "username" | "fullName" | "createdAt"
>;

export interface AppContext {
  db: typeof db;
  authUser: AuthUser | null;
}
