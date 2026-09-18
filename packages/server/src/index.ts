import express from "express";
import type { Application, Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import cors from "cors";
import { initDatabase } from "./db/init.js";

const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "world",
  },
};

const PORT = 4000;
const app: Application = express();
const httpServer = http.createServer(app);

const server: ApolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await initDatabase();
await server.start();

app.use("/graphql", cors(), express.json(), expressMiddleware(server));

app.get("/", (_req: Request, res: Response) => res.send("Express is successfully running!"));

await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, () => resolve()));
console.log(`🚀 Server ready at http://localhost:${PORT}`);
