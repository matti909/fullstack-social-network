import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import cors from "cors";
import { initDatabase } from "./config/database.js";
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
const app = express();
const httpServer = http.createServer(app);
app.use(cors());
app.use(express.json());
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await initDatabase();
await server.start();
app.use("/graphql", cors(), express.json(), expressMiddleware(server));
app.get("/", (_req, res) => res.send("Express is successfully running!"));
await new Promise((resolve) => httpServer.listen({ port: PORT }, () => resolve()));
console.log(`🚀 Server ready at http://localhost:${PORT}`);
//# sourceMappingURL=index.js.map