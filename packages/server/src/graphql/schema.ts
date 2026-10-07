import { readFileSync } from "node:fs";

// Carga el SDL desde schema.graphql con ruta absoluta al archivo
// (readFileSync("schema.graphql") a secas resuelve contra el CWD del proceso
// y se rompe según desde dónde se arranque: packages/server vs src/graphql).
// ApolloServer acepta el string directo, sin graphql-tag de por medio.
export const typeDefs = readFileSync(new URL("./schema.graphql", import.meta.url), "utf-8");
