import "temporal-polyfill/full/global";
import "dotenv/config";
import { readFileSync } from "node:fs";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../../prisma/contract.js";

// contract.json se lee con fs (mismo patrón que graphql/schema.ts con el .graphql):
// un import ESM con `with { type: "json" }` exigiría `resolveJsonModule` en
// tsconfig y rompería el `rootDir: src`, porque prisma/ vive fuera de src/.
const contractJson = JSON.parse(
  readFileSync(new URL("../../prisma/contract.json", import.meta.url), "utf-8"),
);

const url = process.env["DATABASE_URL"];

if (!url) {
  throw new Error("DATABASE_URL no está definida");
}

// Singleton: vive lo que dure el proceso. El pool conecta en la primera
// query (lazy); el servidor nunca llama a db.close().
export const db = postgres<Contract>({ contractJson, url });
