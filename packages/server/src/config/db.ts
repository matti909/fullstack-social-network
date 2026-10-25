import "temporal-polyfill/full/global";
import "dotenv/config";
import { readFileSync } from "node:fs";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../../prisma/contract.js";

const contractJson = JSON.parse(
  readFileSync(new URL("../../prisma/contract.json", import.meta.url), "utf-8"),
);

const url = process.env["DATABASE_URL"];

if (!url) {
  throw new Error("DATABASE_URL no está definida");
}

export const db = postgres<Contract>({ contractJson, url });
