import { jwtVerify, SignJWT } from "jose";
import { db } from "./db.js";
import type { AuthUser } from "../graphql/context.js";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} no está definida`);
  }
  return value;
}

const jwtKey = new TextEncoder().encode(requiredEnv("JWT_SECRET"));

export async function signToken(userId: number, email: string): Promise<string> {
  return await new SignJWT({ id: userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(jwtKey);
}

export async function getAuthUser(token: string | undefined): Promise<AuthUser | null> {
  if (!token) return null;

  let payload: { id: unknown };
  try {
    payload = (await jwtVerify(token, jwtKey)).payload as { id: unknown };
  } catch {
    return null;
  }

  if (typeof payload.id !== "number") return null;

  const row = await db.orm.public.User.where({ id: payload.id }).first();
  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    username: row.username,
    fullName: row.fullName,
    createdAt: row.createdAt,
  };
}
