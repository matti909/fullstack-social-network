import express from "express";
import type { Application, Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import cors from "cors";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import type { AppContext } from "./graphql/context.js";
import { db } from "./config/db.js";
import { getAuthUser } from "./config/jwt.js";

const PORT = 4000;
const app: Application = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(express.json());

const server = new ApolloServer<AppContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

try {
  await db.connect();
} catch (error) {
  console.error("Database connection error:", error);
  process.exit(1);
}

app.use(
  "/graphql",
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }): Promise<AppContext> => ({
      db,
      authUser: await getAuthUser(req.headers.authorization?.split(" ")[1]),
    }),
  }),
);

app.get("/", (_req: Request, res: Response) => res.send("Express is successfully running!"));

httpServer.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
